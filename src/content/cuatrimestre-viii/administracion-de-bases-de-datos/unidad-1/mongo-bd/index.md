---
title: "prueba"
description: "holita jajaj"
date: 6-12-2026
---

![](/images/cuatri-8/admin-bd/mongodb/image-01.png)

# MONGODB

**Alumnos:**

- Jorge Luis Ibarra Villa
- Juan Antonio Deras Duron
- Jesus Alberto Villarreal Perez
- Luis Fernando Robles Ibarra
- Sebastian Rodriguez Contreras
- Anthony Fuentes Carrera

**Docente:**
MSC Ochoa del Toro David

**Institución:**
Universidad Tecnológica de Torreón

**Fecha:**
7 / Mayo / 2026

## Tabla de contenido

- [Copias de Seguridad y Restauración en MongoDB desde Compass en Windows: Procedimiento para la Recuperación de Datos](#copias-de-seguridad-y-restauracion-en-mongodb-desde-compass-en-windows-procedimiento-para-la-recuperacion-de-datos)
- [Resumen](#resumen)
- [Introducción](#introduccion)
- [Fundamento Técnico del Procedimiento](#fundamento-tecnico-del-procedimiento)
  - [Studio 3T como interfaz gráfica para MongoDB](#studio-3t-como-interfaz-grafica-para-mongodb)
  - [Relación entre Studio 3T, mongodump y mongorestore](#relacion-entre-studio-3t-mongodump-y-mongorestore)
  - [Justificación del formato BSON/mongodump](#justificacion-del-formato-bson-mongodump)
- [Herramientas y Requisitos Previos](#herramientas-y-requisitos-previos)
- [Procedimiento Gráfico en Studio 3T](#procedimiento-grafico-en-studio-3t)
  - [Conexión a MongoDB desde Studio 3T](#conexion-a-mongodb-desde-studio-3t)
  - [Configuración de herramientas externas de MongoDB](#configuracion-de-herramientas-externas-de-mongodb)
  - [Creación de la base de datos y colección de prueba](#creacion-de-la-base-de-datos-y-coleccion-de-prueba)
  - [Inserción de documentos de prueba](#insercion-de-documentos-de-prueba)
  - [Verificación de los datos antes del respaldo](#verificacion-de-los-datos-antes-del-respaldo)
  - [Creación de la copia de seguridad con Export Wizard](#creacion-de-la-copia-de-seguridad-con-export-wizard)
  - [Verificación del archivo de respaldo](#verificacion-del-archivo-de-respaldo)
  - [Simulación de pérdida de información](#simulacion-de-perdida-de-informacion)
  - [Restauración del respaldo con Import Wizard](#restauracion-del-respaldo-con-import-wizard)
  - [Verificación de la restauración](#verificacion-de-la-restauracion)
- [Tabla Comparativa de Formatos de Respaldo y Exportación](#tabla-comparativa-de-formatos-de-respaldo-y-exportacion)
- [Problemas Comunes y Soluciones](#problemas-comunes-y-soluciones)
- [Studio 3T no encuentra mongorestore](#studio-3t-no-encuentra-mongorestore)
- [No aparece la opción BSON/mongodump](#no-aparece-la-opcion-bson-mongodump)
- [El respaldo se restaura pero no aparecen los documentos](#el-respaldo-se-restaura-pero-no-aparecen-los-documentos)
- [Se generan duplicados o errores de _id](#se-generan-duplicados-o-errores-de-id)
- [El archivo archive no se puede importar](#el-archivo-archive-no-se-puede-importar)
- [Confusión entre interfaz gráfica y consola](#confusion-entre-interfaz-grafica-y-consola)
- [Consideraciones de Integridad y Confiabilidad](#consideraciones-de-integridad-y-confiabilidad)
- [Conclusión](#conclusion)
- [AUTOMATIZACIÓN DE TAREAS EN MONGODB](#automatizacion-de-tareas-en-mongodb)
- [Descargar MongoDB Community Server](#descargar-mongodb-community-server)
- [Respaldos automatizados.](#respaldos-automatizados)
  - [Caso de Uso](#caso-de-uso)
  - [Creación de BD de prueba.](#creacion-de-bd-de-prueba)
  - [Creación de archivo .bat.](#creacion-de-archivo-bat)
  - [Buscar el Programador de Tareas en Windows](#buscar-el-programador-de-tareas-en-windows)
  - [Crear una tarea básica](#crear-una-tarea-basica)
  - [Asignar nombre y descripción a la tarea](#asignar-nombre-y-descripcion-a-la-tarea)
  - [Seleccionar la frecuencia de ejecución](#seleccionar-la-frecuencia-de-ejecucion)
  - [Asignar hora y periodicidad](#asignar-hora-y-periodicidad)
  - [Seleccionar la acción "Iniciar un programa"](#seleccionar-la-accion-iniciar-un-programa)
  - [Escoger la ruta del archivo .bat](#escoger-la-ruta-del-archivo-bat)
  - [Finalizar la configuración](#finalizar-la-configuracion)
- [¿Qué se automatizo?](#que-se-automatizo)
- [Herramientas utilizadas:](#herramientas-utilizadas)
- [Exportación automática de datos de MongoDB a CSV](#exportacion-automatica-de-datos-de-mongodb-a-csv)
  - [Caso de uso.](#caso-de-uso-1)
  - [Preparar los datos de prueba.](#preparar-los-datos-de-prueba)
  - [Crear una carpeta para las exportaciones.](#crear-una-carpeta-para-las-exportaciones)
  - [Crear el archivo .bat llamado exportar_empleados.bat para la exportación automática.](#crear-el-archivo-bat-llamado-exportar-empleados-bat-para-la-exportacion-automatica)
  - [Programar la tarea con el Programador de tareas.](#programar-la-tarea-con-el-programador-de-tareas)
- [Automatización de actualización de estados.](#automatizacion-de-actualizacion-de-estados)
  - [Caso de uso.](#caso-de-uso-2)
  - [Preparar los datos de prueba](#preparar-los-datos-de-prueba-1)
  - [Crear el script de automatización (.js)](#crear-el-script-de-automatizacion-js)
  - [Crear el archivo .bat](#crear-el-archivo-bat)
  - [Programar la tarea con el Programador de tareas](#programar-la-tarea-con-el-programador-de-tareas-1)
- [Automatización de tareas en Linux.](#automatizacion-de-tareas-en-linux)
  - [Instalación del ecosistema de MongoDB en Arch Linux usando Docker](#instalacion-del-ecosistema-de-mongodb-en-arch-linux-usando-docker)
  - [Actualizar el sistema](#actualizar-el-sistema)
  - [Instalar Docker](#instalar-docker)
  - [Habilitar e iniciar Docker](#habilitar-e-iniciar-docker)
  - [Agregar el usuario al grupo docker](#agregar-el-usuario-al-grupo-docker)
  - [Descargar y ejecutar MongoDB en un contenedor](#descargar-y-ejecutar-mongodb-en-un-contenedor)
  - [Verificar que el contenedor esté funcionando](#verificar-que-el-contenedor-este-funcionando)
  - [Acceder a MongoDB Shell](#acceder-a-mongodb-shell)
  - [Verificación de funcionamiento](#verificacion-de-funcionamiento)
- [Eliminación de respaldos automático.](#eliminacion-de-respaldos-automatico)
  - [Crear la estructura de directorios.](#crear-la-estructura-de-directorios)
  - [Crear el script de bash para la limpieza de archivos.](#crear-el-script-de-bash-para-la-limpieza-de-archivos)
  - [Crear la configuración del Cron.](#crear-la-configuracion-del-cron)
  - [Crear el Dockerfile.](#crear-el-dockerfile)
  - [Configurar Docker Compose.](#configurar-docker-compose)
  - [Levantar y probar el contendor.](#levantar-y-probar-el-contendor)
- [Pre-cálculo de Reportes.](#pre-calculo-de-reportes)
  - [Caso de uso.](#caso-de-uso-3)
  - [Preparar los datos de prueba.](#preparar-los-datos-de-prueba-2)
  - [Crear la estructura de directorios.](#crear-la-estructura-de-directorios-1)
  - [Crear el script de Agregación de MongoDB.](#crear-el-script-de-agregacion-de-mongodb)
  - [Crear la configuración del Cron.](#crear-la-configuracion-del-cron-1)
  - [Crear el Dockerfile.](#crear-el-dockerfile-1)
  - [Configurar Docker Compose.](#configurar-docker-compose-1)
  - [Levantar y probar el contenedor.](#levantar-y-probar-el-contenedor)
- [Archivo de datos históricos (Data Tiering).](#archivo-de-datos-historicos-data-tiering)
  - [Caso de uso.](#caso-de-uso-4)
  - [Preparar los datos de prueba.](#preparar-los-datos-de-prueba-3)
  - [Crear la estructura de directorios.](#crear-la-estructura-de-directorios-2)
  - [Creamos el script de Archivos de MongoDB.](#creamos-el-script-de-archivos-de-mongodb)
  - [Crear la configuración del Cron.](#crear-la-configuracion-del-cron-2)
  - [Crear el Dockerfile.](#crear-el-dockerfile-2)
  - [Configurar Docker Compose.](#configurar-docker-compose-2)
  - [Levantar y probar el contenedor.](#levantar-y-probar-el-contenedor-1)
- [EXPORTACIÓN E IMPORTACIÓN DE DATOS EN MONGODB MEDIANTE CONSOLA E INTERFAZ GRÁFICA](#exportacion-e-importacion-de-datos-en-mongodb-mediante-consola-e-interfaz-grafica)
- [Introducción](#introduccion-1)
- [2. Objetivo General](#2-objetivo-general)
- [Objetivos Específicos](#objetivos-especificos)
- [Marco Teórico](#marco-teorico)
  - [MongoDB](#mongodb)
  - [Exportación e Importación de Datos](#exportacion-e-importacion-de-datos)
- [Herramientas Utilizadas](#herramientas-utilizadas-1)
- [MongoDB Community Server](#mongodb-community-server)
- [MongoDB Compass](#mongodb-compass)
- [Studio 3T](#studio-3t)
- [Exportación e Importación Mediante Consola](#exportacion-e-importacion-mediante-consola)
  - [Acceso a MongoDB](#acceso-a-mongodb)
  - [Creación de Base de Datos](#creacion-de-base-de-datos)
  - [Creación de Colección](#creacion-de-coleccion)
  - [Inserción de Datos](#insercion-de-datos)
  - [Exportación de Datos en JSON](#exportacion-de-datos-en-json)
  - [Exportación de Datos en CSV](#exportacion-de-datos-en-csv)
  - [Importación de Datos JSON](#importacion-de-datos-json)
  - [Importación de Datos CSV](#importacion-de-datos-csv)
  - [Verificación de Datos](#verificacion-de-datos)
  - [Exportación completa (Dump)](#exportacion-completa-dump)
  - [Importación completa (Restore)](#importacion-completa-restore)
  - [Restricción de Exportación e Importación Mediante Roles](#restriccion-de-exportacion-e-importacion-mediante-roles)
  - [Creación del Usuario](#creacion-del-usuario)
  - [Conexión con el Usuario](#conexion-con-el-usuario)
  - [Verificación de Consulta de Datos](#verificacion-de-consulta-de-datos)
  - [Intento de Importación de Datos](#intento-de-importacion-de-datos)
  - [Exportación Permitida](#exportacion-permitida)
  - [Resultados Obtenidos](#resultados-obtenidos)
  - [Conclusión](#conclusion-1)
- [Exportación e Importación Mediante Interfaz Gráfica (Compass)](#exportacion-e-importacion-mediante-interfaz-grafica-compass)
  - [Acceso a MongoDB Compass](#acceso-a-mongodb-compass)
  - [Conexión al Servidor](#conexion-al-servidor)
  - [Creación de Base de Datos y Colección](#creacion-de-base-de-datos-y-coleccion)
  - [Inserción de Documentos](#insercion-de-documentos)
  - [Exportación de Datos](#exportacion-de-datos)
  - [Importación de Datos](#importacion-de-datos)
  - [Restricción de Importación por Permisos](#restriccion-de-importacion-por-permisos)
  - [Limitación de Exportación Atómica de Base de Datos en Compass](#limitacion-de-exportacion-atomica-de-base-de-datos-en-compass)
- [Exportación e Importación Mediante Interfaz Gráfica (Studio 3T)](#exportacion-e-importacion-mediante-interfaz-grafica-studio-3t)
  - [Acceso a Studio 3T](#acceso-a-studio-3t)
  - [Selección de la Colección](#seleccion-de-la-coleccion)
  - [Apertura de la Opción de Exportación](#apertura-de-la-opcion-de-exportacion)
  - [Exportación de Datos en Formato JSON](#exportacion-de-datos-en-formato-json)
  - [Exportación de Datos en Formato CSV](#exportacion-de-datos-en-formato-csv)
  - [Eliminación de la Colección](#eliminacion-de-la-coleccion)
  - [Verificación de Eliminación](#verificacion-de-eliminacion)
  - [Importación de Archivo JSON](#importacion-de-archivo-json)
  - [Selección del Archivo](#seleccion-del-archivo)
  - [Verificación de Restauración](#verificacion-de-restauracion)
  - [Exportación Completa de Base de Datos (Database Dump)](#exportacion-completa-de-base-de-datos-database-dump)
  - [Restauración Completa (Importación)](#restauracion-completa-importacion)
- [Ventajas y Desventajas](#ventajas-y-desventajas)
- [10. Problemas Comunes](#10-problemas-comunes)
- [11. Conclusión](#11-conclusion)
- [Tratado sobre la Administración de Seguridad y Arquitecturas de Alta Disponibilidad en Ecosistemas NoSQL: El Caso de MongoDB](#tratado-sobre-la-administracion-de-seguridad-y-arquitecturas-de-alta-disponibilidad-en-ecosistemas-nosql-el-caso-de-mongodb)
- [Fundamentos Teóricos y Filosofía NoSQL](#fundamentos-teoricos-y-filosofia-nosql)
- [Evolución de las Arquitecturas de Replicación](#evolucion-de-las-arquitecturas-de-replicacion)
  - [El Modelo Maestro-Esclavo (Legacy)](#el-modelo-maestro-esclavo-legacy)
  - [Replica Sets: El Estándar de Alta Disponibilidad](#replica-sets-el-estandar-de-alta-disponibilidad)
  - [La Falacia del Modelo Maestro-Maestro en NoSQL](#la-falacia-del-modelo-maestro-maestro-en-nosql)
- [Administración de Seguridad en el Servidor: Hardening Inicial](#administracion-de-seguridad-en-el-servidor-hardening-inicial)
  - [Aislamiento de Red y Control de Puertos](#aislamiento-de-red-y-control-de-puertos)
  - [Activación de la Autorización](#activacion-de-la-autorizacion)
- [Manual de Gestión de Usuarios y Roles (RBAC)](#manual-de-gestion-de-usuarios-y-roles-rbac)
  - [Creación del Administrador del Sistema](#creacion-del-administrador-del-sistema)
  - [Roles Integrados y su Aplicación Operativa](#roles-integrados-y-su-aplicacion-operativa)
  - [Definición de Roles Personalizados](#definicion-de-roles-personalizados)
- [Seguridad en la Comunicación Interna: Autenticación por Keyfile](#seguridad-en-la-comunicacion-interna-autenticacion-por-keyfile)
  - [Teoría y Mecanismo del Keyfile](#teoria-y-mecanismo-del-keyfile)
  - [Configuración en Consola](#configuracion-en-consola)
- [Autenticación Avanzada mediante Certificados x.509](#autenticacion-avanzada-mediante-certificados-x-509)
  - [Configuración del Servidor para mTLS](#configuracion-del-servidor-para-mtls)
  - [Gestión de Usuarios Externos ($external)](#gestion-de-usuarios-externos-external)
- [Auditoría y Monitoreo de Seguridad](#auditoria-y-monitoreo-de-seguridad)
  - [Configuración de la Auditoría](#configuracion-de-la-auditoria)
  - [Filtros de Auditoría para Cumplimiento](#filtros-de-auditoria-para-cumplimiento)
- [Estrategias de Backup y Recuperación de Datos](#estrategias-de-backup-y-recuperacion-de-datos)
  - [Herramientas Nativas: mongodump y mongorestore](#herramientas-nativas-mongodump-y-mongorestore)
- [Ejemplo de backup seguro con autenticación y TLS](#ejemplo-de-backup-seguro-con-autenticacion-y-tls)
- [Conclusiones y Futuro de la Seguridad NoSQL](#conclusiones-y-futuro-de-la-seguridad-nosql)
- [Conexión certificada: Autenticación Avanzada mediante Certificados x.509 (mTLS) en MongoDB](#conexion-certificada-autenticacion-avanzada-mediante-certificados-x-509-mtls-en-mongodb)
- [1. Introducción](#1-introduccion)
- [2. Objetivo general y específicos](#2-objetivo-general-y-especificos)
- [3. Marco teórico](#3-marco-teorico)
- [4. Herramientas utilizadas](#4-herramientas-utilizadas)
- [5. Implementación de conexión certificada](#5-implementacion-de-conexion-certificada)
  - [5.1 Generación de certificados](#5-1-generacion-de-certificados)
- [1. Crear la Autoridad Certificadora (CA)](#1-crear-la-autoridad-certificadora-ca)
- [2. Generar llave y solicitud del Servidor](#2-generar-llave-y-solicitud-del-servidor)
- [3. Crear archivo de extensiones SAN](#3-crear-archivo-de-extensiones-san)
- [4. Firmar el certificado del Servidor inyectando el SAN](#4-firmar-el-certificado-del-servidor-inyectando-el-san)
- [5. Empaquetar el certificado del Servidor](#5-empaquetar-el-certificado-del-servidor)
- [6. Generar llave y solicitud del Cliente](#6-generar-llave-y-solicitud-del-cliente)
- [7. Firmar el certificado del Cliente (El cliente no necesita SAN)](#7-firmar-el-certificado-del-cliente-el-cliente-no-necesita-san)
- [8. Empaquetar el certificado del Cliente](#8-empaquetar-el-certificado-del-cliente)
  - [5.2 Configuración del servidor (mongod.conf)](#5-2-configuracion-del-servidor-mongod-conf)
  - [5.3 Extracción del Subject del certificado cliente](#5-3-extraccion-del-subject-del-certificado-cliente)
  - [5.4 Creación del usuario en MongoDB](#5-4-creacion-del-usuario-en-mongodb)
  - [5.5 Habilitación del Control de Acceso (Authorization)](#5-5-habilitacion-del-control-de-acceso-authorization)
  - [5.6 Verificación de conexión segura](#5-6-verificacion-de-conexion-segura)
- [6. Ventajas y desventajas](#6-ventajas-y-desventajas)
- [7. Problemas comunes](#7-problemas-comunes)
- [8. Conclusión](#8-conclusion)
- [Integración de MongoDB a través de OpenVPN: Configuración para el Acceso Remoto Seguro](#integracion-de-mongodb-a-traves-de-openvpn-configuracion-para-el-acceso-remoto-seguro)
- [1. Introducción](#1-introduccion-1)
- [2. Objetivo General](#2-objetivo-general-1)
- [3. Objetivos Específicos](#3-objetivos-especificos)
- [4. Requisitos Previos](#4-requisitos-previos)
- [5. Procedimiento de Configuración](#5-procedimiento-de-configuracion)
  - [5.1 Instalación de OpenVPN y Easy-RSA](#5-1-instalacion-de-openvpn-y-easy-rsa)
  - [5.2 Creación de la PKI y certificados](#5-2-creacion-de-la-pki-y-certificados)
  - [5.3 Configuración del servidor OpenVPN](#5-3-configuracion-del-servidor-openvpn)
  - [5.4 Habilitación del reenvío de red](#5-4-habilitacion-del-reenvio-de-red)
  - [5.5 Ajuste de NAT y firewall](#5-5-ajuste-de-nat-y-firewall)
  - [5.6 Inicio del servicio](#5-6-inicio-del-servicio)
  - [5.7 Configuración del cliente](#5-7-configuracion-del-cliente)
  - [5.8 Restricción de MongoDB a la VPN](#5-8-restriccion-de-mongodb-a-la-vpn)
- [6. Verificación](#6-verificacion)
- [7. Conclusión](#7-conclusion)
- [Referencias](#referencias)

## Tabla de figuras

- Figure 2. ATW. Visualización de error de comprobación de mongodump
- Figure 3. ATW. Ruta de carpetas de automatización de tareas para los respaldos.
- Figure 4. ATW. Ruta de carpetas donde se almacenaran los respaldos por la tarea automatica
- Figure 5. ATW. Demostración del respaldo hecho por la automatización de la tarea.
- Figure 5. ATW. Buscar “Programador de tareas” en Windows
- Figure 6. ATW. Seleccionar la opción de tarea básica.
- Figure 7. ATW. Ingresar nombre y descripción de la tarea.
- Figure 8. ATW. Seleccionar frecuencia de la tarea automática
- Figure 9. ATW. Asignar hora en la que se ejecutará la tarea.
- Figure 10. ATW. Selección de iniciar programa.
- Figure 11. ATW. Asignación de ruta del archivo que se ejecutará para la tarea.
- Figure 11.
- Figure 12. Finalización y confirmación de la asignación de la tarea.
- Figure 13. ATW. Ejecución de la tarea automatizada.
- Figure 14. ATW. Creación de carpetas para almacenar las exportaciones.
- Figure 15. ATW. Finalización y confirmación de la tarea automática.
- Figure 16. ATW. Resultado esperado de la exportación con la tarea automática.
- Figure 17. ATW. Resultado esperado de la actualización de datos con la tarea automática.
- Figure 18. EXIMP. Ejecución de mongoexport para generar un archivo JSON con los datos de la colección.
- Figure 20. EXIMP. Confirmación de la restauración completa (mongorestore) de la base de datos.
- Figure 21. EXIMP. Selección de la opción 'Export Data' en MongoDB Compass.
- Figure 22. EXIMP. Selección del formato de exportación (JSON o CSV) en MongoDB Compass.
- Figure 23. EXIMP. Asignación de la ubicación de destino para el archivo exportado.
- Figure 24. EXIMP. Selección de la opción 'Add Data' para iniciar el proceso de importación.
- Figure 25. EXIMP. Elección del archivo de datos a importar (JSON o CSV) en Compass.
- Figure 26. EXIMP. Previsualización y configuración final de la importación en MongoDB Compass.
- Figure 27. EXIMP. Proceso de importación de datos en curso.
- Figure 28. EXIMP. Mensaje de confirmación de importación exitosa.
- Figure 29. EXIMP. Conexión de Studio 3T a la base de datos.
- Figure 30. EXIMP. Expansión de la base de datos 'escuela' y selección de la colección 'alumnos'.
- Figure 31. EXIMP. Menú contextual para seleccionar 'Export Collection' en Studio 3T.
- Figure 32. EXIMP. Selección del formato JSON en el Export Wizard de Studio 3T.
- Figure 33. EXIMP. Configuración de la ubicación de destino para el archivo JSON.
- Figure 34. EXIMP. Botón de ejecución para iniciar la exportación.
- Figure 35. EXIMP. Mensaje de éxito al finalizar la exportación.
- Figure 36. EXIMP. Confirmación de la eliminación ('Drop Collection') de la colección 'alumnos'.
- Figure 37. EXIMP. Selección de la opción 'Import' en el menú contextual de la base de datos.
- Figure 38. EXIMP. Elección del formato JSON en el Import Wizard de Studio 3T.
- Figure 39. EXIMP. Selección del archivo JSON a importar.
- Figure 40. EXIMP. Configuración final de la importación antes de ejecutar.
- Figure 41. EXIMP. Verificación de la restauración de documentos en la colección 'alumnos'.
- Figure 42. EXIMP. Selección de la exportación completa (Database Dump) en formato BSON - mongodump.
- Figure 43. EXIMP. Selección del tipo de importación 'BSON - mongodump' para la restauración completa.
- Figure 44. EXIMP. Asignación de la ruta del respaldo BSON para la restauración.
- Figure 45. EXIMP. Confirmación final de la restauración completa de la base de datos.
- Figure 46. CC. Generación del ambiente de trabajo.
- Figure 47. CC. Generación de todos los certificados.
- Figure 48. CC. Archivo de configuración de Mongo.
- Figure 49. CC. Verificación de estado del servicio de Mongo.
- Figure 50. CC. Generación de nombre de usuario.
- Figure 51. CC. Creación de usuario en $external.
- Figure 52. CC. Cambio de valor de Authorization.
- Figure 53. CC. Restablecimiento de servicio.
- Figure 54. CC. verificación de entrada a Mongo con la autentificación.
- Figure 55. CC. Verificación de conexiones autenticadas activas.
- Figure 56. CC. Inserción de datos de prueba.

## Lista de tablas

- Table 1. CS. Herramientas y requisitos previos para la copia de seguridad y restauración gráfica.
- Table 2. CS. Comparativa de formatos de respaldo y exportación de datos en MongoDB.
- Table 3. AT. Herramientas utilizadas para la automatización de respaldos en Windows.
- Table 4. AT. Parámetros del comando mongoexport para la extracción de datos a formato CSV.
- Table 5. EI. Comparación de terminología entre MongoDB y bases de datos relacionales.
- Table 6. EI. Resultados de la restricción de exportación e importación con el rol 'read'.
- Table 7. EI. Ventajas y desventajas de los métodos de exportación e importación de datos en MongoDB.
- Table 8. EI. Problemas comunes y sus causas durante la exportación e importación de datos.
- Table 9. TASA. Comparación de consistencia y disponibilidad entre los modelos ACID y BASE.
- Table 10. TASA. Funciones y requisitos de seguridad de los nodos en una arquitectura Replica Set de MongoDB.
- Table 11. TASA. Roles integrados de MongoDB y su aplicación en la administración de seguridad.
- Table 12. TASA. Destinos de registro de auditoría de MongoDB y sus características.
- Table 13. CC. Ventajas y desventajas.
- Table 14. CC. Problemas comunes.
- Table 15. OVPN. Requisitos previos.

# Copias de Seguridad y Restauración en MongoDB desde Compass en Windows: Procedimiento para la Recuperación de Datos
## Resumen
La administración de bases de datos requiere procedimientos confiables para proteger la información y recuperarla ante fallos, eliminación accidental o errores humanos. En MongoDB, una de las formas más adecuadas para crear respaldos técnicos es utilizar el formato BSON generado por mongodump, debido a que este conserva la estructura de los documentos y los tipos de datos propios del motor. Studio 3T permite ejecutar este tipo de proceso desde una interfaz gráfica mediante su **Export Wizard**, el cual soporta la exportación en formato **BSON/mongodump**, tanto en modalidad de carpeta como de archivo. Asimismo, la restauración puede realizarse mediante el **Import Wizard**, seleccionando el respaldo generado y configurando las herramientas externas de MongoDB cuando sea necesario. Este documento presenta un procedimiento académico para realizar una copia de seguridad y restauración en Studio 3T desde Windows, utilizando una base de datos de prueba llamada empresa y una colección llamada empleados. El flujo incluye la conexión a MongoDB, creación de datos de prueba, exportación del respaldo, simulación de pérdida de información y restauración del contenido. El proceso se plantea como una práctica gráfica, rigurosa y coherente con la documentación oficial de Studio 3T y MongoDB.
**Palabras clave:** Studio 3T, MongoDB, copias de seguridad, restauración, BSON, mongodump, mongorestore.

## Introducción
Las copias de seguridad son una parte esencial de la administración de bases de datos porque permiten conservar una copia recuperable de la información ante fallos técnicos, errores humanos, daños lógicos o eliminación accidental. En cualquier sistema de información, la confiabilidad de los datos no depende únicamente de que la base de datos esté disponible, sino también de que exista un mecanismo claro para recuperar la información cuando ocurre una pérdida.
MongoDB cuenta con herramientas oficiales para respaldar y restaurar datos. La herramienta mongodump crea una exportación binaria del contenido de una base de datos o colección, mientras que mongorestore carga nuevamente respaldos generados por mongodump dentro de una instancia de MongoDB (MongoDB, s. f.-a; MongoDB, s. f.-b). Estas herramientas suelen ejecutarse por consola, pero algunas aplicaciones gráficas permiten utilizarlas de forma asistida.
Studio 3T es una interfaz gráfica para trabajar con MongoDB. Su **Connection Manager** permite conectarse a servidores MongoDB locales, instancias en la nube, replica sets, clústeres fragmentados y conexiones mediante cadenas URI (Studio 3T, 2020b). Además, su **Export Wizard** permite exportar colecciones, vistas, resultados de consulta o documentos específicos a diferentes formatos, entre ellos CSV, Excel, JSON, SQL, otra colección y **BSON/mongodump** (Studio 3T, 2020e). Para una práctica de copias de seguridad y restauración, el formato BSON/mongodump es el más coherente, ya que se relaciona directamente con el mecanismo técnico de respaldo utilizado por MongoDB.
Este documento presenta un procedimiento gráfico para respaldar y restaurar información en MongoDB usando Studio 3T desde Windows. La práctica utiliza una base de datos llamada empresa y una colección llamada empleados. El objetivo es generar un respaldo en formato BSON/mongodump, simular la pérdida de información eliminando la colección y restaurar los datos mediante el Import Wizard de Studio 3T.

## Fundamento Técnico del Procedimiento
### Studio 3T como interfaz gráfica para MongoDB
Studio 3T es una herramienta gráfica orientada a la administración y consulta de bases de datos MongoDB. Permite conectarse a distintos tipos de despliegues, incluyendo servidores independientes, replica sets, clústeres fragmentados y conexiones mediante DNS seedlist. La documentación de Studio 3T indica que el usuario puede conectarse pegando una cadena URI, importando conexiones, importando un archivo URI o introduciendo los datos manualmente (Studio 3T, 2020b).
Para una práctica académica, Studio 3T resulta útil porque permite visualizar bases de datos y colecciones desde un panel de navegación, insertar documentos con un editor gráfico y ejecutar procesos de exportación e importación mediante asistentes. Esto reduce la dependencia de comandos manuales y permite observar de forma clara cada etapa del procedimiento.

### Relación entre Studio 3T, mongodump y mongorestore
Aunque el procedimiento se realiza desde la interfaz gráfica, Studio 3T puede apoyarse en herramientas externas de MongoDB para operaciones específicas. La documentación de Studio 3T indica que la aplicación incluye herramientas de MongoDB por defecto, pero permite configurar versiones preferidas de herramientas como mongodump, mongorestore y el shell de MongoDB (Studio 3T, 2020c).
Esta relación es importante porque la restauración de respaldos BSON/mongodump requiere que Studio 3T tenga acceso a mongorestore. De hecho, para importar respaldos en formato **BSON - mongodump folder** o **BSON - mongodump archive**, Studio 3T solicita configurar un ejecutable mongorestore en **Preferences > External tools > MongoDB tools** (Studio 3T, 2020d).

### Justificación del formato BSON/mongodump
El formato BSON/mongodump es adecuado para una práctica de copias de seguridad porque está diseñado para respaldar contenido de MongoDB. MongoDB documenta que mongorestore carga datos desde un volcado binario creado por mongodump o desde la entrada estándar hacia una instancia mongod o mongos (MongoDB, s. f.-b). Esto confirma que el par mongodump y mongorestore constituye un flujo técnico de respaldo y recuperación.
En Studio 3T, el **Export Wizard** permite seleccionar **BSON - mongodump** como formato de exportación. Dentro de sus opciones, permite elegir entre **BSON - mongodump folder** y **BSON - mongodump archive** (Studio 3T, 2020e). Ambas opciones son válidas, pero tienen diferencias prácticas:
- BSON/mongodump folder genera una estructura de carpetas similar a la producida por mongodump.
- BSON/mongodump archive genera un archivo único, más fácil de mover, guardar o entregar como evidencia.
Para esta práctica se recomienda usar **BSON/mongodump archive**, porque simplifica el manejo del respaldo al concentrarlo en un solo archivo.

**Diferencia entre respaldo BSON y exportación JSON o CSV**
Studio 3T también permite exportar datos en JSON, CSV, Excel y SQL (Studio 3T, 2020e). Estos formatos son útiles para análisis, migraciones, revisión manual o intercambio de datos. Sin embargo, para una actividad de copias de seguridad y restauración, el formato BSON/mongodump es más apropiado porque conserva mejor la naturaleza documental de MongoDB y está directamente relacionado con las herramientas de respaldo del motor.
JSON puede ser útil para exportar documentos legibles, pero no representa necesariamente una copia de seguridad técnica completa. CSV es todavía más limitado porque está orientado a datos tabulares y puede perder estructura o tipos de datos complejos. Por esa razón, el procedimiento de este documento utiliza BSON/mongodump como formato principal.

## Herramientas y Requisitos Previos
Para realizar esta práctica se requiere contar con las siguientes herramientas:

| Herramienta | Función dentro de la práctica |
| :---: | :---: |
| MongoDB Community Server | Motor de base de datos donde se almacenan los datos. |
| Studio 3T | Interfaz gráfica utilizada para administrar MongoDB. |
| MongoDB Database Tools | Herramientas que incluyen mongodump y mongorestore. |
| mongodump | Herramienta usada para generar respaldos binarios. |
| mongorestore | Herramienta usada para restaurar respaldos generados por mongodump. |
| Windows | Sistema operativo donde se ejecuta la práctica. |

*Table 1. CS. Herramientas y requisitos previos para la copia de seguridad y restauración gráfica.*

Antes de iniciar, se debe verificar lo siguiente:
1. MongoDB Community Server debe estar instalado.
2. El servicio de MongoDB debe estar en ejecución.
3. Studio 3T debe estar instalado.
4. Debe existir una conexión a MongoDB en Studio 3T.
5. El usuario debe tener permisos para crear bases de datos, crear colecciones, insertar documentos, eliminar colecciones, exportar e importar información.
6. Studio 3T debe tener acceso a las herramientas de MongoDB necesarias para trabajar con respaldos BSON/mongodump.
Una ruta común de MongoDB Database Tools en Windows es:

```javascript
C:\Program Files\MongoDB\Server\8.3\bin
```

Dentro de esa carpeta deben existir archivos como:

## Procedimiento Gráfico en Studio 3T
### Conexión a MongoDB desde Studio 3T
El primer paso consiste en abrir Studio 3T y conectarse a una instancia de MongoDB. Para una instalación local, se puede usar una conexión estándar a localhost con el puerto predeterminado de MongoDB:

```javascript
Host: localhost
 Port: 27017
```

También puede utilizarse una cadena de conexión URI:

Studio 3T permite crear conexiones mediante su **Connection Manager**. Según la documentación oficial, el usuario puede pegar una cadena de conexión, importar conexiones o introducir manualmente los datos del servidor (Studio 3T, 2020b). Para esta práctica, se recomienda usar una conexión local sencilla.
Una vez capturados los datos, se debe hacer clic en **Connect**. Si la conexión es correcta, en el panel lateral de Studio 3T aparecerá el árbol de conexiones, bases de datos y colecciones.

### Configuración de herramientas externas de MongoDB
Antes de exportar e importar respaldos BSON/mongodump, se debe verificar que Studio 3T tenga configuradas las herramientas de MongoDB. Para ello, se accede a:

```text
Edit > Preferences > External Tools > MongoDB Tools
```

En algunas versiones, la ruta puede aparecer como:

```text
Studio 3T > Preferences > External Tools > MongoDB Tools
```

En esta sección se debe seleccionar la carpeta donde se encuentran mongodump.exe y mongorestore.exe. Studio 3T documenta que permite configurar ejecutables preferidos para mongodump, mongorestore y el shell de MongoDB (Studio 3T, 2020c). Además, para importar respaldos BSON/mongodump, la documentación específica que debe configurarse un ejecutable mongorestore en las herramientas externas (Studio 3T, 2020d).
La ruta puede ser:

```javascript
C:\Program Files\MongoDB\Tools\100\bin
```

Después de seleccionar la ruta correcta, se guardan los cambios con **Apply** u **OK**.

### Creación de la base de datos y colección de prueba
En el panel izquierdo o **Connection Tree**, se debe hacer clic derecho sobre la conexión local y seleccionar una opción similar a:

```text
Add Database
```

o

```text
Create Database
```

El nombre de la base de datos será:

```text
empresa
```

Dentro de esa base de datos se crea una colección llamada:

```text
empleados
```

Dependiendo de la versión de Studio 3T, la colección puede crearse haciendo clic derecho sobre la base de datos y seleccionando:

```text
Add Collection
```

o

```text
Create Collection
```

Al finalizar, debe existir la estructura:

```text
empresa.empleados
```

### Inserción de documentos de prueba
Para insertar datos, se abre la colección empleados. Studio 3T permite visualizar documentos en diferentes vistas, como Table View, Tree View o JSON View. La documentación indica que, al visualizar una colección, se puede hacer clic derecho sobre una celda o documento y seleccionar **Document > Insert Document**. También se puede usar el atajo **Ctrl + D** en Windows (Studio 3T, 2020a).
Primero se inserta el siguiente documento:

```json
{
   "nombre": "Luis",
   "puesto": "Administrador de base de datos",
   "departamento": "Sistemas",
   "activo": true
 }
```

Después se repite el proceso para insertar el segundo documento:

```json
{
   "nombre": "Ana",
   "puesto": "Analista financiero",
   "departamento": "Finanzas",
   "activo": true
 }
```

Finalmente, se inserta el tercer documento:

```json
{
   "nombre": "Carlos",
   "puesto": "Soporte técnico",
   "departamento": "Sistemas",
   "activo": false
 }
```

Si no se especifica el campo _id, MongoDB genera automáticamente un identificador único para cada documento.

### Verificación de los datos antes del respaldo
Antes de crear la copia de seguridad, se debe verificar que los documentos están almacenados correctamente. Para ello, se abre la colección de empleados y se actualiza la vista si es necesario.
Deben aparecer tres documentos:
- Luis
- Ana
- Carlos
Esta verificación es importante porque confirma que la colección contiene datos reales antes de ejecutar el proceso de respaldo.

### Creación de la copia de seguridad con Export Wizard
Para crear la copia de seguridad, se debe seleccionar la colección empleados en el **Connection Tree**. También puede seleccionarse la base de datos empresa si se desea respaldar más de una colección.
Después se abre el asistente de exportación. Esto puede hacerse de dos formas:

```text
Toolbar > Export
```

o haciendo clic derecho sobre la colección y seleccionando una opción similar a:

```text
Export Collection
```

En el **Export Wizard**, se debe elegir como origen la colección:

```text
empresa.empleados
```

Después se selecciona el formato:

```text
BSON - mongodump
```

La documentación de Studio 3T indica que, al seleccionar este formato, se abre una pestaña de exportación con secciones como origen de exportación, destino de exportación, opciones de formato y otras opciones. También especifica que las opciones de formato permiten elegir entre **BSON - mongodump folder** y **BSON - mongodump archive** (Studio 3T, 2020e).
Para esta práctica se recomienda seleccionar:

```text
BSON - mongodump archive
```

Luego se define una carpeta de destino. Por ejemplo:

```javascript
C:\RespaldosStudio3T\
```

El archivo puede nombrarse como:

```text
empresa_empleados_backup.archive
```

La ruta completa quedaría:

```javascript
C:\RespaldosStudio3T\empresa_empleados_backup.archive
```

Una vez configuradas las opciones, se hace clic en:

```text
Run
```

Studio 3T ejecutará la exportación y generará el archivo de respaldo.

### Verificación del archivo de respaldo
Después de ejecutar la exportación, se debe abrir el Explorador de archivos de Windows y revisar la carpeta:

```javascript
C:\RespaldosStudio3T\
```

Dentro de la carpeta debe aparecer el archivo:

```text
empresa_empleados_backup.archive
```

Este archivo representa la copia de seguridad creada desde Studio 3T. Si se eligió el formato folder en lugar de archive, entonces se debe verificar una estructura de carpetas generada por mongodump, por ejemplo:

```javascript
C:\RespaldosStudio3T\empresa\empleados.bson
 C:\RespaldosStudio3T\empresa\empleados.metadata.json
```

### Simulación de pérdida de información
Para comprobar que el respaldo funciona, se simula una pérdida de información eliminando la colección empleados.
En Studio 3T se debe ir al **Connection Tree**, abrir la base de datos empresa, hacer clic derecho sobre la colección empleados y seleccionar una opción similar a:

```text
Drop Collection
```

El sistema solicitará confirmar la acción. Después de aceptar, la colección de empleados debe desaparecer de la base de datos de la empresa.
Esta simulación permite demostrar que posteriormente se puede recuperar la información desde el respaldo generado.

### Restauración del respaldo con Import Wizard
Para restaurar la información, se abre el asistente de importación de Studio 3T. Esto puede hacerse desde:

```text
Toolbar > Import
```

o haciendo clic derecho sobre la conexión o base de datos y seleccionando:

```text
Import
```

En el **Import Wizard**, se debe elegir el formato correspondiente al respaldo creado:

```text
BSON - mongodump archive
```

Si el respaldo fue creado como carpeta, se selecciona:

```text
BSON - mongodump folder
```

La documentación oficial de Studio 3T indica que, para importar BSON/mongodump, se debe abrir el Import Wizard, seleccionar **BSON - mongodump folder** o **BSON - mongodump archive** como formato de importación y hacer clic en **Configure** (Studio 3T, 2020d).
Después se selecciona el archivo de respaldo:

```javascript
C:\RespaldosStudio3T\empresa_empleados_backup.archive
```

En caso de usar la modalidad de carpeta, se debe seleccionar la carpeta raíz del respaldo. Studio 3T muestra las bases de datos y colecciones contenidas en un respaldo de tipo folder cuando la carpeta seleccionada es válida (Studio 3T, 2020d).
Luego se configura el destino de restauración. Para esta práctica, el destino debe ser:

```text
empresa.empleados
```

Si la colección no existe porque fue eliminada, Studio 3T puede restaurarla a partir del respaldo. Si existe una colección con el mismo nombre, debe revisarse la opción de inserción para evitar duplicados o conflictos con _id.
Finalmente, se ejecuta la restauración con:

```text
Run
```

Studio 3T iniciará la importación usando mongorestore.

### Verificación de la restauración
Después de ejecutar el Import Wizard, se debe actualizar el **Connection Tree** y abrir nuevamente:

```text
empresa.empleados
```

La colección debe contener otra vez los documentos de:
- Luis
- Ana
- Carlos
Si los documentos aparecen nuevamente, significa que la restauración fue exitosa.
El resultado esperado del procedimiento es el siguiente:
1. Conectarse a MongoDB desde Studio 3T.
2. Configurar las herramientas externas de MongoDB.
3. Crear una base de datos llamada empresa.
4. Crear una colección llamada empleados.
5. Insertar documentos de prueba.
6. Exportar la colección en formato BSON/mongodump.
7. Guardar el respaldo en una carpeta de Windows.
8. Eliminar la colección para simular pérdida de información.
9. Importar el respaldo mediante Import Wizard.
10. Verificar que los documentos fueron restaurados correctamente.

## Tabla Comparativa de Formatos de Respaldo y Exportación
| Formato | Herramienta o función | Alcance | Uso recomendado |
| :---: | :---: | :---: | :---: |
| BSON/mongodump archive | Studio 3T Export Wizard | Respaldo en un solo archivo | Recomendado para prácticas y traslado sencillo del respaldo. |
| BSON/mongodump folder | Studio 3T Export Wizard | Respaldo en estructura de carpetas | Útil para restauraciones más selectivas. |
| JSON | Studio 3T Export Wizard | Exportación legible de documentos | Útil para revisión, intercambio o migraciones simples. |
| CSV | Studio 3T Export Wizard | Exportación tabular | Útil para hojas de cálculo, pero limitado para documentos complejos. |
| mongodump por consola | MongoDB Database Tools | Respaldo binario desde terminal | Recomendado para administración técnica y automatización. |
| mongorestore por consola | MongoDB Database Tools | Restauración de respaldos binarios | Recomendado para recuperación técnica de datos. |

*Table 2. CS. Comparativa de formatos de respaldo y exportación de datos en MongoDB.*

La tabla muestra que Studio 3T permite exportar datos en múltiples formatos; sin embargo, para una actividad centrada en copias de seguridad y restauración, el formato BSON/mongodump es el más coherente porque se relaciona directamente con el flujo técnico de mongodump y mongorestore.

## Problemas Comunes y Soluciones
### Studio 3T no encuentra mongorestore
Este problema ocurre cuando Studio 3T no tiene configurada la ruta de MongoDB Database Tools. Para resolverlo, se debe entrar a:

```text
Edit > Preferences > External Tools > MongoDB Tools
```

Después se selecciona la carpeta donde se encuentran los ejecutables:

```bash
mongodump.exe
 mongorestore.exe
```

Una ruta común en Windows es:

```javascript
C:\Program Files\MongoDB\Tools\100\bin
```
### No aparece la opción BSON/mongodump
Esto puede ocurrir si no se seleccionó una base de datos, colección, resultado de consulta o documento válido antes de abrir el Export Wizard. La documentación de Studio 3T indica que el asistente muestra formatos aplicables dependiendo del elemento seleccionado (Studio 3T, 2020e). La solución es seleccionar directamente la colección empleados desde el **Connection Tree** y volver a abrir la opción **Export**.

### El respaldo se restaura pero no aparecen los documentos
Este problema puede deberse a que el respaldo fue restaurado en otra base de datos o colección. También puede ocurrir si no se actualizó el panel lateral después de la importación. La solución es actualizar la conexión y verificar que la colección restaurada sea:

```text
empresa.empleados
```
### Se generan duplicados o errores de _id
Si se restaura un respaldo sobre una colección que ya contiene los mismos documentos, pueden presentarse duplicados o errores relacionados con _id. Para evitarlo, en esta práctica se recomienda eliminar la colección antes de restaurar o restaurar en una colección vacía.

### El archivo archive no se puede importar
Este problema puede aparecer si se seleccionó un formato incorrecto en el Import Wizard. Si el respaldo fue generado como archivo único, se debe seleccionar:

```text
BSON - mongodump archive
```

Si el respaldo fue generado como carpeta, se debe seleccionar:

```text
BSON - mongodump folder
```
### Confusión entre interfaz gráfica y consola
Aunque Studio 3T puede utilizar internamente herramientas como mongodump y mongorestore, el procedimiento cuenta como gráfico porque el usuario lo ejecuta mediante asistentes visuales. La diferencia principal es que no se escriben comandos manualmente en CMD o PowerShell; la configuración se realiza desde ventanas, botones y formularios de Studio 3T.

## Consideraciones de Integridad y Confiabilidad
La integridad del respaldo depende de que la exportación incluya correctamente los documentos de la colección y de que el archivo generado no sea modificado o dañado después de crearse. Por ello, después de exportar se debe verificar que el archivo exista en la ruta seleccionada y que su tamaño sea coherente con la cantidad de datos respaldados.
La confiabilidad del proceso se comprueba al restaurar el respaldo en la base de datos correspondiente y verificar que los documentos originales reaparezcan. En esta práctica, la comparación antes y después de la restauración permite confirmar que el procedimiento fue exitoso.
También es importante distinguir entre una práctica académica y un ambiente de producción. En sistemas reales, los respaldos deben planificarse con políticas de periodicidad, almacenamiento seguro, control de acceso, pruebas de restauración y protección contra eliminación accidental. Además, si la base de datos se encuentra en producción, se deben considerar aspectos como autenticación, cifrado, permisos, consistencia y ventanas de mantenimiento.
El método descrito en este documento es adecuado para demostrar gráficamente el proceso de respaldo y restauración. Sin embargo, para estrategias empresariales, se recomienda complementar con políticas formales de backup y herramientas oficiales de MongoDB, especialmente cuando se trabaja con grandes volúmenes de datos o sistemas críticos.

## Conclusión
Studio 3T permite realizar copias de seguridad y restauraciones de MongoDB mediante una interfaz gráfica. En esta práctica, el proceso se llevó a cabo utilizando el **Export Wizard** para generar un respaldo en formato **BSON/mongodump archive** y el **Import Wizard** para restaurar la información después de simular una pérdida de datos.
El procedimiento cumple con el objetivo de la actividad porque demuestra un flujo completo de respaldo y recuperación: conexión a la base de datos, creación de datos de prueba, exportación, eliminación controlada y restauración. Además, el uso de BSON/mongodump resulta más coherente que JSON o CSV para una práctica de copias de seguridad, ya que se relaciona directamente con el mecanismo técnico de MongoDB para respaldar y restaurar información.
Aunque el usuario trabaja desde una interfaz gráfica, Studio 3T puede apoyarse en herramientas externas como mongodump y mongorestore. Esto permite combinar la facilidad visual de una herramienta gráfica con la solidez técnica de los mecanismos de respaldo propios de MongoDB.

# AUTOMATIZACIÓN DE TAREAS EN MONGODB
**Introducción:** La administración eficiente de bases de datos NoSQL como MongoDB requiere la automatización de tareas recurrentes. Esto incluye la creación de respaldos periódicos, la exportación automática de datos para reportes, la actualización de estados de documentos y el archivado de datos históricos (Data Tiering). La automatización asegura la continuidad operativa, reduce el riesgo de errores humanos y optimiza el rendimiento del sistema al pre-calcular información intensiva. En este tema se detalla la implementación de dichas automatizaciones tanto en entornos Windows (utilizando el Programador de Tareas y archivos .bat) como en entornos Linux (mediante el uso de Cron y contenedores Docker para un despliegue portable).
**Objetivo General:** Implementar soluciones de automatización para tareas críticas de administración y operación de bases de datos MongoDB, utilizando herramientas nativas de Windows y Linux (Programador de Tareas y Cron/Docker) para garantizar la confiabilidad, la integridad de los datos y la eficiencia del sistema.
**Objetivos Específicos:**

* Configurar respaldos automáticos de bases de datos MongoDB mediante mongodump y el Programador de Tareas de Windows.
* Automatizar la exportación de datos de colecciones a formatos CSV/JSON utilizando mongoexport.
* Implementar scripts de automatización en mongosh para la actualización programada de estados y el pre-cálculo de reportes.
* Utilizar Cron y Docker en un entorno Linux para la gestión automática de tareas recurrentes como la eliminación de respaldos antiguos y el archivado de datos históricos.

**Marco Teórico:** La automatización se fundamenta en la capacidad de ejecutar tareas sin intervención manual. En el contexto de MongoDB, esto se logra mediante:

* **Programador de Tareas de Windows:** Permite la ejecución de scripts (.bat) que contienen comandos de MongoDB (mongodump, mongoexport, mongosh).
* **Cron (Linux):** Servicio de programación de tareas que ejecuta comandos a intervalos definidos.
* **Docker:** Se utiliza para crear contenedores aislados que empaquetan las dependencias (como mongosh) y el cron, asegurando un entorno reproducible para la automatización, independientemente del sistema operativo subyacente.
* **Herramientas de MongoDB:** mongodump para respaldos binarios, mongoexport para exportación lógica a formatos legibles, y scripts de mongosh para manipulación de datos internos (ej. updateMany, Aggregation Pipeline).

**Herramientas Utilizadas:**

* **MongoDB Community Server:** Motor de la base de datos.
* **MongoDB Database Tools:** Incluye mongodump, mongorestore, mongoexport, mongoimport.
* **Programador de Tareas de Windows**
* **Archivos .bat y Scripts de JavaScript (.js)**
* **Linux (ArchLinux):** Sistema operativo de referencia para la automatización en entornos no Windows.
* **Docker y Docker Compose:** Para la creación de entornos de ejecución aislados con Cron.
* **Cron:** Programador de tareas en Linux.

## Descargar MongoDB Community Server
1. **Instalación Completa:**
   Durante la instalación, seleccionar la opción de "Complete Installation".
2. **Configurar como Servicio:**
   Marcar la casilla "Install MongoDB as a Service" y seleccionar "Run service as Network Service user".
   * *Nota: Esta es la opción más recomendada para instalaciones normales, ya que es la configuración estándar de MongoDB y Windows administra automáticamente el servicio, evitando la necesidad de crear usuarios adicionales.*
   * *Opción Avanzada: La opción "Run a service as a local or domain user:" se usa más en empresas, servidores corporativos y ambientes con usuarios de dominio, requiriendo configurar usuario, contraseña y permisos.*
3. **Instalar MongoDB Compass:**
   Dejar seleccionada la opción de "Install MongoDB Compass", ya que es la interfaz gráfica para administrar MongoDB.
4. **Instalar MongoShell:**
   Realizar la instalación de MongoShell.
   * *Verificación: Una vez instalado MongoShell, escribir el comando mongosh en la CMD o PowerShell para verificar que Mongo esté correctamente instalado en el SO.*
5. **Instalar MongoDB Database Tools:**
   Realizar la instalación de las MongoDB Database Tools dejando las opciones predeterminadas.

En caso de que ya hayas realizado la instalación de las MongoDB Tools, y a la hora de probar la versión de mongodump, sale este error aqui esta la solucion:
![](/images/cuatri-8/admin-bd/mongodb/image-02.png)

*Figure 2. ATW. Visualización de error de comprobación de mongodump*

1. Dirigirte a esta ruta dentro de tu explorador de archivos.
2. Dentro de nuestro entorno Windows, vamos a buscar “Herramientas de entorno”, una vez ahí, nos aparecerá esta ventana, y le daremos click en Variables de entorno.
3. Una vez ahí, se nos desplegara otra ventana, y vamos a buscar “Path” en la sección de “Variables del sistema”.
4. Presionamos en “Editar”, y se nos desplegara otra ventana, ahí tenemos que clickear la opción de “Nuevo”, y agregaremos la ruta donde se almacenan las MongoDB Tools. Una vez hecho, aceptamos todo, y reiniciamos la PowerShell.

5. Y ya con esto solucionamos el error, lo único que nos quedaría sería probar el comando de `mongodump --version`.

## Respaldos automatizados.
### Caso de Uso
Imagina que tu empresa maneja una base de datos MongoDB con información crítica y necesitas asegurarte de que los datos estén respaldados automáticamente cada día. Configurar respaldos manuales es tedioso y propenso a errores u omisiones. La solución es crear un archivo .bat que ejecute mongodump con marca de fecha y hora, y programar su ejecución diaria mediante el Programador de tareas de Windows, garantizando así la continuidad del negocio sin intervención humana.

### Creación de BD de prueba.
Ya dentro de mongosh, realizaremos una base de datos de prueba.

```javascript
use empresa
db.empleados.insertOne({
  nombre: "Juan",
  puesto: "Administrador"
})
```

Una vez hecho esto, vamos a verificar la herramienta de mongodump, y si aparece información, ya todo está listo. Así que tendremos que realizar una carpeta manualmente para realizar nuestros respaldos.

*Figure 3. ATW. Ruta de carpetas de automatización de tareas para los respaldos.*

Realizado esto, haremos un respaldo de forma manual, usando el siguiente comando:

```bash
mongodump --db empresa --out C:\8vo\DB\RespaldosMongo
```

Y para verificar que se hizo el respaldo, debemos de ir a nuestra carpeta donde vamos a estar almacenando nuestros respaldos, y ahí debería de haber una carpeta llamada “empresa”.

*Figure 4. ATW. Ruta de carpetas donde se almacenaran los respaldos por la tarea automatica*

### Creación de archivo .bat.
Ahora crearemos un script automático. Esto lo podemos hacer en visual studio para mayor comodidad, en una carpeta llamada Scripts (puede ser a su elección). Crearemos una archivo llamado “backup_mongo.bat”, en el escribiremos el siguiente código:

```bat
@echo off
setlocal

:: obtener fecha y hora
set FECHA=%date:\~6,4%-%date:\~3,2%-%date:\~0,2%
set HORA=%time:\~0,2%-%time:\~3,2%-%time:\~6,2%

:: quitar espacio si la hora es menor a 10
set HORA=%HORA: =0%

:: ruta completa
set RESPALDO=C:\8vo\BD\RespaldosMongo\%FECHA%_%HORA%

:: crear respaldo
mongodump --db empresa --out "%RESPALDO%"

echo Respaldo creado en:
echo %RESPALDO%

pause
```

Una vez hecho, desde nuestro explorador de archivos, dirigiéndonos a la ubicación donde realizamos este archivo, podemos dar doble click y así ejecutaremos el código para realizar el respaldo de la base de datos.

*Figure 5. ATW. Demostración del respaldo hecho por la automatización de la tarea.*

### Buscar el Programador de Tareas en Windows
En el Inicio de Windows buscaremos el Programador de Tareas.

*Figure 5. ATW. Buscar “Programador de tareas” en Windows*

### Crear una tarea básica
En el menú lateral derecho, vamos a ubicar la opción de "Crear tarea básica".
![](/images/cuatri-8/admin-bd/mongodb/image-03.png)

*Figure 6. ATW. Seleccionar la opción de tarea básica.*

### Asignar nombre y descripción a la tarea
Le daremos un nombre y una descripción (opcional).

*Figure 7. ATW. Ingresar nombre y descripción de la tarea.*

### Seleccionar la frecuencia de ejecución
Vamos a seleccionar la frecuencia con la que queremos que se ejecute nuestra tarea.
![](/images/cuatri-8/admin-bd/mongodb/image-04.png)

*Figure 8. ATW. Seleccionar frecuencia de la tarea automática*

### Asignar hora y periodicidad
Vamos a seleccionar la hora y las veces que se va a repetir en el día esta tarea.

*Figure 9. ATW. Asignar hora en la que se ejecutará la tarea.*

### Seleccionar la acción "Iniciar un programa"
Vamos a seleccionar la opción de “Iniciar un programa”.

*Figure 10. ATW. Selección de iniciar programa.*

### Escoger la ruta del archivo .bat
Aquí vamos a escoger la ruta donde tenemos nuestro archivo .bat.

*Figure 11. ATW. Asignación de ruta del archivo que se ejecutará para la tarea.*

*Figure 11.*

### Finalizar la configuración
Finalizar configuración.

![](/images/cuatri-8/admin-bd/mongodb/image-05.png)

*Figure 12. Finalización y confirmación de la asignación de la tarea.*

Para probar nuestra tarea, únicamente lo que tenemos que hacer, una vez hayamos finalizado la configuración, nos dirigimos a la sección de **Tareas Activas**, y buscaremos la tarea que realizamos. En caso de que no la veas, únicamente tienes que hacer un refresh, y ya veras tu tarea. Únicamente para probarla, tendremos que dar click derecho sobre la tarea y seleccionaremos la opción de ejecutar, y con eso, deberíamos de ver en nuestra carpeta de respaldos, el respaldo que se realizó con la tarea automatizada.

*Figure 13. ATW. Ejecución de la tarea automatizada.*

## ¿Qué se automatizo?
Se automatizo:

- la creación de respaldos
- el almacenamiento de copias de seguridad
- la ejecución programada

Se utilizó la herramienta mongodump de MongoDB para generar respaldos automáticos de la base de datos. En Windows, la automatización se realizó mediante el programador de tareas, el cual ejecuta automáticamente un archivo .bat que contiene el comando de respaldo.

## Herramientas utilizadas:
| Herramienta | Funcion |
| :---: | :---: |
| MongoDB | Base de datos |
| mongodump | Crear respaldos |
| Archivo .bat | Ejecutar comandos automáticamente |
| Programador de tareas | Programar tareas automáticas |

*Table 3. AT. Herramientas utilizadas para la automatización de respaldos en Windows.*

## Exportación automática de datos de MongoDB a CSV
### Caso de uso.
Objetivo: Automatizar la exportación de datos de MongoDB a un archivo CSV.

Imagina que tu empresa necesita compartir diariamente con otros sistemas o equipos (como el área de finanzas o marketing) un reporte actualizado de empleados en formato CSV. Hacerlo manualmente cada día conlleva riesgo de olvido y pérdida de tiempo. La solución es usar mongoexport para extraer automáticamente los datos y el Programador de tareas de Windows para ejecutarlo sin intervención humana, por ejemplo: exportar automáticamente la lista de empleados todos los días.

¿Qué herramienta se usa?
MongoDB incluye: mongoexport

¿Qué hace?
convierte datos de MongoDB a: CSV, JSON.

Ejemplo práctico.
Supongamos que tenemos la siguiente colección de datos:

### Preparar los datos de prueba.

```javascript
db.empleados.insertMany([
  {
    nombre: "Juan",
    puesto: "Administrador",
    salario: 12000
  },
  {
    nombre: "Ana",
    puesto: "Ventas",
    salario: 9000
  }
])
```

### Crear una carpeta para las exportaciones.
![](/images/cuatri-8/admin-bd/mongodb/image-06.png)

*Figure 14. ATW. Creación de carpetas para almacenar las exportaciones.*

```bash
mongoexport --db empresa --collection empleados --type=csv --fields nombre,puesto,salario --out C:\ExportacionesMongo\empleados.csv
```

¿Qué es lo que hace este comando?

| Parámetro | Funcion |
| :---: | :---: |
| --db empresa | Base de datos |
| –collection empleados | Colección |
| –type=csv | Formato CSV |
| –fields | Campos a exportar |
| –out | Archivo de salida |

*Table 4. AT. Parámetros del comando mongoexport para la extracción de datos a formato CSV.*

El resultado que esperamos ver es que se realice un archivo llamado empleados.csv, con el siguiente contenido:

```text
nombre,puesto,salario
Juan,Administrador,12000
Ana,Ventas,9000
```

### Crear el archivo .bat llamado exportar_empleados.bat para la exportación automática.

```bat
@echo off
setlocal

:: Obtener fecha
set FECHA=%date:\~6,4%-%date:\~3,2%-%date:\~0,2%

:: Obtener hora
set HORA=%time:\~0,2%-%time:\~3,2%-%time:\~6,2%

:: Reemplazar espacio inicial en horas menores a 10
set HORA=%HORA: =0%

:: Crear nombre del archivo
set ARCHIVO=C:\8vo\BD\ExportacionesMongo\empleados_%FECHA%_%HORA%.csv

:: Exportar colección
mongoexport --db empresa --collection empleados --type=csv --fields nombre,puesto,salario --out "%ARCHIVO%"

echo Archivo exportado:
echo %ARCHIVO%

pause
```

### Programar la tarea con el Programador de tareas.
Repetir el proceso visto en el ejemplo anterior de la creación de la tarea automatizada con el “Programador de tareas” de Windows.

*Figure 15. ATW. Finalización y confirmación de la tarea automática.*

Aquí ya veremos el resultado esperado de la ejecución de la tarea.

*Figure 16. ATW. Resultado esperado de la exportación con la tarea automática.*

## Automatización de actualización de estados.
### Caso de uso.
Este ejemplo consiste en cambiar automáticamente el estado de pedidos en Mongo mediante una tarea programada. Supongamos que una empresa tiene pedidos con estado: pendiente, y desea que automáticamente cambie a: procesando todos los días. Hacer esto manualmente implicaría revisar la base de datos cada día, abriendo la posibilidad de errores o retrasos. La solución es un script de mongosh que actualice los estados y el Programador de tareas de Windows que lo ejecute de forma recurrente sin intervención humana.

Este ejemplo consiste en cambiar automáticamente el estado de pedidos en Mongo mediante una tarea programada.

Objetivo del ejemplo:
Supongamos que una empresa tiene pedidos con estado: pendiente, y desea que automáticamente cambie a: **procesando** todos los días.

¿Que se automatiza?
Se automatiza:

* la ejecución de un script
* el cambio de estados automáticamente
* la tarea programada en windows

### Preparar los datos de prueba
Usaremos mongosh y la base de datos 'empresa' para crear la colección 'pedidos' con documentos de prueba.

```javascript
db.pedidos.insertMany([
  {
    cliente: "Juan",
    producto: "Laptop",
    estado: "pendiente"
  },
  {
    cliente: "Ana",
    producto: "Mouse",
    estado: "pendiente"
  },
  {
    cliente: "Luis",
    producto: "Monitor",
    estado: "pendiente"
  }
])
```

### Crear el script de automatización (.js)

```javascript
db.pedidos.updateMany(
  { estado: "pendiente" },
  {
    $set: {
      estado: "procesado"
    }
  }
)
print("Estados actualizados correctamente")
```

Crearemos el archivo 'actualizar_estados.js' con el código para actualizar automáticamente el estado de los pedidos de 'pendiente' a 'procesado'.

### Crear el archivo .bat

```bat
@echo off
mongosh empresa C:\8vo\BD\task-automation\actualizar_estados.js
```

Este archivo, llamado 'actualizar_estados.bat', ejecutará el script de automatización mediante mongosh.

### Programar la tarea con el Programador de tareas
Una vez creado el archivo .bat, configuraremos la tarea automática con el programador de tareas de Windows, siguiendo las mismas instrucciones de ejemplos anteriores.
![](/images/cuatri-8/admin-bd/mongodb/image-07.png)

*Figure 17. ATW. Resultado esperado de la actualización de datos con la tarea automática.*

Una vez que hayamos ejecutado la tarea, podremos ver reflejado los cambios en nuestra colección de documentos.

## Automatización de tareas en Linux.
En los siguientes ejemplos comenzaremos a utilizar Linux, en este caso práctico la distribución de linux que se usará será “ArchLinux”.

El uso de Docker lo podemos justificar por su capacidad de proporcionar un entorno portátil, aislado y reproducible, permitiendo que la aplicación funcione de la misma manera en cualquier sistema operativo sin depender de configuraciones locales. Esto facilita el despliegue, mantenimiento y escalabilidad del sistema, además de evitar problemas de compatibilidad.
Dentro del contenedor utilizaremos Cron, la herramienta nativa de Linux que permite la automatización de tareas. Ya que es ligera, estable y ampliamente utilizada en servidores para ejecutar scripts de forma automática.
La combinación de Docker y Cron permite crear las automatizaciones independientemente del sistema operativo, eliminando la necesidad de herramientas externas como el Programador de tareas de Windows.

### Instalación del ecosistema de MongoDB en Arch Linux usando Docker
### Actualizar el sistema

```bash
sudo pacman -Syu
```

### Instalar Docker

```bash
sudo pacman -S docker
```

### Habilitar e iniciar Docker

```bash
sudo systemctl enable --now docker.service
```

### Agregar el usuario al grupo docker
Esto evita usar sudo en cada comando Docker.

```bash
sudo usermod -aG docker $USER
```

Después cerrar sesión y volver a entrar, o ejecutar:

```bash
newgrp docker
```

### Descargar y ejecutar MongoDB en un contenedor

```bash
docker run -d \
```

 --name mongodb \
 -p 27017:27017 \
 -v mongodb data:/data/db \
```javascript
 mongo:7
```

### Verificar que el contenedor esté funcionando

```bash
docker ps
```

Debe aparecer un contenedor llamado mongodb con estado Up.

### Acceder a MongoDB Shell

```bash
docker exec -it mongodb mongosh
```

### Verificación de funcionamiento
Dentro de mongosh:

```javascript
show dbs
```

o crear una base de datos de prueba:

```javascript
use prueba

db.usuarios.insertOne({
  nombre: "Juan",
  edad: 22
})

db.usuarios.find()
```

Para comenzar a realizar nuestras automatizaciones en Linux, comenzaremos con la instalación de Docker y los contenedores que vamos a necesitar.

* **Actualizacion del sistema.**
  Primero nos tenemos que asegurar de tener todo actualizado.

```bash
  sudo pacman -Syu
```

* **Instalar Docker.**
  Instalaremos el paquete oficial de docker.

```bash
  sudo pacman -S docker
```

* **Habilitamos el servicio de Docker.**
  Para que docker inicie automáticamente e iniciarlo ahora mismo ejecutamos los siguientes comandos:

```bash
  sudo systemctl enable docker
  sudo systemctl start docker
```

* **Verificamos que funcione.**
  Tendremos que hacer la verificación de que Docker se instalo correctamente al igual que probar un contenedor básico para verificar que todo esté en orden con los siguientes comandos:

```bash
  docker --version
```

*Esta es la respuesta que debemos de ver cuando ejecutemos el `docker --version`:*

*Docker version 29.4.3, build 055a478ea9*

```bash
  sudo docker run hello-world
```

  *Y esta debe de ser la respuesta que debemos de ver cuando ejecutemos el contenedor:*
  *Hello from Docker!*

* **Recomendación en ArchLinux.**
  Instalaremos unas dependencias utiles con el siguiente comando:

```bash
  sudo pacman -S docker-compose
```

## Eliminación de respaldos automático.
### Crear la estructura de directorios.
Necesitamos crear una carpeta para esta serie de ejemplos y los directorios que montaremos como volúmenes:

```bash
mkdir -p task-automation/scripts
mkdir -p task-automation/mis_respaldos
cd task-automation
```

### Crear el script de bash para la limpieza de archivos.
Dentro de nuestra carpeta scripts, vamos a crear un archivo Bash que buscará y eliminará los archivos que tengan más de 7 días de antigüedad.
Creamos el archivo `scripts/limpieza.sh` con el siguiente contenido:

```bash
#!/bin/bash

DIRECTORIO_RESPALDOS="/respaldos"
DIAS_RETENCION=7
echo "[$(date -Iseconds)] Iniciando limpieza en $DIRECTORIO_RESPALDOS..."
find "$DIRECTORIO_RESPALDOS" -type f -mtime +$DIAS_RETENCION -exec rm -f {} \;
echo "[$(date -Iseconds)] Limpieza completada."
```

Para que el sistema pueda ejecutar este script, debemos darle permisos:

```bash
chmod +x scripts/limpieza.sh
```

### Crear la configuración del Cron.
En la raíz de nuestra carpeta (task-automation), creamos un archivo llamado crontab para definir a qué hora se ejecuta la tarea (ej. todos los días a las 3:00 AM):

```text
0 3 * * * root /scripts/limpieza.sh >> /var/log/backup_cron.log 2>&1
```

Dejar esta línea en blanco al final.

### Crear el Dockerfile.
Ya no necesitamos la imagen de Mongo. Usaremos una versión de Linux ligera. Crearemos el archivo Dockerfile en la raíz con el siguiente contenido:

### Configurar Docker Compose.
Crearemos el archivo docker-compose.yml para mapear los volúmenes, enlazando nuestra carpeta local de respaldos con el contenedor:

### Levantar y probar el contendor.
Con toda la estructura de archivos lista, podemos iniciar nuestro automatizador independiente. En tu terminal, ejecuta el siguiente comando:

```bash
sudo docker-compose up -d --build
```

(Opcional) *Verificación manual:*
Para comprobar que el script funciona sin tener que esperar hasta la hora establecida, podemos crear un archivo con una fecha de modificación antigua y ejecutar el script a mano (en la consola).

1. Creamos un archivo simulando que tiene 10 días de antigüedad en nuestra carpeta local. (estando dentro de task-automation).

```bash
   touch -d "10 days ago" mis_respaldos/respaldo_viejo.gz
```

2. Forzamos la ejecución del script de limpieza dentro del contenedor:

```bash
   sudo docker exec -it file_cleanup_worker /scripts/limpieza.sh
```

## Pre-cálculo de Reportes.
### Caso de uso.
Imagina que en tu base de datos tienes una colección de órdenes, que recibe cientos o miles de registros al día. Si tu panel de administrador intenta calcular las ganancias totales y el número de pérdidas en tiempo real leyendo miles de documentos cada vez que recargas la página, tu API se volverá muy lenta.
La solución es automatizar una tarea que corra en la madrugada (ej, 1:00 AM), tome todas las órdenes del día anterior, las sume, y guarde en único documento con el resumen en cada colección llamada: resumenes_diarios.

### Preparar los datos de prueba.
Antes de crear la automatización, necesitamos inyectar datos de prueba en nuestra base de datos local. En la terminal, entra a **mongosh** y ejecuta el siguiente contenido para crear órdenes simuladas.

1. Primero crearemos la base de datos con el siguiente comando:

```javascript
   use mi_sistema_bd;
```

2. Después ejecutaremos completo el siguiente bloque de código para insertar nuestra colección de datos.

```javascript
var hoy = new Date();
var ayer = new Date();
ayer.setDate(hoy.getDate() - 1);

db.ordenes.insertMany([
  { cliente: "Cliente A", estado: "completada", total: 250.50, fechaCreacion: ayer },
  { cliente: "Cliente B", estado: "completada", total: 120.00, fechaCreacion: ayer },
  { cliente: "Cliente C", estado: "completada", total: 450.00, fechaCreacion: ayer },

  // Esta orden es de ayer, pero está "pendiente", el script la ignorará
  { cliente: "Cliente D", estado: "pendiente", total: 300.00, fechaCreacion: ayer },

  // Esta orden está completada, pero es de "hoy", el script la ignorará
  { cliente: "Cliente E", estado: "completada", total: 150.00, fechaCreacion: hoy }
]);
```

### Crear la estructura de directorios.
Crearemos una nueva carpeta para este ejemplo aislado.

```bash
mkdir -p mongo-aggregation-cron/scripts
cd mongo-aggregation-cron
```

### Crear el script de Agregación de MongoDB.
Este script de Js utilizará el Aggregation Pipeline de MongoDB para procesar los datos matemáticos y guardar el resultado. (Tienes que crear el archivo *script/generar_reporte.js*)

```javascript
// Seleccionamos nuestra base de datos

db = db.getSiblingDB("mi_sistema_db");

// Calculamos las fechas: Inicio y fin del día de AYER

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

const ayer = new Date(hoy);
ayer.setDate(ayer.getDate() - 1);

print(`[${new Date().toISOString()}] Generando reporte para la fecha: ${ayer.toISOString().split('T')[0]}`);

// Ejecutamos el pipeline de agregación

const resultado = db.ordenes.aggregate([

    {

        $match: {
            fechaCreacion: { $gte: ayer, $lt: hoy },
            estado: "completada"

        }

    },

    {

        $group: {
            _id: null,
            totalVentas: { $sum: "$total" },
            cantidadOrdenes: { $sum: 1 }

        }
    }
]).toArray();

// Guardamos el reporte

if (resultado.length > 0) {
    const reporte = {
        fechaReporte: ayer,
        ventasTotales: resultado[0].totalVentas,
        totalOrdenes: resultado[0].cantidadOrdenes,
        generadoEl: new Date()
    };

    db.resumenes_diarios.insertOne(reporte);

    print(`[${new Date().toISOString()}] Reporte guardado con éxito. Ventas: $${reporte.ventasTotales}`);
} else {
    print(`[${new Date().toISOString()}] No hubo órdenes completadas ayer. No se generó reporte.`);

}
```

### Crear la configuración del Cron.
En la raíz de la carpeta mongo-aggregation-cron, crea el archivo crontab para que corra a la 1:00 AM todos los días.
*(Nota: Usamos host.docker.internal para que el contenedor pueda conectarse a la base de datos de tu máquina local)*

Minuto 0, Hora 1 (1:00 AM) todos los días:

```text
0 1 * * * root mongosh "mongodb://host.docker.internal:27017/mi_sistema_db" --file /scripts/generar_reporte.js >> /var/log/reportes_cron.log 2>&1
```

IMPORTANTE: Recuerda dejar esta línea en blanco al final.

### Crear el Dockerfile.
Usaremos la imagen oficial de Mongo que incluye mongosh. Crea el archivo Dockerfile.

```dockerfile
FROM mongo:latest

# Instalamos cron
RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

# Creamos el log
RUN touch /var/log/reportes_cron.log

# Iniciamos cron
CMD ["cron", "-f"]
```

### Configurar Docker Compose.
Crea el archivo docker-compose.yml. Aquí incluimos extra_hosts para crear un puente de red entre Docker y el sistema operativo.

```yaml
version: '3.8'

services:
  automatizacion-reportes:
    build: .
    container_name: report_aggregator_worker
    restart: unless-stopped

    # Permite al contenedor ver la red local
    extra_hosts:
      - "host.docker.internal:host-gateway"
    volumes:
      - ./scripts:/scripts:ro
      - ./crontab:/tmp/crontab:ro

    entrypoint: >
      bash -c "cp /tmp/crontab /etc/cron.d/mi-cron-job &&
      chmod 0644 /etc/cron.d/mi-cron-job &&
      crontab /etc/cron.d/mi-cron-job &&
      cron -f"
```

### Levantar y probar el contenedor.
Inicia el contenedor en segundo plano con el siguiente comando:

```bash
docker-compose up -d --build
```

Verificación manual:
Para asegurarte de que tu script hace las matemáticas correctas sin tener que esperar, ejecuta el script manualmente a través del contenedor.

```bash
docker exec -it report_aggregator_worker mongosh "mongodb://host.docker.internal:27017/mi_sistema_db" --file /scripts/generar_reporte.js
```

Para confirmar el resultado, ve a tu terminal y ejecuta:

```javascript
use mi_sistema_db;
db.resumenes_diarios.find();
```

## Archivo de datos históricos (Data Tiering).
### Caso de uso.
Imagina gestionar un sistema de laboratorio clínico. Tienes una colección principal llamada: resultados_pacientes que se consulta todo el tiempo. Con el paso de los años, esta colección acumula millones de documentos, lo que hace que el sistema se vuelva más lento y consume mas memoria RAM.
La mejor práctica no es borrar los datos médicos, sino crear una tarea automática que, digamos cada fin de mes, tome todos los resultados que tengan más de 1 año de antigüedad, los copie a una colección de almacenamiento llamada: resultados_historicos, y luego los elimine de la colección principal. Así mantienes tu base de datos principal ligera y rápida.

### Preparar los datos de prueba.
Vamos a inyectar algunos datos en mongosh para simular resultados de laboratorio nuevos y antiguos.

1. Creamos la base de datos:

```javascript
   use mi_sistema_bd
```

2. Insertamos este bloque de código.

```javascript
// Calculamos las fechas dinámicamente

var hoy = new Date();
var haceUnAnoYMedio = new Date();
haceUnAnoYMedio.setFullYear(hoy.getFullYear() - 1);
haceUnAnoYMedio.setMonth(hoy.getMonth() - 6);

// Insertamos resultados médicos de prueba
db.resultados_pacientes.insertMany([
   { paciente: "Ana Lopez", examen: "Biometría Hemática", resultado: "Normal", fecha: hoy },
   { paciente: "Carlos Ruiz", examen: "Química Sanguínea", resultado: "Anormal", fecha: hoy },

   // Estos dos registros son muy antiguos, el script DEBE archivarlos
   // Estos dos registros son muy antiguos, el script DEBE archivarlos
   { paciente: "Luis Gomez", examen: "Perfil de Lípidos", resultado: "Normal", fecha: haceUnAnoYMedio },
   { paciente: "Marta Díaz", examen: "Glucosa", resultado: "Elevada", fecha: haceUnAnoYMedio }
]);
```

### Crear la estructura de directorios.

```bash
mkdir -p mongo-archiving-cron/scripts
cd mongo-archiving-cron
```

### Creamos el script de Archivos de MongoDB.
Este script buscará los documentos antiguos, los insertará en la colección historia y, si la copia es exitosa, los eliminará de la colección principal. Tienes que crear el archivo **script/archivar_datos.js** con el siguiente contenido:

```javascript
db = db.getSiblingDB("mi_sistema_db");

// Definimos el límite: 1 año de antigüedad (365 días)

const limiteAntiguedad = new Date();
limiteAntiguedad.setDate(limiteAntiguedad.getDate() - 365);

print(`[${new Date().toISOString()}] Buscando resultados anteriores a: ${limiteAntiguedad.toISOString().split('T')[0]}`);

// 1. Encontramos los documentos viejos
const documentosAntiguos = db.resultados_pacientes.find({
    fecha: { $lt: limiteAntiguedad }
}).toArray();

if (documentosAntiguos.length > 0) {
    print(`[${new Date().toISOString()}] Se encontraron ${documentosAntiguos.length} registros para archivar.`);

    // 2. Los copiamos a la colección histórica
    const insertResult = db.resultados_historicos.insertMany(documentosAntiguos);

    // 3. Verificamos que se hayan copiado para poder borrarlos de forma segura
    if (insertResult.insertedIds) {
        const deleteResult = db.resultados_pacientes.deleteMany({
            fecha: { $lt: limiteAntiguedad }
        });
        print(`[${new Date().toISOString()}] Archivado completado. Eliminados de la colección principal: ${deleteResult.deletedCount}`);

    }

} else {
    print(`[${new Date().toISOString()}] No hay registros antiguos para archivar el día de hoy.`);

}
```

### Crear la configuración del Cron.
En la raíz de la carpeta mongo-archiving-cron, crea el crontab. Configuraremos esto para que se ejecute el dia 1 de cada mes a las 2:00 AM.

Minuto 0, Hora 2, Día 1 de cada mes:

```text
0 2 1 * * root mongosh "mongodb://host.docker.internal:27017/mi_sistema_db" --file /scripts/archivar_datos.js >> /var/log/archiving_cron.log 2>&1
```

Recuerda dejar esta línea en blanco al final.

### Crear el Dockerfile.
Reutilizamos la imagen de Mongo que incluye mongosh. Crea el archivo Dockerfile.

```dockerfile
FROM mongo:latest

RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

RUN touch /var/log/archiving_cron.log

CMD ["cron", "-f"]
```

### Configurar Docker Compose.
Crea el archivo docker-compose.yml. Al igual que en el ejemplo anterior, incluimos extra_hosts para la comunicación con tu base de datos local.

```yaml
version: '3.8'

services:
  automatizacion-archivado:
    build: .
    container_name: archiving_worker
    restart: unless-stopped
    extra_hosts:
      - "host.docker.internal:host-gateway"
    volumes:
      - ./scripts:/scripts:ro
      - ./crontab:/tmp/crontab:ro

    entrypoint: >
      bash -c "cp /tmp/crontab /etc/cron.d/mi-cron-job &&
      chmod 0644 /etc/cron.d/mi-cron-job &&
      crontab /etc/cron.d/mi-cron-job &&
      cron -f"
```

### Levantar y probar el contenedor.
Inicia el contenedor en segundo plano con el siguiente comando:

```bash
docker-compose up -d --build
```

Verificación manual:
Ejecutamos el script manualmente para ver la migración de datos en accion:

```bash
docker exec -it archiving_worker mongosh "mongodb://host.docker.internal:27017/mi_sistema_db" --file /scripts/archivar_datos.js
```

Para confirmar, vemos en mongosh ambas colecciones con los siguientes comandos:

```javascript
use mi_sistema_db;

// Debería mostrar solo los pacientes de "hoy"
db.resultados_pacientes.find();

// Debería mostrar a los pacientes de hace más de un año (Luis y Marta)
db.resultados_historicos.find();
```
# EXPORTACIÓN E IMPORTACIÓN DE DATOS EN MONGODB MEDIANTE CONSOLA E INTERFAZ GRÁFICA

## Introducción
Las bases de datos no relacionales han adquirido gran relevancia en el desarrollo de sistemas modernos debido a su flexibilidad y capacidad para manejar grandes volúmenes de información. Entre las tecnologías más utilizadas se encuentra MongoDB, una base de datos orientada a documentos que almacena información en formato BSON, derivado de JSON.

Dentro de la administración de bases de datos, los procesos de exportación e importación son fundamentales para garantizar la integridad, disponibilidad y recuperación de la información. Estas operaciones permiten realizar respaldos, transferencias de datos y migraciones entre diferentes entornos.

El presente documento describe el procedimiento para exportar e importar datos en MongoDB utilizando tanto comandos por consola como herramientas gráficas mediante MongoDB Compass.

## 2. Objetivo General
Ejecutar procesos de exportación e importación de datos en MongoDB mediante consola e interfaz gráfica para garantizar la integridad y confiabilidad de la información en bases de datos no relacionales.

## Objetivos Específicos
* Identificar las herramientas necesarias para administrar MongoDB.
* Realizar exportaciones de datos en formatos JSON y CSV.
* Ejecutar importaciones de datos mediante comandos de consola.
* Implementar procesos de importación y exportación mediante interfaz gráfica.
* Comparar las ventajas del uso de consola e interfaz gráfica.

## Marco Teórico
Las bases de datos no relacionales, también conocidas como NoSQL, son sistemas diseñados para almacenar información sin utilizar estructuras tabulares rígidas como las bases de datos relacionales tradicionales.

Estas bases de datos permiten trabajar con información estructurada, semiestructurada y no estructurada, ofreciendo mayor flexibilidad y escalabilidad.

### MongoDB
MongoDB es un sistema gestor de bases de datos NoSQL desarrollado para trabajar con documentos JSON/BSON.

Entre sus principales características destacan:

* Escalabilidad horizontal
* Flexibilidad en estructuras de datos
* Alto rendimiento
* Facilidad para trabajar con grandes volúmenes de información

organiza la información mediante:

| MongoDB | Relacional |
| :---: | :---: |
| Database | Base de datos |
| Collection | Tabla |
| Document | Registro |
| Field | Columna |

*Table 5. EI. Comparación de terminología entre MongoDB y bases de datos relacionales.*

### Exportación e Importación de Datos
La exportación consiste en extraer información desde una base de datos hacia archivos externos.
La importación permite incorporar información desde archivos externos hacia la base de datos.

Estos procesos son utilizados para:

* Respaldos
* Recuperación de información
* Migraciones
* Transferencia de datos
* Integración de sistemas

## Herramientas Utilizadas
## MongoDB Community Server
Software utilizado para ejecutar el servidor de MongoDB y administrar bases de datos no relacionales mediante colecciones y documentos.

## MongoDB Compass
MongoDB Compass utilizada para la administración visual de bases de datos, consultas, importación y exportación de información.

## Studio 3T
Studio 3T utilizado como entorno gráfico avanzado para la administración de bases de datos MongoDB, permitiendo realizar exportaciones, importaciones, consultas y gestión de colecciones mediante herramientas visuales profesionales.

## Exportación e Importación Mediante Consola
### Acceso a MongoDB
Para ingresar al entorno de MongoDB se utiliza el siguiente comando:

```bash
mongosh
```

### Creación de Base de Datos
con el comando use escuela creamos la base de datos para trabajar con ella

### Creación de Colección

```javascript
db.createCollection("alumnos")
```

crea una coleccion dentro de la base de datos

### Inserción de Datos
```javascript
db.alumnos.insertMany([
  { nombre: "Jorge", edad: 20, carrera: "Software" },
  { nombre: "Pau", edad: 22, carrera: "Administración" }
])
```

```javascript
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('69fc9701e4706948e4776346'),
    '1': ObjectId('69fc9701e4706948e4776347')
  }
}
```

se crean documentos para utilizarlos de prueba

### Exportación de Datos en JSON
MongoDB utiliza la herramienta mongoexport.

```bash
mongoexport --db=escuela --collection=alumnos --out=alumnos.json
```

![](/images/cuatri-8/admin-bd/mongodb/image-08.png)

*Figure 18. EXIMP. Ejecución de mongoexport para generar un archivo JSON con los datos de la colección.*

Este comando genera un archivo JSON con los datos almacenados.

### Exportación de Datos en CSV

```bash
mongoexport --db=escuela --collection=alumnos --type=csv --fields=nombre,edad,carrera --out=alumnos.csv
```

Posterior a esto se eliminan todos los alumnos creados anteriormente como un ejemplo de recuperación de datos.
escuela> db.alumnos.drop()

### Importación de Datos JSON

```bash
mongoimport --db=escuela --collection=alumnos --file=alumnos.json
```

### Importación de Datos CSV

```bash
mongoimport --db=escuela --collection=alumnos --type=csv --headerline --file=alumnos.csv
```

### Verificación de Datos

```javascript
db.alumnos.find()
```

### Exportación completa (Dump)
Para llevarte toda la base de datos escuela con sus índices y estructura:

```bash
mongodump --db=escuela --out=./respaldo_total
```

Esto creará una carpeta llamada escuela dentro de **respaldo_total** con archivos .bson y .metadata.json.

### Importación completa (Restore)
Para reconstruir esa base de datos exactamente como estaba:

dentro del Bash ejecutamos:

```bash
mongorestore --db=escuela_nueva ./respaldo_total/escuela
```

![](/images/cuatri-8/admin-bd/mongodb/image-09.png)

![](/images/cuatri-8/admin-bd/mongodb/image-10.png)

*Figure 20. EXIMP. Confirmación de la restauración completa (mongorestore) de la base de datos.*

### Restricción de Exportación e Importación Mediante Roles
MongoDB permite controlar qué usuarios pueden realizar procesos de exportación e importación de datos mediante roles y privilegios específicos.

Para esta práctica se creó un usuario con permisos limitados utilizando el rol:

read

Este rol únicamente permite consultar y exportar información, bloqueando procesos de importación y modificación de datos.

### Creación del Usuario
Primero se accedió a la base de datos administrativa:

```javascript
use admin
```

Posteriormente se creó el usuario restringido:

```javascript
db.createUser({
  user: "consulta",
  pwd: "123456",
  roles: [
    {
      role: "read",
      db: "escuela"
    }
  ]
})
})
```

### Conexión con el Usuario
Para iniciar sesión con el usuario creado se utilizó el siguiente comando:

```bash
mongosh -u consulta -p 123456 --authenticationDatabase admin
```

Después se ingresó a la base de datos:

```javascript
use escuela
```

### Verificación de Consulta de Datos
El usuario logró visualizar correctamente los documentos almacenados mediante:

```javascript
db.alumnos.find()
```

Esto confirmó que el usuario cuenta con permisos de lectura sobre la colección.

### Intento de Importación de Datos
Posteriormente se intentó importar información utilizando:

```bash
mongoimport -u consulta -p 123456 --authenticationDatabase admin --db=escuela --collection=alumnos --file=alumnos.json
```

MongoDB respondió:

```javascript
Failed: (Unauthorized) not authorized on escuela to execute command
```

La importación fue bloqueada debido a que esta operación requiere permisos de escritura sobre la base de datos.

### Exportación Permitida
Posteriormente se realizó una exportación utilizando el mismo usuario:

```bash
mongoexport -u consulta -p 123456 --authenticationDatabase admin --db=escuela --collection=alumnos --out=test.json
```

MongoDB respondió:

exported 4 records

La exportación fue permitida correctamente debido a que esta operación únicamente requiere permisos de lectura.

### Resultados Obtenidos
| Operación | Resultado |
| :---: | :---: |
| Exportación (mongoexport) | Permitida |
| Importación (mongoimport) | Denegada |

*Table 6. EI. Resultados de la restricción de exportación e importación con el rol 'read'.*

### Conclusión
MongoDB diferencia los permisos necesarios para exportar e importar información.

La exportación de datos únicamente requiere permisos de lectura, mientras que la importación necesita permisos de escritura debido a que modifica el contenido de la base de datos.

Esto permite controlar qué usuarios pueden recuperar información y cuáles tienen autorización para insertar o restaurar datos dentro del sistema.

## Exportación e Importación Mediante Interfaz Gráfica (Compass)
### Acceso a MongoDB Compass
MongoDB Compass permite administrar bases de datos mediante herramientas visuales.

### Conexión al Servidor
En MongoDB Compass se utiliza la siguiente cadena de conexión:

```javascript
mongodb://localhost:27017
```

Posteriormente se selecciona la opción “Connect”.

### Creación de Base de Datos y Colección
1. Seleccionar “Create Database”.
2. Especificar:
   * Base de datos: escuela
   * Colección: alumnos

### Inserción de Documentos
1. Seleccionar “Add Data”.
2. Elegir “Insert Document”.

3. Introducir el siguiente documento:

### Exportación de Datos
Procedimiento:

1. Ingresar a la colección.

2. Seleccionar “Export Data”.

![](/images/cuatri-8/admin-bd/mongodb/image-11.png)

*Figure 21. EXIMP. Selección de la opción 'Export Data' en MongoDB Compass.*

3. Elegir formato entre:
- JSON
- CSV

![](/images/cuatri-8/admin-bd/mongodb/image-12.png)

*Figure 22. EXIMP. Selección del formato de exportación (JSON o CSV) en MongoDB Compass.*

4. Seleccionar ubicación del archivo.

![](/images/cuatri-8/admin-bd/mongodb/image-13.png)

*Figure 23. EXIMP. Asignación de la ubicación de destino para el archivo exportado.*

5. Confirmar exportación.

### Importación de Datos
Procedimiento:

1. Ingresar a la colección.
2. Seleccionar “Add Data”.
3. Elegir “Import File”.
4. Seleccionar archivo JSON o CSV.

![](/images/cuatri-8/admin-bd/mongodb/image-14.png)

*Figure 24. EXIMP. Selección de la opción 'Add Data' para iniciar el proceso de importación.*

![](/images/cuatri-8/admin-bd/mongodb/image-15.png)

*Figure 25. EXIMP. Elección del archivo de datos a importar (JSON o CSV) en Compass.*

5. Ejecutar importación.

![](/images/cuatri-8/admin-bd/mongodb/image-16.png)

*Figure 26. EXIMP. Previsualización y configuración final de la importación en MongoDB Compass.*

![](/images/cuatri-8/admin-bd/mongodb/image-17.png)

*Figure 27. EXIMP. Proceso de importación de datos en curso.*

![](/images/cuatri-8/admin-bd/mongodb/image-18.png)

*Figure 28. EXIMP. Mensaje de confirmación de importación exitosa.*

### Restricción de Importación por Permisos
Durante las pruebas se verificó que MongoDB Compass respeta los permisos asignados a cada usuario

Al utilizar un usuario con rol:

read

El IDE permitió visualizar y exportar información, pero bloqueó los procesos de importación debido a la falta de permisos de escritura.

### Limitación de Exportación Atómica de Base de Datos en Compass
A diferencia de los comandos de consola mongodump y mongorestore detallados en las secciones **6.10** y **6.11**, la interfaz de MongoDB Compass no cuenta con una función nativa para realizar un respaldo ("dump") de una base de datos completa en una sola operación.

Mientras que la terminal permite extraer la estructura (índices y metadatos) y los datos de forma binaria (.BSON) para toda la base de datos **escuela_nueva**, en Compass la operación de exportación es estrictamente **lógica y a nivel de colección**. Esto implica que:

1. **Fragmentación:** El usuario debe entrar manualmente a cada colección para exportar archivos individuales, lo que incrementa el riesgo de error humano y pérdida de integridad referencial.
2. **Pérdida de Estructura:** Al utilizar formatos como JSON o CSV desde la interfaz gráfica, se descartan los índices de rendimiento y las reglas de validación de esquema, resultando en una base de datos "incompleta" al ser importada a otro entorno.

## Exportación e Importación Mediante Interfaz Gráfica (Studio 3T)
### Acceso a Studio 3T
Studio 3T permite administrar bases de datos MongoDB mediante herramientas gráficas avanzadas orientadas a entornos profesionales.

Para este procedimiento se mantuvo la conexión previamente configurada con la base de datos **escuela** y la colección **alumnos**

![](/images/cuatri-8/admin-bd/mongodb/image-19.png)

*Figure 29. EXIMP. Conexión de Studio 3T a la base de datos.*

### Selección de la Colección
En el panel izquierdo se expandió la base de datos escuela y posteriormente se seleccionó la colección **alumnos**

![](/images/cuatri-8/admin-bd/mongodb/image-20.png)

*Figure 30. EXIMP. Expansión de la base de datos 'escuela' y selección de la colección 'alumnos'.*

### Apertura de la Opción de Exportación
Se realizó clic derecho sobre la colección **alumnos** y posteriormente se seleccionó la opción **Export Collection**

![](/images/cuatri-8/admin-bd/mongodb/image-21.png)

*Figure 31. EXIMP. Menú contextual para seleccionar 'Export Collection' en Studio 3T.*

### Exportación de Datos en Formato JSON
Dentro de las opciones de exportación se seleccionó el formato JSON

*Figure 32. EXIMP. Selección del formato JSON en el Export Wizard de Studio 3T.*

Después se eligió la ubicación donde se almacenará el archivo exportado.

![](/images/cuatri-8/admin-bd/mongodb/image-22.png)

*Figure 33. EXIMP. Configuración de la ubicación de destino para el archivo JSON.*

Finalmente se presionó el botón:

*Figure 34. EXIMP. Botón de ejecución para iniciar la exportación.*

Al finalizar el proceso apareció el mensaje:

![](/images/cuatri-8/admin-bd/mongodb/image-23.png)

*Figure 35. EXIMP. Mensaje de éxito al finalizar la exportación.*

confirmando que la exportación se realizó correctamente.

### Exportación de Datos en Formato CSV
Se repitió el procedimiento anterior seleccionando el formato:

CSV

Esto permitió generar archivos compatibles con herramientas de análisis y hojas de cálculo.

### Eliminación de la Colección
Para validar la restauración de información se realizó una simulación de recuperación de datos.

Se realizó clic derecho sobre **alumnos** posteriormente se seleccionó **Drop Collection** y se confirmó la eliminación.

![](/images/cuatri-8/admin-bd/mongodb/image-24.png)

*Figure 36. EXIMP. Confirmación de la eliminación ('Drop Collection') de la colección 'alumnos'.*

### Verificación de Eliminación
Después de eliminar la colección, esta dejó de aparecer en el panel lateral de Studio 3T.

Este procedimiento permitió demostrar una restauración real de datos y no únicamente una importación sobre documentos existentes.

### Importación de Archivo JSON
Se realizó clic derecho sobre la base de datos **escuela** y posteriormente se seleccionó **Import**  y después se eligió el formato **JSON**

![](/images/cuatri-8/admin-bd/mongodb/image-25.png)

*Figure 37. EXIMP. Selección de la opción 'Import' en el menú contextual de la base de datos.*

![](/images/cuatri-8/admin-bd/mongodb/image-26.png)

*Figure 38. EXIMP. Elección del formato JSON en el Import Wizard de Studio 3T.*

### Selección del Archivo
Se buscó y seleccionó el archivo **alumnos.json** y se confirmó la importación.

Al finalizar apareció un mensaje de **Documents imported successfully**

confirmando la restauración correcta de la información.

![](/images/cuatri-8/admin-bd/mongodb/image-27.png)

*Figure 39. EXIMP. Selección del archivo JSON a importar.*

![](/images/cuatri-8/admin-bd/mongodb/image-28.png)

*Figure 40. EXIMP. Configuración final de la importación antes de ejecutar.*

### Verificación de Restauración
Finalmente se abrió nuevamente la colección **alumnos** verificando que los documentos restaurados aparecieran correctamente dentro de la base de datos.

![](/images/cuatri-8/admin-bd/mongodb/image-29.png)

*Figure 41. EXIMP. Verificación de la restauración de documentos en la colección 'alumnos'.*

### Exportación Completa de Base de Datos (Database Dump)
A diferencia de las limitaciones encontradas en MongoDB Compass, Studio 3T permite realizar una exportación atómica de la base de datos escuela_nueva. Este proceso no solo extrae los documentos, sino que genera un respaldo íntegro de la estructura operativa.

**Procedimiento de Exportación:**

Para una exportación solamente hay que seleccionar la base (en este caso escuela), luego presionamos el botón de exportar directamente.

Luego para una exportación completa (Database dump), elegimos **BSON - mongodump** y Aceptamos

![](/images/cuatri-8/admin-bd/mongodb/image-30.png)

*Figure 42. EXIMP. Selección de la exportación completa (Database Dump) en formato BSON - mongodump.*

Indicamos la dirección de destino de la carpeta con la base de datos y presionamos el boton de: RUN.

Con esto ya tendremos una copia completa de la base de datos (DUMP) con toda la estructura completa.

### Restauración Completa (Importación)
Estando dentro de la raiz del entorno presionamos Import, seleccionamos el tipo de importación en este caso **BSON - mongodump** y aceptamos.

![](/images/cuatri-8/admin-bd/mongodb/image-31.png)

*Figure 43. EXIMP. Selección del tipo de importación 'BSON - mongodump' para la restauración completa.*

Colocamos la ruta de la carpeta con la base de datos

![](/images/cuatri-8/admin-bd/mongodb/image-32.png)

*Figure 44. EXIMP. Asignación de la ruta del respaldo BSON para la restauración.*

Posterior a esto presionamos Run y aceptamos

![](/images/cuatri-8/admin-bd/mongodb/image-33.png)

*Figure 45. EXIMP. Confirmación final de la restauración completa de la base de datos.*

Una vez hecho esto aparecerá un mensaje de éxito y tendremos nuestra base de datos recuperada (Importada)

## Ventajas y Desventajas
| Método | Ventajas | Desventajas |
| :---: | :---: | :---: |
| Consola | Mayor velocidad y automatización | Requiere conocimientos técnicos |
| Interfaz gráfica | Fácil de utilizar | Menor control avanzado |

*Table 7. EI. Ventajas y desventajas de los métodos de exportación e importación de datos en MongoDB.*

## 10. Problemas Comunes
| Problema | Causa |
| :---: | :---: |
| Error de conexión | Servicio MongoDB detenido |
| Fallo en CSV | Encabezados incorrectos |
| Datos duplicados | Importaciones repetidas |
| Permisos denegados | Restricciones del sistema operativo |

*Table 8. EI. Problemas comunes y sus causas durante la exportación e importación de datos.*

## 11. Conclusión
La exportación e importación de datos son procesos esenciales en la administración de bases de datos no relacionales. MongoDB proporciona herramientas eficientes tanto por consola como mediante interfaz gráfica para facilitar respaldos, restauraciones y migraciones de información.

El uso de comandos por consola permite automatizar tareas y obtener mayor control sobre los procesos, mientras que MongoDB Compass simplifica la administración para usuarios con menor experiencia técnica.

La correcta implementación de estas herramientas contribuye a mantener la integridad, disponibilidad y confiabilidad de los datos dentro de un sistema de información.

# Tratado sobre la Administración de Seguridad y Arquitecturas de Alta Disponibilidad en Ecosistemas NoSQL: El Caso de MongoDB
La gestión de bases de datos ha experimentado una metamorfosis radical desde la rigidez de los esquemas relacionales hacia la flexibilidad del modelo NoSQL. En este panorama, la seguridad no puede ser considerada como un componente periférico o una capa superpuesta a posteriori, sino que debe integrarse en la arquitectura misma del sistema. MongoDB, como exponente líder de las bases de datos orientadas a documentos, ofrece una plataforma robusta para el manejo de volúmenes masivos de datos (concepto derivado de su nombre "humongous"), pero su potencia y flexibilidad exigen una comprensión profunda de los mecanismos de protección, replicación y consistencia (DataCamp, s. f.). Este informe técnico analiza de manera exhaustiva las estrategias de seguridad en administraciones no relacionales, enfocándose en la transición del modelo Maestro-Esclavo hacia los Replica Sets y la implementación de controles de acceso de alta granularidad.

## Fundamentos Teóricos y Filosofía NoSQL
Para abordar la seguridad en MongoDB, es imperativo comprender la distinción entre los principios transaccionales clásicos y los sistemas distribuidos modernos. Mientras que las bases de datos relacionales tradicionales se rigen por el modelo ACID (Atomicidad, Consistencia, Aislamiento y Durabilidad), las bases de datos NoSQL suelen adoptar el modelo BASE (Basically Available, Soft state, Eventually consistent) (Oracle América Latina, s. f.). Esta distinción no es puramente semántica; tiene implicaciones directas en cómo se protegen los datos y cómo se garantiza su integridad en entornos donde la alta disponibilidad y el escalado horizontal son las prioridades fundamentales (Oracle América Latina, s. f.).

| Característica | Modelo ACID | Modelo BASE | Implicación en Seguridad |
| :---: | :---: | :---: | :---: |
| **Consistencia** | Inmediata y estricta en cada operación. | Eventual; los nodos se sincronizan asíncronamente. | Riesgo de lectura de datos obsoletos durante la sincronización. |
| **Disponibilidad** | Puede sacrificarse ante fallos de red. | Priorizada; el sistema sigue operando. | Necesidad de autenticación interna entre nodos. |
| **Estado** | Persistente y definido tras cada commit. | Estado "suave" que cambia dinámicamente. | Auditoría compleja de estados intermedios. |
| **Aislamiento** | Las transacciones simultáneas no interfieren. | El aislamiento es relajado para mejorar el rendimiento. | Control estricto sobre escrituras concurrentes. |

*Table 9. TASA. Comparación de consistencia y disponibilidad entre los modelos ACID y BASE.*

El uso de esquemas dinámicos basados en BSON (Binary JSON) permite a los desarrolladores iterar rápidamente, pero también introduce el desafío de la validación de esquemas en tiempo de ejecución para prevenir la inyección de datos malformados (DataCamp, s. f.). En MongoDB, la seguridad se construye sobre cuatro pilares fundamentales: el control de acceso a la red, la autenticación de identidades, la autorización de acciones mediante roles y el cifrado de datos tanto en reposo como en tránsito (STR Sistemas, s. f.).

## Evolución de las Arquitecturas de Replicación
La replicación es la estrategia mediante la cual los datos se distribuyen en múltiples servidores para asegurar la redundancia y la tolerancia a fallos. En el ecosistema MongoDB, la arquitectura ha evolucionado para eliminar los puntos únicos de fallo y automatizar la recuperación ante desastres (SlideShare, s. f.).

### El Modelo Maestro-Esclavo (Legacy)
En las versiones iniciales de MongoDB, la arquitectura Maestro-Esclavo era la norma. En este esquema, un solo nodo maestro procesaba todas las operaciones de escritura, mientras que uno o más nodos esclavos replicaban el registro de operaciones (oplog) para servir consultas de lectura (GeeksforGeeks, s. f.). Sin embargo, esta estructura presentaba vulnerabilidades operativas críticas: si el maestro fallaba, los esclavos permanecían en modo de solo lectura hasta que un administrador intervenía manualmente para promover un nuevo maestro (Stack Overflow, s. f.).

Desde la versión 3.6 de MongoDB, la replicación Maestro-Esclavo se considera obsoleta y ha sido reemplazada por los Replica Sets (Stack Overflow, s. f.). Desde una perspectiva de seguridad, el modelo antiguo era deficiente porque la autenticación entre maestro y esclavo era rudimentaria y no facilitaba el cambio dinámico de credenciales en caso de compromiso de un nodo (Stack Overflow, s. f.).

### Replica Sets: El Estándar de Alta Disponibilidad
Un Replica Set es un grupo de instancias de mongod que mantienen el mismo conjunto de datos, pero con un mecanismo de elección automática incorporado. En esta arquitectura, se designa un nodo Primario que recibe todas las escrituras, mientras que los nodos Secundarios replican sus datos de forma asíncrona (GeeksforGeeks, s. f.).

| Rol del Nodo | Función Técnica | Requisito de Seguridad |
| :---: | :---: | :---: |
| **Primario** | Único punto de entrada para escrituras (Writes). | Auditoría estricta de comandos DDL y DML. |
| **Secundario** | Mantiene copias espejo; puede servir lecturas. | Cifrado de tráfico TLS/SSL entre nodos. |
| **Árbitro** | No almacena datos; solo vota en elecciones. | Autenticación mediante Keyfile para participar en votos. |

*Table 10. TASA. Funciones y requisitos de seguridad de los nodos en una arquitectura Replica Set de MongoDB.*

La seguridad en un Replica Set se refuerza mediante el uso de "Arbiters" cuando el número de nodos con datos es par, asegurando que siempre haya una mayoría para elegir un nuevo Primario sin necesidad de replicar los datos en una máquina adicional, lo que reduce la superficie de ataque al no exponer los datos sensibles en todos los nodos del clúster (Stack Overflow, s. f.).

### La Falacia del Modelo Maestro-Maestro en NoSQL
Una consulta recurrente entre arquitectos de sistemas es la implementación de un modelo Maestro-Maestro, donde múltiples nodos pueden aceptar escrituras sobre el mismo conjunto de datos simultáneamente. En sistemas distribuidos, esto genera conflictos de resolución de datos (conflict resolution) extremadamente complejos que a menudo terminan en pérdida de integridad (MongoDB, s. f.-b).

MongoDB aborda la escalabilidad de escritura no a través de un esquema Maestro-Maestro puro sobre la misma partición, sino mediante el Sharding (fragmentación). En una arquitectura fragmentada, la base de datos divide las colecciones en "chunks" distribuidos a través de múltiples fragmentos o shards (GeeksforGeeks, s. f.). Cada shard es, a su vez, un Replica Set con su propio Primario (GeeksforGeeks, s. f.). De esta manera, se logra que el sistema acepte escrituras concurrentes en diferentes servidores, pero manteniendo la autoridad de un único primario por cada fragmento de datos, garantizando así la consistencia (ScyllaDB, s. f.).

## Administración de Seguridad en el Servidor: Hardening Inicial
La configuración por defecto de MongoDB favorece la facilidad de uso sobre la protección. Por ello, la administración profesional de la seguridad comienza con el endurecimiento (hardening) del archivo de configuración del sistema, usualmente localizado en /etc/mongod.conf (STR Sistemas, s. f.).

### Aislamiento de Red y Control de Puertos
La exposición de una base de datos a la red pública es la causa principal de filtraciones masivas de datos. El parámetro net.bindIp debe restringirse a la dirección de la interfaz privada o a 127.0.0.1 durante la configuración inicial (STR Sistemas, s. f.). Es una práctica recomendada cambiar el puerto estándar 27017 por uno menos predecible para mitigar el escaneo automatizado de puertos (STR Sistemas, s. f.).

```yaml
net:
  port: 27019
  bindIp: 127.0.0.1
  tls:

    mode: requireTLS
    certificateKeyFile: /etc/ssl/mongodb.pem
    CAFile: /etc/ssl/ca.pem
```

Además del aislamiento de IP, es imperativo deshabilitar interfaces administrativas obsoletas. Históricamente, MongoDB incluía interfaces HTTP y REST que podían exponer información sensible si no se protegían adecuadamente; en las versiones modernas, estas interfaces han sido eliminadas o deben permanecer desactivadas explícitamente (STR Sistemas, s. f.).

### Activación de la Autorización
Sin la activación explícita del control de acceso, MongoDB permite cualquier conexión sin credenciales. La directiva security.authorization debe establecerse en enabled para forzar el uso de RBAC (Control de Acceso Basado en Roles) (MongoDB, s. f.-d).

Un dato interesante y crítico es que, una vez activada la autorización, MongoDB permite una "excepción de localhost". Esto permite al administrador crear el primer usuario del sistema desde la propia máquina del servidor antes de que se cierren todos los accesos no autenticados (MongoDB, s. f.-d.).

## Manual de Gestión de Usuarios y Roles (RBAC)
El Control de Acceso Basado en Roles (RBAC) es el mecanismo mediante el cual se otorgan privilegios a los usuarios. En lugar de asignar permisos individuales, se asignan roles que agrupan un conjunto de privilegios sobre recursos específicos (bases de datos o colecciones) (MongoDB, s. f.-d.).

### Creación del Administrador del Sistema
La creación de usuarios se realiza a través del shell moderno de MongoDB, mongosh. El primer usuario debe tener el rol userAdminAnyDatabase o root en la base de datos admin (MongoDB, s. f.-e).

```text
// Acceso inicial a la base de datos administrativa
use admin

// Creación del superusuario con privilegios globales
db.createUser({

  user: "adminSeguridad",
  pwd: passwordPrompt(), // Método seguro para evitar contraseñas en el historial de comandos
  roles: [ { role: "root", db: "admin" } ]
```
})

### Roles Integrados y su Aplicación Operativa
MongoDB proporciona una jerarquía de roles predefinidos que cubren la mayoría de las necesidades operativas de una empresa (MongoDB, s. f.-d).

| Rol | Alcance del Privilegio | Caso de Uso |
| :---: | :---: | :---: |
| **read** | Lectura de datos en una DB específica. | Aplicaciones de reporting o analítica. |
| **readWrite** | Lectura y modificación de datos. | Usuario principal de la aplicación. |
| **dbAdmin** | Gestión de índices, estadísticas y limpieza. | Mantenimiento de rendimiento por DB. |
| **clusterAdmin** | Administración de réplicas y sharding. | Operaciones de infraestructura. |
| **backup / restore** | Privilegios para mongodump y mongorestore. | Procesos automatizados de respaldo. (MongoDB, s. f.-d) |

*Table 11. TASA. Roles integrados de MongoDB y su aplicación en la administración de seguridad.*

### Definición de Roles Personalizados

```javascript
use admin
db.createRole({
  role: "auditorLectura",
  privileges: [
    {
      resource: { db: "finanzas", collection: "transacciones" },
      actions: ["find"]
    }
  ],
    {
      resource: { db: "finanzas", collection: "transacciones" },
      actions: ["find"]
    }
  ],
  roles: [] // Puede heredar de otros roles si es necesario
})
```

Este enfoque sigue el principio del menor privilegio, minimizando el impacto potencial de un compromiso de cuenta (MongoDB, s. f.-d).

## Seguridad en la Comunicación Interna: Autenticación por Keyfile
En un Replica Set o un clúster fragmentado, los nodos deben comunicarse entre sí para realizar tareas críticas como la replicación del oplog y la monitorización de latido (heartbeat). Si un atacante pudiera inyectar un nodo malicioso en el clúster, podría obtener una copia completa de los datos. Para evitar esto, se utiliza la autenticación de membresía interna mediante archivos de clave (Keyfiles) (MongoDB, s. f.-f).

### Teoría y Mecanismo del Keyfile
Un Keyfile actúa como un secreto compartido. Cada nodo en el clúster utiliza el contenido del archivo para demostrar su identidad ante los demás miembros (MongoDB, s. f.-f). El archivo debe contener una cadena de caracteres en formato base64 y su longitud debe estar entre 6 y 1024 caracteres (MongoDB, s. f.-f).

### Configuración en Consola
La configuración por consola se divide en tres pasos: crear el keyFile, ajustar mongod.conf en cada nodo e inicializar el replica set desde mongosh (MongoDB, s. f.-d; MongoDB, s. f.-f).

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

## Autenticación Avanzada mediante Certificados x.509
### Configuración del Servidor para mTLS
El servidor debe configurarse con un certificado de identidad y una autoridad de certificación (CA) que valide los certificados de los clientes. El modo de TLS debe establecerse en requireTLS para asegurar que ninguna conexión viaje en texto plano (MongoDB, s. f.-h).

```yaml
net:
  tls:

    mode: requireTLS
    certificateKeyFile: /etc/ssl/server.pem
    CAFile: /etc/ssl/ca-authority.crt
```

### Gestión de Usuarios Externos ($external)
A diferencia de los usuarios normales que se almacenan en la base de datos donde fueron creados, los usuarios autenticados mediante x.509 (o LDAP/Kerberos) deben registrarse en una base de datos especial llamada $external (MongoDB, s. f.-h).

Para crear un usuario x.509, el nombre del usuario debe coincidir exactamente con el "Subject" del certificado del cliente, formateado según la norma RFC2253 (MongoDB, s. f.-h).

**Comando de obtención del Subject:**

```bash
openssl x509 -in cliente.pem -inform PEM -subject -nameopt RFC2253 -noout
```

**Comando de creación del usuario en mongosh:**

```javascript
db.getSiblingDB("$external").runCommand({
  createUser: "CN=miAplicacion,OU=Ingenieria,O=EmpresaX,L=Madrid,ST=Madrid,C=ES",
  roles: [],
  writeConcern: { w: "majority" , wtimeout: 5000 }
})
```

Este método elimina la necesidad de gestionar contraseñas en archivos de configuración de aplicaciones, ya que la identidad reside en el certificado digital, el cual puede ser rotado y revocado de manera centralizada por la infraestructura de clave pública (PKI) de la empresa (MongoDB, s. f.-h).

## Auditoría y Monitoreo de Seguridad
La seguridad es un proceso continuo que requiere visibilidad sobre las operaciones del sistema. MongoDB Enterprise proporciona una capacidad de auditoría avanzada que registra cada acción realizada contra la base de datos (MongoDB, s. f.-c).

### Configuración de la Auditoría
El sistema de auditoría puede configurarse para registrar eventos en diversos formatos. El formato BSON es más eficiente para el rendimiento del servidor, mientras que el formato JSON es más fácil de integrar con sistemas SIEM (Security Information and Event Management) de terceros (MongoDB, s. f.-c).

| Destino de Auditoría | Ventajas | Desventajas |
| :---: | :---: | :---: |
| **Syslog** | Centralización nativa en Linux. | No disponible en Windows; limitación de ráfagas. |
| **Console** | Útil para depuración en tiempo real. | No apto para persistencia a largo plazo. |
| **JSON File** | Alta legibilidad y compatibilidad. | Impacto moderado en el rendimiento. |
| **BSON File** | Máxima eficiencia de escritura. | Requiere bsondump para lectura humana (MongoDB, s. f.-c). |

*Table 12. TASA. Destinos de registro de auditoría de MongoDB y sus características.*

### Filtros de Auditoría para Cumplimiento

```yaml
auditLog:
  destination: file
  format: JSON
  path: /var/log/mongodb/audit.json
  filter: '{ atype: { $in: } }'
```

A partir de la versión 5.0, es posible modificar estos filtros en tiempo de ejecución sin necesidad de reiniciar el servicio, lo que permite a los equipos de seguridad aumentar la vigilancia durante incidentes en curso sin interrumpir la disponibilidad de la aplicación (MongoDB, s. f.-c).

## Estrategias de Backup y Recuperación de Datos
Incluso con la replicación activa, los backups son esenciales para protegerse contra errores humanos (como un dropDatabase accidental) o ataques de ransomware. La replicación protege contra fallos de hardware, pero no contra la corrupción lógica de los datos (MongoDB, s. f.-k).

### Herramientas Nativas: mongodump y mongorestore

Estas herramientas exportan e importan datos en formato BSON. Para garantizar la consistencia en un Replica Set, es vital utilizar la opción --oplog durante el dump, lo que permite capturar un estado coherente de la base de datos en un punto exacto del tiempo (MongoDB, s. f.-i; MongoDB, s. f.-j).

#### Ejemplo de backup seguro con autenticación y TLS

```bash
mongodump --host="rs0/mongo1:27017,mongo2:27017" \\

          --ssl --sslCAFile=ca.pem \\
          --username="backupUser" --password="passwordSegura" \\
          --authenticationDatabase="admin" \\
          --out=/backups/$(date +%F) --oplog
```

Para entornos empresariales críticos, se recomienda la recuperación puntual (Point-in-Time Recovery), disponible a través de MongoDB Ops Manager o Atlas, que permite restaurar la base de datos a cualquier segundo específico del pasado reciente utilizando las copias de seguridad continuas del oplog (MongoDB, s. f.-l).

## Conclusiones y Futuro de la Seguridad NoSQL
La administración de seguridad en bases de datos no relacionales como MongoDB ha trascendido la simple configuración de puertos para convertirse en un ecosistema completo de protección de datos. La arquitectura de Replica Sets proporciona la base necesaria para la alta disponibilidad, mientras que herramientas como el cifrado TLS, la autenticación x.509 y la auditoría granular permiten cumplir con los estándares de cumplimiento más exigentes (MongoDB, s. f.-f; MongoDB, s. f.-h; MongoDB, s. f.-c).

Un dato interesante para el futuro es la adoption del esquema OCSF en MongoDB 8.0, que estandariza los logs de seguridad para facilitar la interoperabilidad entre diferentes plataformas de ciberseguridad, lo que sugiere un movimiento de la industria hacia una defensa más coordinada y automatizada (MongoDB, s. f.-c). La clave para una administración exitosa radica en el equilibrio entre la flexibilidad operativa y la vigilancia constante, tratando a la base de datos no como un silo aislado, sino como una pieza central y protegida del tejido de infraestructura de la organización.

# Conexión certificada: Autenticación Avanzada mediante Certificados x.509 (mTLS) en MongoDB
## 1. Introducción
En entornos empresariales, el uso exclusivo de contraseñas resulta insuficiente cuando se requiere validar no solo el acceso lógico a la base de datos, sino también la identidad criptográfica del cliente y del servidor durante la comunicación. MongoDB soporta autenticación mediante certificados X.509 tanto para clientes como para autenticación interna entre nodos, y este esquema exige el uso de una conexión segura TLS/SSL.

La autenticación mutua o mTLS fortalece el proceso de conexión porque el servidor presenta su certificado al cliente y, a su vez, el cliente presenta un certificado válido para ser verificado por el servidor. En MongoDB autoadministrado, esta modalidad se implementa configurando el servidor con requireTLS, un certificado del servidor y un archivo de autoridad certificadora para validar los certificados presentados durante la conexión.

## 2. Objetivo general y específicos
**Objetivo general**

Implementar un mecanismo de conexión segura en MongoDB mediante autenticación avanzada con certificados X.509 y mTLS, de forma que la comunicación entre cliente y servidor quede protegida por TLS y el acceso se autorice con base en la identidad certificada del usuario.

**Objetivos específicos**

* Generar una autoridad certificadora y certificados diferenciados para servidor y cliente con fines de práctica y validación técnica

* Configurar el servicio mongod para exigir conexiones TLS mediante la directiva net.tls.mode: requireTLS.

* Extraer el Subject del certificado cliente en formato RFC2253 para usarlo como identidad de autenticación dentro de MongoDB

* Registrar el Subject del certificado como usuario en la base de datos especial $external, que es la base de autenticación para mecanismos externos como X.509.

* Verificar una conexión segura usando mongosh, --tls, --tlsCertificateKeyFile y el mecanismo MONGODB-X509.

## 3. Marco teórico
TLS es un protocolo de seguridad que protege la comunicación en red mediante cifrado, mientras que mTLS amplía este modelo al exigir que ambas partes presenten y validen certificados digitales durante la sesión. En MongoDB, la autenticación X.509 requiere explícitamente una conexión segura TLS/SSL para que el cliente pueda autenticarse con su certificado

Un certificado X.509 es un documento digital utilizado dentro de una infraestructura de clave pública para asociar una identidad con una clave criptográfica verificable por una autoridad certificadora. Para que MongoDB acepte este tipo de autenticación, los certificados del cliente y del servidor deben ser emitidos por una misma CA, el certificado del cliente no debe estar expirado y, si se usan extensiones, el certificado cliente debe incluir clientAuth y el del servidor serverAuth.

La base de datos $external cumple el papel de repositorio lógico de identidades autenticadas por mecanismos externos, entre ellos X.509. En consecuencia, el Subject exacto del certificado cliente debe registrarse como usuario en $external, ya que cada certificado X.509 único corresponde a un solo usuario de MongoDB.

## 4. Herramientas utilizadas
* **MongoDB Community Server:** utilizado como instancia autoadministrada para habilitar autenticación X.509 en un mongod independiente.

* **OpenSSL:** empleado para generar la CA, las solicitudes de firma y los certificados PEM de servidor y cliente en escenarios de prueba.

* **Terminal o consola:** utilizada para ejecutar comandos de OpenSSL, iniciar el servicio y verificar la conectividad segura.

* **mongosh:** cliente de línea de comandos de MongoDB que permite conectarse con `--tls`, `--tlsCAFile`, `--tlsCertificateKeyFile` y `--authenticationMechanism MONGODB-X509`.

## 5. Implementación de conexión certificada
### 5.1 Generación de certificados
Para la práctica, MongoDB documenta el uso de una CA común para emitir certificados de cliente y servidor, además de ejemplos de creación de archivos PEM con OpenSSL para entornos de prueba. También establece que el cliente y el servidor deben compartir una misma CA y que el certificado del cliente debe diferenciarse del certificado del servidor al menos en atributos como O, OU o DC.

```bash
mkdir -p etc/mongo-certs
cd etc/mongo-certs
```

![](/images/cuatri-8/admin-bd/mongodb/image-34.png)

*Figure 46. CC. Generación del ambiente de trabajo.*

#### 1. Crear la Autoridad Certificadora (CA)

```bash
openssl genrsa -out ca.key 2048

openssl req -new -x509 -days 365 -key ca.key -out ca.crt -subj "/CN=MongoCA/OU=DBA/O=UTT/L=Torreon/ST=Coahuila/C=MX"
```
#### 2. Generar llave y solicitud del Servidor

```bash
openssl genrsa -out server.key 2048

openssl req -new -key server.key -out server.csr -subj "/CN=localhost/OU=DBA/O=UTT-Server/L=Torreon/ST=Coahuila/C=MX"
```
#### 3. Crear archivo de extensiones SAN

```bash
echo "subjectAltName = DNS:localhost, IP:127.0.0.1, IP:192.168.1.21" > san.ext
```
#### 4. Firmar el certificado del Servidor inyectando el SAN

```bash
openssl x509 -req -days 365 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -extfile san.ext
```
#### 5. Empaquetar el certificado del Servidor

```bash
cat server.key server.crt > server.pem
```
#### 6. Generar llave y solicitud del Cliente

```bash
openssl genrsa -out client.key 2048

openssl req -new -key client.key -out client.csr -subj "/CN=anthony.fuentes/OU=DBA/O=UTT-Clients/L=Torreon/ST=Coahuila/C=MX"
```
#### 7. Firmar el certificado del Cliente (El cliente no necesita SAN)

```bash
openssl x509 -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt
```
#### 8. Empaquetar el certificado del Cliente

```bash
cat client.key client.crt > client.pem
```

![](/images/cuatri-8/admin-bd/mongodb/image-35.png)

*Figure 47. CC. Generación de todos los certificados.*

### 5.2 Configuración del servidor (mongod.conf)
MongoDB indica que, para habilitar autenticación X.509 en una instancia autoadministrada, el servidor debe configurarse con net.tls.mode: requireTLS, net.tls.certificateKeyFile y net.tls.CAFile. Con ello, el servidor obliga a que todas las conexiones se realicen sobre TLS y valida los certificados presentados por los clientes con la CA definida.

```yaml
systemLog:

  destination: file

  logAppend: true

  path: /var/log/mongodb/mongod.log

storage:

  dbPath: /var/lib/mongo

  journal:

    enabled: true

processManagement:

  fork: true

  pidFilePath: /var/run/mongodb/mongod.pid

  timeZoneInfo: /usr/share/zoneinfo

net:

  port: 27017

  bindIp: 127.0.0.1

  tls:

    mode: requireTLS

    certificateKeyFile: /etc/mongo-certs/server.pem

    CAFile: /etc/mongo-certs/ca.crt

security:

  authorization: "disabled"
```

![](/images/cuatri-8/admin-bd/mongodb/image-36.png)

*Figure 48. CC. Archivo de configuración de Mongo.*

Después de guardar el archivo, debe reiniciarse el servicio mongod para aplicar la nueva política de transporte seguro.

```bash
sudo systemctl restart mongod
sudo systemctl status mongod
```

![](/images/cuatri-8/admin-bd/mongodb/image-37.png)

*Figure 49. CC. Verificación de estado del servicio de Mongo.*

### 5.3 Extracción del Subject del certificado cliente
MongoDB establece que el usuario X.509 debe crearse a partir del valor exacto del subject del certificado cliente en formato RFC2253. La documentación oficial recomienda obtener este valor con OpenSSL mediante la opción -nameopt RFC2253.

```bash
openssl x509 -in client.pem -inform PEM -subject -nameopt RFC2253
```

Es crucial realizar este paso y copiar el resultado exacto, ya que MongoDB es estricto con el formato RFC2253 (el cual suele invertir el orden de los atributos, empezando por C=MX). Si el orden de los elementos no coincide exactamente al crear el usuario en la base de datos, MongoDB denegará el acceso.

```text
subject= CN=anthony.fuentes,OU=DBA,O=UTT-Clients,L=Torreon,ST=Coahuila,C=MX
```

![](/images/cuatri-8/admin-bd/mongodb/image-38.png)

*Figure 50. CC. Generación de nombre de usuario.*

### 5.4 Creación del usuario en MongoDB
MongoDB requiere que el Subject del certificado se agregue como usuario en la base $external, ya que esta base funciona como base de autenticación para mecanismos externos como X.509. Además, el valor debe respetar el formato RFC2253 y corresponder exactamente al certificado presentado por el cliente.

En una sesión administrativa temporal de laboratorio, puede ejecutarse el siguiente comando para registrar el usuario X.509 y asignarle permisos sobre la base de datos de práctica.

```javascript
db.getSiblingDB("$external").runCommand({ createUser: "C=MX,ST=Coahuila,L=Torreon,O=UTT-Clients,OU=DBA,CN=anthony.fuentes", roles: [ { role: "readWrite", db: "test" } ] })
```

![](/images/cuatri-8/admin-bd/mongodb/image-39.png)

*Figure 51. CC. Creación de usuario en $external.*

Cada certificado X.509 único representa un solo usuario de MongoDB, por lo que no debe reutilizarse un mismo certificado para múltiples identidades dentro del sistema.

### 5.5 Habilitación del Control de Acceso (Authorization)
Una vez que el usuario X.509 ha sido dado de alta exitosamente en la base de datos $external y se ha salido de la consola de MongoDB, es obligatorio reactivar el control de acceso en el servidor para que el sistema empiece a exigir de forma estricta las llaves de autenticación y bloquee el acceso anónimo.

Paso 1: Abra el archivo de configuración principal de MongoDB con un editor de textos:

Paso 2: Localice la sección security: (la cual se modificó previamente a *disabled* para permitir la creación del usuario inicial) y cambie el valor del parámetro authorization a enabled:

![](/images/cuatri-8/admin-bd/mongodb/image-40.png)

*Figure 52. CC. Cambio de valor de Authorization.*

Paso 3: Reinicie el servicio de MongoDB para que el sistema operativo aplique las nuevas directivas de seguridad:

![](/images/cuatri-8/admin-bd/mongodb/image-41.png)

*Figure 53. CC. Restablecimiento de servicio.*

### 5.6 Verificación de conexión segura

Una vez registrado el Subject del certificado como usuario, la autenticación puede realizarse directamente durante la conexión con mongosh usando --tls, --tlsCertificateKeyFile, --tlsCAFile, --authenticationDatabase '$external' y --authenticationMechanism MONGODB-X509. Ese es el flujo recomendado por MongoDB para autenticar clientes mediante certificados X.509.[cite:1]

```bash
mongosh --host localhost --port 27017 \
  --tls \
  --tlsCertificateKeyFile /ruta/completa/certs/client.pem \
  --tlsCAFile /ruta/completa/certs/ca.crt \
  --authenticationDatabase '$external' \
  --authenticationMechanism MONGODB-X509
```

![](/images/cuatri-8/admin-bd/mongodb/image-42.png)

*Figure 54. CC. verificación de entrada a Mongo con la autentificación.*

Si la configuración es correcta, el cliente accede al servidor mediante una sesión cifrada y autenticada con certificado, sin necesidad de proporcionar una contraseña tradicional para ese usuario X.509.

```javascript
db.runCommand({ connectionStatus: 1 })
```

![](/images/cuatri-8/admin-bd/mongodb/image-43.png)

*Figure 55. CC. Verificación de conexiones autenticadas activas.*

```javascript
show dbs
use test
db.test.insertOne({ verificacion: "conexion segura por x509" })
```

![](/images/cuatri-8/admin-bd/mongodb/image-44.png)

*Figure 56. CC. Inserción de datos de prueba.*

## 6. Ventajas y desventajas
| Aspecto | mTLS con X.509 | Contraseñas tradicionales |
| :---: | :---: | :---: |
| Validación de identidad | La identidad del cliente proviene del Subject del certificado y debe existir como usuario en $external. | La identidad depende de un nombre de usuario y un secreto compartido. |
| Protección del canal | Requiere una conexión TLS/SSL segura para autenticar al cliente. | La contraseña por sí sola no implica autenticación mutua del canal. |
| Administración | Exige una CA, emisión, distribución y renovación de certificados. | Requiere políticas de complejidad, resguardo y rotación de contraseñas. |
| Trazabilidad | Cada certificado X.509 único corresponde a un usuario único de MongoDB. | Un mismo esquema de credenciales puede ser compartido indebidamente entre operadores. |
| Riesgos operativos | Un certificado expirado no puede autenticarse correctamente. | Una contraseña débil o reutilizada incrementa el riesgo de acceso no autorizado. |
| Complejidad inicial | La configuración es más compleja por el manejo de archivos PEM, CA y Subjects RFC2253. | La implementación inicial suele ser más simple. |

*Table 13. CC. Ventajas y desventajas.*

## 7. Problemas comunes
| Error típico | Causa probable | Solución propuesta |
| :---: | :---: | :---: |
| Certificate expired | El certificado del cliente ya venció, y MongoDB exige que el certificado X.509 no esté expirado. | Renovar el certificado, firmarlo nuevamente con la CA correspondiente y reemplazar el archivo PEM. |
| Authentication failed o Subject mismatch | El Subject registrado como usuario no coincide exactamente con el Subject RFC2253 del certificado presentado. | Extraer nuevamente el Subject con OpenSSL, copiarlo sin alteraciones y recrear o corregir el usuario en $external. |
| Error de confianza de certificado o CA desconocida | El servidor o el cliente no están usando correctamente CAFile o no comparten la misma autoridad certificadora. | Verificar net.tls.CAFile, --tlsCAFile y confirmar que tanto servidor como cliente fueron firmados por la misma CA. |
| Problemas de validación de hostname o advertencias por SAN | MongoDB advierte sobre certificados sin Subject Alternative Name, y el uso exclusivo de CN está deprecado para varios clientes modernos. | Regenerar el certificado del servidor incluyendo SAN con el hostname o IP real usados en la conexión. |

*Table 14. CC. Problemas comunes.*

## 8. Conclusión
La práctica demuestra que la autenticación X.509 en MongoDB no se limita al cifrado del canal, sino que integra verificación de identidad basada en certificados, registro del Subject en $external y uso obligatorio de TLS para establecer una sesión confiable. En conjunto, estos elementos permiten elevar el nivel de seguridad del acceso a la base de datos frente a esquemas centrados únicamente en contraseñas.

Desde una perspectiva técnica, la implementación de mTLS aporta integridad, autenticidad y mayor control sobre quién se conecta realmente al servidor, siempre que la administración de certificados se realice de forma correcta. Por ello, el objetivo de la unidad se cumple al demostrar una conexión certificada funcional, verificable y alineada con prácticas formales de seguridad en MongoDB.

# Integración de MongoDB a través de OpenVPN: Configuración para el Acceso Remoto Seguro
## 1. Introducción
En escenarios donde una base de datos debe permanecer aislada del acceso público, una VPN permite crear un canal privado entre el cliente y el servidor. Para este caso, OpenVPN se utiliza como capa de acceso controlado, de modo que MongoDB solo pueda ser consultado desde equipos que hayan establecido correctamente la conexión VPN.

La idea principal consiste en instalar OpenVPN desde cero, generar certificados para el servidor y los clientes, crear la interfaz virtual de red tun0 y limitar la escucha de MongoDB a la dirección de la VPN. Con ello se evita que el puerto 27017 quede expuesto directamente a la red local o a Internet.

## 2. Objetivo General
Configurar OpenVPN como mecanismo de acceso privado para que MongoDB solo sea alcanzable desde la red VPN autorizada.

## 3. Objetivos Específicos
- Instalar OpenVPN y Easy-RSA en el servidor.
- Generar la autoridad certificadora y los certificados necesarios.
- Configurar la interfaz de red virtual para el túnel VPN.
- Restringir MongoDB para que escuche únicamente la IP asignada por la VPN.
- Verificar que el acceso directo a MongoDB quede bloqueado fuera de la VPN.

## 4. Requisitos Previos
Antes de comenzar, se debe contar con lo siguiente:

| Requisito | Descripción |
| :---: | :---: |
| Servidor Linux | Equipo donde se instalará OpenVPN y MongoDB. |
| Acceso administrativo | Permisos de sudo o usuario root. |
| Puerto disponible | Puerto 1194/udp libre para OpenVPN. |
| MongoDB instalado | Servicio de MongoDB ya desplegado. |
| Interfaz de red | Interfaz física activa, por ejemplo enp2s0. |

*Table 15. OVPN. Requisitos previos.*

## 5. Procedimiento de Configuración
### 5.1 Instalación de OpenVPN y Easy-RSA

```bash
sudo apt update

sudo apt install -y openvpn easy-rsa ufw
```

### 5.2 Creación de la PKI y certificados

```bash
make-cadir \~/openvpn-ca

cd \~/openvpn-ca

./easyrsa init-pki

./easyrsa build-ca

./easyrsa gen-req server nopass

./easyrsa sign-req server server

./easyrsa gen-req client1 nopass

./easyrsa sign-req client client1

./easyrsa gen-dh

openvpn --genkey secret ta.key
```

### 5.3 Configuración del servidor OpenVPN
Archivo: `/etc/openvpn/server/server.conf`

```conf
port 1194

proto udp

dev tun

ca /etc/openvpn/server/ca.crt

cert /etc/openvpn/server/server.crt

key /etc/openvpn/server/server.key

dh /etc/openvpn/server/dh.pem

tls-crypt /etc/openvpn/server/ta.key

server 10.9.0.0 255.255.255.0

push "redirect-gateway def1 bypass-dhcp"

push "dhcp-option DNS 1.1.1.1"

push "dhcp-option DNS 8.8.8.8"

keepalive 10 120

cipher AES-256-GCM

auth SHA256

persist-key

persist-tun

user nobody

group nogroup

verb 3
```

### 5.4 Habilitación del reenvío de red

```bash
sudo sysctl -w net.ipv4.ip_forward=1

echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf
```

### 5.5 Ajuste de NAT y firewall
La interfaz de salida detectada es enp2s0.

```bash
sudo ufw allow 1194/udp

sudo ufw allow OpenSSH
```

En /etc/ufw/before.rules se agrega la regla NAT:

```text
*nat

:POSTROUTING ACCEPT [0:0]

-A POSTROUTING -s 10.9.0.0/24 -o enp2s0 -j MASQUERADE

COMMIT
```

### 5.6 Inicio del servicio

```bash
sudo systemctl enable openvpn-server@server

sudo systemctl start openvpn-server@server
```

### 5.7 Configuración del cliente
Archivo: `client1.ovpn`

```conf
client

dev tun

proto udp

remote mail.midominio.com 1194

resolv_retry infinite

nobind

persist-key

persist-tun

remote-cert-tls server

cipher AES-256-GCM

auth SHA256

verb 3

tls-crypt ta.key

ca ca.crt

cert client1.crt

key client1.key
```

### 5.8 Restricción de MongoDB a la VPN
Archivo: `/etc/mongod.conf`

```yaml
net:

  port: 27017

  bindIp: 127.0.0.1,10.9.0.1
```

Reglas de firewall:

```bash
sudo ufw deny 27017

sudo ufw allow from 10.9.0.0/24 to any port 27017 proto tcp
```

## 6. Verificación

```bash
ip a show tun0

ss -lntp | grep 27017

systemctl status openvpn-server@server
```

La verificación correcta se cumple cuando el cliente logra conectarse a la VPN, se asigna una dirección dentro de la red 10.9.0.0/24 y MongoDB responde únicamente desde esa red privada.

## 7. Conclusión
La integración de MongoDB con OpenVPN permite limitar el acceso a la base de datos mediante una red privada autenticada por certificados. Este enfoque reduce la exposición del servicio y mantiene el puerto de MongoDB inaccesible desde fuera de la VPN.

Al conservar la base de datos escuchando solo en la IP virtual del túnel y reforzar la restricción con firewall, se obtiene un esquema sencillo, funcional y adecuado para entornos donde se requiere acceso remoto seguro.

# Referencias
- https://youtu.be/nGOW9kmc8p0?si=CM0wKQFkrtawFbn4
- https://youtu.be/u85PtC1bzug?si=4XkcfeJB0QciLLNz
3T Software Labs. (2026). *Studio 3T documentation*. Studio 3T. https://studio3t.com/knowledge-base/?utm_source=chatgpt.com
3T Software Labs. (2026). *Studio 3T official website*. Studio 3T. https://studio3t.com/?utm_source=chatgpt.com
DataCamp. (s. f.). *¿Qué es MongoDB? conceptos clave, casos de uso y buenas prácticas*. https://www.datacamp.com/es/blog/what-is-mongodb
GeeksforGeeks. (s. f.). *Replication and sharding in MongoDB*. https://www.geeksforgeeks.org/mongodb/mongodb-replication-and-sharding/
MangoHost. (s. f.). *Configuring keyfile authentication for MongoDB replica sets on Ubuntu 24*. https://mangohost.net/blog/configuring-keyfile-authentication-for-mongodb-replica-sets-on-ubuntu-24/
MongoDB, Inc. (2026). *MongoDB Compass*. MongoDB. https://www.mongodb.com/products/tools/compass/?utm_source=chatgpt.com
MongoDB, Inc. (2026). *MongoDB Database Tools*. MongoDB. https://www.mongodb.com/docs/database-tools/?utm_source=chatgpt.com
MongoDB, Inc. (2026). *MongoDB documentation*. MongoDB. https://www.mongodb.com/docs/?utm_source=chatgpt.com
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

[image1]: /images/cuatri-8/admin-bd/mongodb/image-01.png
[image2]: /images/cuatri-8/admin-bd/mongodb/image-02.png
[image3]: /images/cuatri-8/admin-bd/mongodb/image-03.png
[image4]: /images/cuatri-8/admin-bd/mongodb/image-04.png
[image5]: /images/cuatri-8/admin-bd/mongodb/image-05.png
[image6]: /images/cuatri-8/admin-bd/mongodb/image-06.png
[image7]: /images/cuatri-8/admin-bd/mongodb/image-07.png
[image8]: /images/cuatri-8/admin-bd/mongodb/image-08.png
[image9]: /images/cuatri-8/admin-bd/mongodb/image-09.png
[image10]: /images/cuatri-8/admin-bd/mongodb/image-10.png
[image11]: /images/cuatri-8/admin-bd/mongodb/image-11.png
[image12]: /images/cuatri-8/admin-bd/mongodb/image-12.png
[image13]: /images/cuatri-8/admin-bd/mongodb/image-13.png
[image14]: /images/cuatri-8/admin-bd/mongodb/image-14.png
[image15]: /images/cuatri-8/admin-bd/mongodb/image-15.png
[image16]: /images/cuatri-8/admin-bd/mongodb/image-16.png
[image17]: /images/cuatri-8/admin-bd/mongodb/image-17.png
[image18]: /images/cuatri-8/admin-bd/mongodb/image-18.png
[image19]: /images/cuatri-8/admin-bd/mongodb/image-19.png
[image20]: /images/cuatri-8/admin-bd/mongodb/image-20.png
[image21]: /images/cuatri-8/admin-bd/mongodb/image-21.png
[image22]: /images/cuatri-8/admin-bd/mongodb/image-22.png
[image23]: /images/cuatri-8/admin-bd/mongodb/image-23.png
[image24]: /images/cuatri-8/admin-bd/mongodb/image-24.png
[image25]: /images/cuatri-8/admin-bd/mongodb/image-25.png
[image26]: /images/cuatri-8/admin-bd/mongodb/image-26.png
[image27]: /images/cuatri-8/admin-bd/mongodb/image-27.png
[image28]: /images/cuatri-8/admin-bd/mongodb/image-28.png
[image29]: /images/cuatri-8/admin-bd/mongodb/image-29.png
[image30]: /images/cuatri-8/admin-bd/mongodb/image-30.png
[image31]: /images/cuatri-8/admin-bd/mongodb/image-31.png
[image32]: /images/cuatri-8/admin-bd/mongodb/image-32.png
[image33]: /images/cuatri-8/admin-bd/mongodb/image-33.png
[image34]: /images/cuatri-8/admin-bd/mongodb/image-34.png
[image35]: /images/cuatri-8/admin-bd/mongodb/image-35.png
[image36]: /images/cuatri-8/admin-bd/mongodb/image-36.png
[image37]: /images/cuatri-8/admin-bd/mongodb/image-37.png
[image38]: /images/cuatri-8/admin-bd/mongodb/image-38.png
[image39]: /images/cuatri-8/admin-bd/mongodb/image-39.png
[image40]: /images/cuatri-8/admin-bd/mongodb/image-40.png
[image41]: /images/cuatri-8/admin-bd/mongodb/image-41.png
[image42]: /images/cuatri-8/admin-bd/mongodb/image-42.png
[image43]: /images/cuatri-8/admin-bd/mongodb/image-43.png
[image44]: /images/cuatri-8/admin-bd/mongodb/image-44.png
