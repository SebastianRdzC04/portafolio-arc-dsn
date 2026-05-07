---
title: "Replicacion de bases de datos NoSQL: El caso de MongoDB"
description: "Analisis detallado de las estrategias de replicacion, seguridad y administracion en bases de datos NoSQL, con un enfoque en MongoDB como caso de estudio."
date: 2026-05-07
draft: false
order: 1
tags: ["administracion-de-bases-de-datos", "replicacion-nosql", "mongodb", "seguridad", "replica-sets"]

---

# **Tratado sobre la Administración de Seguridad y Arquitecturas de Alta Disponibilidad en Ecosistemas NoSQL: El Caso de MongoDB**

La gestión de bases de datos ha experimentado una metamorfosis radical desde la rigidez de los esquemas relacionales hacia la flexibilidad del modelo NoSQL. En este panorama, la seguridad no puede ser considerada como un componente periférico o una capa superpuesta a posteriori, sino que debe integrarse en la arquitectura misma del sistema. MongoDB, como exponente líder de las bases de datos orientadas a documentos, ofrece una plataforma robusta para el manejo de volúmenes masivos de datos (concepto derivado de su nombre "humongous"), pero su potencia y flexibilidad exigen una comprensión profunda de los mecanismos de protección, replicación y consistencia (DataCamp, s. f.). Este informe técnico analiza de manera exhaustiva las estrategias de seguridad en administraciones no relacionales, enfocándose en la transición del modelo Maestro-Esclavo hacia los Replica Sets y la implementación de controles de acceso de alta granularidad.

## Índice

- [Tratado sobre la Administración de Seguridad y Arquitecturas de Alta Disponibilidad en Ecosistemas NoSQL: El Caso de MongoDB](#tratado-sobre-la-administración-de-seguridad-y-arquitecturas-de-alta-disponibilidad-en-ecosistemas-nosql-el-caso-de-mongodb)
- [Fundamentos Teóricos y Filosofía NoSQL](#fundamentos-teóricos-y-filosofía-nosql)
- [Evolución de las Arquitecturas de Replicación](#evolución-de-las-arquitecturas-de-replicación)
  - [El Modelo Maestro-Esclavo (Legacy)](#el-modelo-maestro-esclavo-legacy)
  - [Replica Sets: El Estándar de Alta Disponibilidad](#replica-sets-el-estándar-de-alta-disponibilidad)
  - [La Falacia del Modelo Maestro-Maestro en NoSQL](#la-falacia-del-modelo-maestro-maestro-en-nosql)
- [Administración de Seguridad en el Servidor: Hardening Inicial](#administración-de-seguridad-en-el-servidor-hardening-inicial)
  - [Aislamiento de Red y Control de Puertos](#aislamiento-de-red-y-control-de-puertos)
  - [Activación de la Autorización](#activación-de-la-autorización)
- [Manual de Gestión de Usuarios y Roles (RBAC)](#manual-de-gestión-de-usuarios-y-roles-rbac)
  - [Creación del Administrador del Sistema](#creación-del-administrador-del-sistema)
  - [Roles Integrados y su Aplicación Operativa](#roles-integrados-y-su-aplicación-operativa)
  - [Definición de Roles Personalizados](#definición-de-roles-personalizados)
- [Seguridad en la Comunicación Interna: Autenticación por Keyfile](#seguridad-en-la-comunicación-interna-autenticación-por-keyfile)
  - [Teoría y Mecanismo del Keyfile](#teoría-y-mecanismo-del-keyfile)
  - [Configuración en Consola](#configuración-en-consola)
- [Autenticación Avanzada mediante Certificados x.509](#autenticación-avanzada-mediante-certificados-x509)
  - [Configuración del Servidor para mTLS](#configuración-del-servidor-para-mtls)
  - [Gestión de Usuarios Externos ($external)](#gestión-de-usuarios-externos-)
- [Auditoría y Monitoreo de Seguridad](#auditoría-y-monitoreo-de-seguridad)
  - [Configuración de la Auditoría](#configuración-de-la-auditoría)
  - [Filtros de Auditoría para Cumplimiento](#filtros-de-auditoría-para-cumplimiento)
- [Estrategias de Backup y Recuperación de Datos](#estrategias-de-backup-y-recuperación-de-datos)
  - [Herramientas Nativas: mongodump y mongorestore](#herramientas-nativas-mongodump-y-mongorestore)
- [Conclusiones y Futuro de la Seguridad NoSQL](#conclusiones-y-futuro-de-la-seguridad-nosql)
- [Referencias (formato APA 7)](#referencias-formato-apa-7)

## **Fundamentos Teóricos y Filosofía NoSQL**

Para abordar la seguridad en MongoDB, es imperativo comprender la distinción entre los principios transaccionales clásicos y los sistemas distribuidos modernos. Mientras que las bases de datos relacionales tradicionales se rigen por el modelo ACID (Atomicidad, Consistencia, Aislamiento y Durabilidad), las bases de datos NoSQL suelen adoptar el modelo BASE (Basically Available, Soft state, Eventually consistent) (Oracle América Latina, s. f.). Esta distinción no es puramente semántica; tiene implicaciones directas en cómo se protegen los datos y cómo se garantiza su integridad en entornos donde la alta disponibilidad y el escalado horizontal son las prioridades fundamentales (Oracle América Latina, s. f.).

| Característica | Modelo ACID | Modelo BASE | Implicación en Seguridad |
| :---- | :---- | :---- | :---- |
| **Consistencia** | Inmediata y estricta en cada operación. | Eventual; los nodos se sincronizan asíncronamente. | Riesgo de lectura de datos obsoletos durante sincronización. |
| **Disponibilidad** | Puede sacrificarse ante fallos de red. | Priorizada; el sistema sigue operando. | Necesidad de autenticación interna entre nodos. |
| **Estado** | Persistente y definido tras cada commit. | Estado "suave" que cambia dinámicamente. | Auditoría compleja de estados intermedios. |
| **Aislamiento** | Transacciones simultáneas no interfieren. | El aislamiento es relajado para mejorar rendimiento. | Control estricto sobre escrituras concurrentes. |

El uso de esquemas dinámicos basados en BSON (Binary JSON) permite a los desarrolladores iterar rápidamente, pero también introduce el desafío de la validación de esquemas en tiempo de ejecución para prevenir la inyección de datos malformados (DataCamp, s. f.). En MongoDB, la seguridad se construye sobre cuatro pilares fundamentales: el control de acceso a la red, la autenticación de identidades, la autorización de acciones mediante roles y el cifrado de datos tanto en reposo como en tránsito (STR Sistemas, s. f.).

## **Evolución de las Arquitecturas de Replicación**

La replicación es la estrategia mediante la cual los datos se distribuyen en múltiples servidores para asegurar la redundancia y la tolerancia a fallos. En el ecosistema MongoDB, la arquitectura ha evolucionado para eliminar los puntos únicos de fallo y automatizar la recuperación ante desastres (SlideShare, s. f.).

### **El Modelo Maestro-Esclavo (Legacy)**

En las versiones iniciales de MongoDB, la arquitectura Maestro-Esclavo era la norma. En este esquema, un solo nodo maestro procesaba todas las operaciones de escritura, mientras que uno o más nodos esclavos replicaban el registro de operaciones (oplog) para servir consultas de lectura (GeeksforGeeks, s. f.). Sin embargo, esta estructura presentaba vulnerabilidades operativas críticas: si el maestro fallaba, los esclavos permanecían en modo de solo lectura hasta que un administrador intervenía manualmente para promover un nuevo maestro (Stack Overflow, s. f.).

Desde la versión 3.6 de MongoDB, la replicación Maestro-Esclavo se considera obsoleta y ha sido reemplazada por los Replica Sets (Stack Overflow, s. f.). Desde una perspectiva de seguridad, el modelo antiguo era deficiente porque la autenticación entre maestro y esclavo era rudimentaria y no facilitaba el cambio dinámico de credenciales en caso de compromiso de un nodo (Stack Overflow, s. f.).

### **Replica Sets: El Estándar de Alta Disponibilidad**

Un Replica Set es un grupo de instancias de mongod que mantienen el mismo conjunto de datos, pero con un mecanismo de elección automática incorporado. En esta arquitectura, se designa un nodo Primario que recibe todas las escrituras, mientras que los nodos Secundarios replican sus datos de forma asíncrona (GeeksforGeeks, s. f.).

| Rol del Nodo | Función Técnica | Requisito de Seguridad |
| :---- | :---- | :---- |
| **Primario** | Único punto de entrada para escrituras (Writes). | Auditoría estricta de comandos DDL y DML. |
| **Secundario** | Mantiene copias espejo; puede servir lecturas. | Cifrado de tráfico TLS/SSL entre nodos. |
| **Árbitro** | No almacena datos; solo vota en elecciones. | Autenticación mediante Keyfile para participar en votos. |

La seguridad en un Replica Set se refuerza mediante el uso de "Arbiters" cuando el número de nodos con datos es par, asegurando que siempre haya una mayoría para elegir un nuevo Primario sin necesidad de replicar los datos en una máquina adicional, lo que reduce la superficie de ataque al no exponer los datos sensibles en todos los nodos del clúster (Stack Overflow, s. f.).

### **La Falacia del Modelo Maestro-Maestro en NoSQL**

Una consulta recurrente entre arquitectos de sistemas es la implementación de un modelo Maestro-Maestro, donde múltiples nodos pueden aceptar escrituras sobre el mismo conjunto de datos simultáneamente. En sistemas distribuidos, esto genera conflictos de resolución de datos (conflict resolution) extremadamente complejos que a menudo terminan en pérdida de integridad (MongoDB, s. f.-b).

MongoDB aborda la escalabilidad de escritura no a través de un esquema Maestro-Maestro puro sobre la misma partición, sino mediante el **Sharding** (fragmentación). En una arquitectura fragmentada, la base de datos divide las colecciones en "chunks" distribuidos a través de múltiples fragmentos o shards (GeeksforGeeks, s. f.). Cada shard es, a su vez, un Replica Set con su propio Primario (GeeksforGeeks, s. f.). De esta manera, se logra que el sistema acepte escrituras concurrentes en diferentes servidores, pero manteniendo la autoridad de un único primario por cada fragmento de datos, garantizando así la consistencia (ScyllaDB, s. f.).

## **Administración de Seguridad en el Servidor: Hardening Inicial**

La configuración por defecto de MongoDB favorece la facilidad de uso sobre la protección. Por ello, la administración profesional de la seguridad comienza con el endurecimiento (hardening) del archivo de configuración del sistema, usualmente localizado en /etc/mongod.conf (STR Sistemas, s. f.).

### **Aislamiento de Red y Control de Puertos**

La exposición de una base de datos a la red pública es la causa principal de filtraciones masivas de datos. El parámetro net.bindIp debe restringirse a la dirección de la interfaz privada o a 127.0.0.1 durante la configuración inicial (STR Sistemas, s. f.). Es una práctica recomendada cambiar el puerto estándar 27017 por uno menos predecible para mitigar el escaneo automatizado de puertos (STR Sistemas, s. f.).

```bash
YAML

net:  
  port: 27019  
  bindIp: 127.0.0.1  
  tls:  
    mode: requireTLS  
    certificateKeyFile: /etc/ssl/mongodb.pem  
    CAFile: /etc/ssl/ca.pem
```

Además del aislamiento de IP, es imperativo deshabilitar interfaces administrativas obsoletas. Históricamente, MongoDB incluía interfaces HTTP y REST que podían exponer información sensible si no se protegían adecuadamente; en las versiones modernas, estas interfaces han sido eliminadas o deben permanecer desactivadas explícitamente (STR Sistemas, s. f.).

### **Activación de la Autorización**

Sin la activación explícita del control de acceso, MongoDB permite cualquier conexión sin credenciales. La directiva security.authorization debe establecerse en enabled para forzar el uso de RBAC (Control de Acceso Basado en Roles) (MongoDB, s. f.-d).

Un dato interesante y crítico es que, una vez activada la autorización, MongoDB permite una "excepción de localhost". Esto permite al administrador crear el primer usuario del sistema desde la propia máquina del servidor antes de que se cierren todos los accesos no autenticados (MongoDB, s. f.-d).

## **Manual de Gestión de Usuarios y Roles (RBAC)**

El Control de Acceso Basado en Roles (RBAC) es el mecanismo mediante el cual se otorgan privilegios a los usuarios. En lugar de asignar permisos individuales, se asignan roles que agrupan un conjunto de privilegios sobre recursos específicos (bases de datos o colecciones) (MongoDB, s. f.-d).

### **Creación del Administrador del Sistema**

La creación de usuarios se realiza a través del shell moderno de MongoDB, mongosh. El primer usuario debe tener el rol userAdminAnyDatabase o root en la base de datos admin (MongoDB, s. f.-e).

```bash
JavaScript

// Acceso inicial a la base de datos administrativa  
use admin

// Creación del superusuario con privilegios globales  
db.createUser({  
  user: "adminSeguridad",  
  pwd: passwordPrompt(), // Método seguro para evitar contraseñas en el historial de comandos  
  roles: \[ { role: "root", db: "admin" } \]  
})
```


### **Roles Integrados y su Aplicación Operativa**

MongoDB proporciona una jerarquía de roles predefinidos que cubren la mayoría de las necesidades operativas de una empresa (MongoDB, s. f.-d).

| Rol | Alcance del Privilegio | Caso de Uso |
| :---- | :---- | :---- |
| read | Lectura de datos en una DB específica. | Aplicaciones de reporting o analítica. |
| readWrite | Lectura y modificación de datos. | Usuario principal de la aplicación. |
| dbAdmin | Gestión de índices, estadísticas y limpieza. | Mantenimiento de rendimiento por DB. |
| clusterAdmin | Administración de réplicas y sharding. | Operaciones de infraestructura. |
| backup / restore | Privilegios para mongodump y mongorestore. | Procesos automatizados de respaldo. (MongoDB, s. f.-d) |

### **Definición de Roles Personalizados**

Para entornos con requerimientos de seguridad granulares, los roles integrados pueden ser demasiado amplios. MongoDB permite la creación de roles definidos por el usuario, especificando acciones exactas sobre recursos determinados (MongoDB, s. f.-d).

```bash
JavaScript

use admin  
db.createRole({  
  role: "auditorLectura",  
  privileges: \[  
    {   
      resource: { db: "finanzas", collection: "transacciones" },   
      actions: \["find"\]   
    }  
  \],  
  roles: // Puede heredar de otros roles si es necesario  
})
```

Este enfoque sigue el principio del menor privilegio, minimizando el impacto potencial de un compromiso de cuenta (MongoDB, s. f.-d).

## **Seguridad en la Comunicación Interna: Autenticación por Keyfile**

En un Replica Set o un clúster fragmentado, los nodos deben comunicarse entre sí para realizar tareas críticas como la replicación del oplog y la monitorización de latido (heartbeat). Si un atacante pudiera inyectar un nodo malicioso en el clúster, podría obtener una copia completa de los datos. Para evitar esto, se utiliza la autenticación de membresía interna mediante archivos de clave (Keyfiles) (MongoDB, s. f.-f).

### **Teoría y Mecanismo del Keyfile**

Un Keyfile actúa como un secreto compartido. Cada nodo en el clúster utiliza el contenido del archivo para demostrar su identidad ante los demás miembros (MongoDB, s. f.-f). El archivo debe contener una cadena de caracteres en formato base64 y su longitud debe estar entre 6 y 1024 caracteres (MongoDB, s. f.-f).

### **Configuración en Consola**

La configuración por consola se divide en tres pasos: crear el `keyFile`, ajustar `mongod.conf` en cada nodo e inicializar el `replica set` desde `mongosh` (MongoDB, s. f.-d; MongoDB, s. f.-f).

1. **Crear el `keyFile`**. MongoDB recomienda usar un archivo de clave compartido y restringir sus permisos antes de habilitar la autenticación interna (MongoDB, s. f.-f).

```bash
openssl rand -base64 756 > /var/lib/mongodb/mongodb-keyfile
chown mongodb:mongodb /var/lib/mongodb/mongodb-keyfile
chmod 400 /var/lib/mongodb/mongodb-keyfile
```

2. **Ajustar `mongod.conf`**. El mismo archivo debe existir en cada nodo del clúster y la configuración debe habilitar el control de acceso, el `keyFile` y el nombre del `replica set` (MongoDB, s. f.-d; MongoDB, s. f.-f).

```yaml
net:
  bindIp: 127.0.0.1,192.168.1.10
  port: 27017

security:
  authorization: enabled
  keyFile: /var/lib/mongodb/mongodb-keyfile

replication:
  replSetName: rs0
```

3. **Inicializar el clúster**. Desde `mongosh`, crea el usuario administrador y luego inicializa el `replica set` con sus miembros (MongoDB, s. f.-d; MongoDB, s. f.-e; MongoDB, s. f.-f).

```javascript
use admin

db.createUser({
  user: "admin",
  pwd: passwordPrompt(),
  roles: [{ role: "root", db: "admin" }]
})

rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017" },
    { _id: 1, host: "mongo2:27017" },
    { _id: 2, host: "mongo3:27017" }
  ]
})

rs.status()
```

Con esto queda listo el esquema básico de autenticación, control de acceso y réplica para un despliegue inicial (MongoDB, s. f.-d; MongoDB, s. f.-f).

## **Autenticación Avanzada mediante Certificados x.509**

Para organizaciones que requieren un nivel de seguridad superior a las contraseñas tradicionales, MongoDB soporta la autenticación mutua TLS (mTLS) utilizando certificados x.509. Este método es el estándar para despliegues empresariales y cumple con los requisitos de seguridad más estrictos del sector (MongoDB, s. f.-h).

### **Configuración del Servidor para mTLS**

El servidor debe configurarse con un certificado de identidad y una autoridad de certificación (CA) que valide los certificados de los clientes. El modo de TLS debe establecerse en requireTLS para asegurar que ninguna conexión viaje en texto plano (MongoDB, s. f.-h).
```bash
YAML

net:  
  tls:  
    mode: requireTLS  
    certificateKeyFile: /etc/ssl/server.pem  
    CAFile: /etc/ssl/ca-authority.crt
```
### **Gestión de Usuarios Externos ($external)**

A diferencia de los usuarios normales que se almacenan en la base de datos donde fueron creados, los usuarios autenticados mediante x.509 (o LDAP/Kerberos) deben registrarse en una base de datos especial llamada $external (MongoDB, s. f.-h).

Para crear un usuario x.509, el nombre del usuario debe coincidir exactamente con el "Subject" del certificado del cliente, formateado según la norma RFC2253 (MongoDB, s. f.-h).

**Comando de obtención del Subject:**

Bash

openssl x509 \-in cliente.pem \-inform PEM \-subject \-nameopt RFC2253 \-noout

**Comando de creación del usuario en mongosh:**
```bash

JavaScript

db.getSiblingDB("$external").runCommand({  
  createUser: "CN=miAplicacion,OU=Ingenieria,O=EmpresaX,L=Madrid,ST=Madrid,C=ES",  
  roles:,  
  writeConcern: { w: "majority" , wtimeout: 5000 }  
})
```

Este método elimina la necesidad de gestionar contraseñas en archivos de configuración de aplicaciones, ya que la identidad reside en el certificado digital, el cual puede ser rotado y revocado de manera centralizada por la infraestructura de clave pública (PKI) de la empresa (MongoDB, s. f.-h).

## **Auditoría y Monitoreo de Seguridad**

La seguridad es un proceso continuo que requiere visibilidad sobre las operaciones del sistema. MongoDB Enterprise proporciona una capacidad de auditoría avanzada que registra cada acción realizada contra la base de datos (MongoDB, s. f.-c).

### **Configuración de la Auditoría**

El sistema de auditoría puede configurarse para registrar eventos en diversos formatos. El formato BSON es más eficiente para el rendimiento del servidor, mientras que el formato JSON es más fácil de integrar con sistemas SIEM (Security Information and Event Management) de terceros (MongoDB, s. f.-c).

| Destino de Auditoría | Ventajas | Desventajas |
| :---- | :---- | :---- |
| **Syslog** | Centralización nativa en Linux. | No disponible en Windows; limitación de ráfagas. |
| **Console** | Útil para depuración en tiempo real. | No apto para persistencia a largo plazo. |
| **JSON File** | Alta legibilidad y compatibilidad. | Impacto moderado en el rendimiento. |
| **BSON File** | Máxima eficiencia de escritura. | Requiere bsondump para lectura humana (MongoDB, s. f.-c). |

### **Filtros de Auditoría para Cumplimiento**

Capturar absolutamente todas las operaciones puede degradar el rendimiento y generar "ruido" innecesario. Los filtros de auditoría permiten enfocarse en acciones críticas como fallos de autenticación o borrado de colecciones (MongoDB, s. f.-c).
```bash
YAML

auditLog:  
  destination: file  
  format: JSON  
  path: /var/log/mongodb/audit.json  
  filter: '{ atype: { $in: } }'

```

A partir de la versión 5.0, es posible modificar estos filtros en tiempo de ejecución sin necesidad de reiniciar el servicio, lo que permite a los equipos de seguridad aumentar la vigilancia durante incidentes en curso sin interrumpir la disponibilidad de la aplicación (MongoDB, s. f.-c).

## **Estrategias de Backup y Recuperación de Datos**

Incluso con la replicación activa, los backups son esenciales para protegerse contra errores humanos (como un dropDatabase accidental) o ataques de ransomware. La replicación protege contra fallos de hardware, pero no contra la corrupción lógica de los datos (MongoDB, s. f.-k).

### **Herramientas Nativas: mongodump y mongorestore**

Estas herramientas exportan e importan datos en formato BSON. Para garantizar la consistencia en un Replica Set, es vital utilizar la opción \--oplog durante el dump, lo que permite capturar un estado coherente de la base de datos en un punto exacto del tiempo (MongoDB, s. f.-i; MongoDB, s. f.-j).

Bash

\# Ejemplo de backup seguro con autenticación y TLS  
mongodump \--host="rs0/mongo1:27017,mongo2:27017" \\  
          \--ssl \--sslCAFile=ca.pem \\  
          \--username="backupUser" \--password="passwordSegura" \\  
          \--authenticationDatabase="admin" \\  
          \--out=/backups/$(date \+%F) \--oplog

Para entornos empresariales críticos, se recomienda la recuperación puntual (Point-in-Time Recovery), disponible a través de MongoDB Ops Manager o Atlas, que permite restaurar la base de datos a cualquier segundo específico del pasado reciente utilizando las copias de seguridad continuas del oplog (MongoDB, s. f.-l).

## **Conclusiones y Futuro de la Seguridad NoSQL**

La administración de seguridad en bases de datos no relacionales como MongoDB ha trascendido la simple configuración de puertos para convertirse en un ecosistema completo de protección de datos. La arquitectura de Replica Sets proporciona la base necesaria para la alta disponibilidad, mientras que herramientas como el cifrado TLS, la autenticación x.509 y la auditoría granular permiten cumplir con los estándares de cumplimiento más exigentes (MongoDB, s. f.-f; MongoDB, s. f.-h; MongoDB, s. f.-c).

Un dato interesante para el futuro es la adopción del esquema OCSF en MongoDB 8.0, que estandariza los logs de seguridad para facilitar la interoperabilidad entre diferentes plataformas de ciberseguridad, lo que sugiere un movimiento de la industria hacia una defensa más coordinada y automatizada (MongoDB, s. f.-c). La clave para una administración exitosa radica en el equilibrio entre la flexibilidad operativa y la vigilancia constante, tratando a la base de datos no como un silo aislado, sino como una pieza central y protegida del tejido de infraestructura de la organización.

## Referencias (formato APA 7)

DataCamp. (s. f.). *¿Qué es MongoDB? conceptos clave, casos de uso y buenas prácticas*. https://www.datacamp.com/es/blog/what-is-mongodb

GeeksforGeeks. (s. f.). *Replication and sharding in MongoDB*. https://www.geeksforgeeks.org/mongodb/mongodb-replication-and-sharding/

MangoHost. (s. f.). *Configuring keyfile authentication for MongoDB replica sets on Ubuntu 24*. https://mangohost.net/blog/configuring-keyfile-authentication-for-mongodb-replica-sets-on-ubuntu-24/

MongoDB. (s. f.-b). *Active-active application architectures with MongoDB*. https://www.mongodb.com/company/blog/technical/active-active-application-architectures-with-mongodb

MongoDB. (s. f.-c). *Auditing*. https://www.mongodb.com/docs/manual/core/auditing/

MongoDB. (s. f.-d). *Manage users and roles on self-managed deployments*. https://www.mongodb.com/docs/manual/tutorial/manage-users-and-roles/

MongoDB. (s. f.-e). *db.createUser() (mongosh method)*. https://www.mongodb.com/docs/manual/reference/method/db.createuser/

MongoDB. (s. f.-f). *Deploy self-managed replica set with keyfile authentication*. https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-with-keyfile-access-control/

MongoDB. (s. f.-g). *Update self-managed replica set to keyfile authentication*. https://www.mongodb.com/docs/manual/tutorial/enforce-keyfile-access-control-in-existing-replica-set/

MongoDB. (s. f.-h). *Use X.509 to authenticate clients on self-managed MongoDB*. https://www.mongodb.com/docs/manual/tutorial/configure-x509-client-authentication/

MongoDB. (s. f.-i). *mongodump*. https://www.mongodb.com/docs/database-tools/mongodump/

MongoDB. (s. f.-j). *mongorestore*. https://www.mongodb.com/docs/database-tools/mongorestore/

MongoDB. (s. f.-k). *Back up, restore, and archive data*. https://www.mongodb.com/docs/atlas/backup-restore-cluster/

MongoDB. (s. f.-l). *Restore from continuous cloud backup*. https://www.mongodb.com/docs/atlas/backup/cloud-backup/restore-from-continuous/

Oracle América Latina. (s. f.). *¿Qué es MongoDB? guía avanzada*. https://www.oracle.com/latam/database/mongodb/

ScyllaDB. (s. f.). *What is MongoDB cluster? definition & FAQs*. https://www.scylladb.com/glossary/mongodb-cluster/

SlideShare. (s. f.). *MongoDB scalability and high availability with replica set*. https://www.slideshare.net/slideshow/mongodb-scalability-and-high-availability-with-replicaset/27617066

Stack Overflow. (s. f.). *MongoDB replication or master-slave, how to choose?* https://stackoverflow.com/questions/34100329/mongodb-replication-or-master-slave-how-to-choose

STR Sistemas. (s. f.). *Seguridad en MongoDB*. https://www.strsistemas.com/blog/seguridad-en-mongodb
