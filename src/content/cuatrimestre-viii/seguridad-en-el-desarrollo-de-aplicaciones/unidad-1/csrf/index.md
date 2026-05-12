---
title: "CSRF: Falsificación de Petición en Sitios Cruzados"
description: "Exploración exhaustiva de la vulnerabilidad CSRF, su historia, casos reales, mecanismos de defensa y su evolución en el panorama de seguridad web."
date: 2026-05-12
draft: false
order: 1
tags: ["CSRF", "seguridad", "web", "OWASP"]

---

# **Tratado integral sobre la Falsificación de Petición en Sitios Cruzados (CSRF): Arquitectura, Explotación y Estrategias Avanzadas de Defensa en la Web 4.0**

El panorama de la seguridad de las aplicaciones web ha experimentado una transformación radical desde los albores de la red. En el centro de esta evolución se encuentra una vulnerabilidad que, a pesar de ser conceptualmente sencilla, ha persistido durante décadas como una de las amenazas más insidiosas para la integridad de las sesiones de usuario: la Falsificación de Petición en Sitios Cruzados, conocida universalmente por sus siglas en inglés como CSRF (Cross-Site Request Forgery). Este fenómeno, también denominado "session riding" o "ataque de un solo clic", representa una quiebra fundamental en la premisa de confianza sobre la cual se construyó el protocolo HTTP y la gestión de estados mediante cookies.1

El CSRF no es simplemente un error de programación; es una explotación de la mecánica intrínseca de los navegadores web modernos. La vulnerabilidad surge cuando una aplicación web confía ciegamente en las credenciales que el navegador envía de forma automática, sin verificar si la acción que acompaña a esas credenciales fue iniciada por la voluntad consciente del usuario o por un script malicioso ejecutado en un contexto de origen distinto.3 A medida que avanzamos hacia arquitecturas más complejas, como las aplicaciones de una sola página (SPA) y los microservicios, la comprensión profunda del CSRF se vuelve imperativa para cualquier profesional de la ciberseguridad.

## **Génesis y Conceptos Fundamentales del CSRF**

Para comprender la magnitud del riesgo que representa el CSRF, es necesario desglosar su etimología y su mecánica operativa. El término "Cross-Site" (entre sitios) se refiere a la capacidad de un sitio web de origen (el sitio del atacante) para interactuar con un sitio web de destino (la aplicación vulnerable) a través del navegador de la víctima. La "Request Forgery" (falsificación de petición) implica que el atacante diseña una solicitud HTTP que parece legítima a los ojos del servidor de destino porque incluye las pruebas de identidad necesarias, principalmente cookies de sesión.1

### **El Modelo de Confianza del Navegador**

Los navegadores web fueron diseñados originalmente para facilitar la navegación fluida. Un componente clave de esta fluidez es el manejo automático de las cookies. Cuando un usuario se autentica en un sitio, por ejemplo, bank.com, el servidor responde con una cookie de sesión. El navegador, siguiendo los estándares históricos, adjuntará esa cookie a cada solicitud subsiguiente dirigida a bank.com, independientemente de si el usuario escribió la URL en la barra de direcciones o si un script en malicious-site.net disparó una solicitud en segundo plano.3

Este comportamiento es el núcleo del problema. El servidor de la aplicación recibe una solicitud para, por ejemplo, cambiar la dirección de correo electrónico de la cuenta. La solicitud llega con una cookie de sesión válida. Para el servidor, esta es una prueba suficiente de que el usuario está "presente" y "autenticado". Sin embargo, el servidor no tiene forma de saber si el usuario realmente deseaba realizar esa acción o si fue engañado por una técnica de ingeniería social.6

### **Terminología y Variaciones del Ataque**

El CSRF ha recibido múltiples nombres a lo largo de los años, cada uno destacando una faceta diferente de su ejecución. El término "One-Click Attack" subraya la simplicidad desde la perspectiva de la víctima, quien solo necesita hacer clic en un enlace malicioso. "Session Riding" describe cómo el atacante "se monta" en la sesión activa del usuario para realizar acciones.1 Es fundamental distinguir el CSRF del Cross-Site Scripting (XSS). Mientras que el XSS busca robar información o ejecutar scripts en el sitio de la víctima explotando la confianza del usuario en dicho sitio, el CSRF explota la confianza del sitio en el navegador del usuario.2

| Término | Definición Técnica | Enfoque Primario |
| :---- | :---- | :---- |
| **CSRF / XSRF** | Cross-Site Request Forgery | Explotación de la confianza del servidor en el navegador. |
| **Session Riding** | El uso de una sesión activa para enviar comandos no autorizados. | Aprovechamiento de cookies automáticas. |
| **Sea-Surf** | Pronunciación fonética de CSRF. | Jerga de seguridad. |
| **One-Click Attack** | Ataque que requiere mínima interacción del usuario. | Vector de ingeniería social. |

## **Condiciones Críticas para la Existencia de la Vulnerabilidad**

La literatura de seguridad, particularmente la documentación de OWASP y PortSwigger, identifica tres pilares fundamentales que deben estar presentes para que un ataque CSRF sea viable en una aplicación web.2 Si uno de estos pilares se debilita o se elimina, la superficie de ataque se reduce drásticamente.

### **Una Acción de Relevancia en la Aplicación**

El atacante debe tener un motivo para forjar la solicitud. Generalmente, esto implica una acción que cambie el estado del servidor o la cuenta del usuario. Las acciones puramente de lectura no suelen ser objetivos de CSRF porque el atacante, aunque puede forzar la solicitud, no puede ver la respuesta del servidor debido a la Same-Origin Policy (SOP).6 Las acciones típicas incluyen:

* Cambio de contraseñas o credenciales de seguridad.  
* Modificación de datos de perfil (correo electrónico, dirección física).  
* Transferencias de fondos o transacciones financieras.  
* Elevación de privilegios en cuentas administrativas.3

### **Gestión de Sesiones Basada Exclusivamente en Cookies**

El ataque depende de que el navegador envíe automáticamente las credenciales. Si la aplicación utiliza cookies de sesión estándar y no emplea mecanismos adicionales de validación (como cabeceras de autorización manuales), es intrínsecamente vulnerable.1 Cuando un desarrollador decide confiar solo en la presencia de la cookie para validar una acción POST, está abriendo la puerta a la suplantación de la intención del usuario.

### **Parámetros de Solicitud Predecibles**

Para que un atacante pueda forjar una solicitud, debe conocer todos los parámetros necesarios para que el servidor la procese con éxito. Si la solicitud para transferir dinero requiere un número de cuenta y una cantidad, y estos son los únicos campos, el atacante puede construir la solicitud fácilmente. Sin embargo, si la solicitud requiere un token aleatorio y secreto que el atacante no puede adivinar, la forja se vuelve imposible.4

## **Análisis de Casos Históricos y Relevancia en el Mundo Real**

La historia de la ciberseguridad está plagada de incidentes donde empresas de primer nivel fueron víctimas de vulnerabilidades CSRF, lo que subraya que incluso los equipos de ingeniería más experimentados pueden pasar por alto este riesgo.

### **La Vulnerabilidad Masiva de YouTube en 2008**

En 2008, investigadores de la Universidad de Princeton descubrieron que YouTube era vulnerable a ataques CSRF que permitían a un atacante realizar casi cualquier acción en nombre de un usuario autenticado. Al atraer a un usuario a un sitio malicioso, el atacante podía forzar al navegador de la víctima a agregar videos a sus "favoritos", unirse a grupos, enviar mensajes de spam a sus contactos o incluso denunciar videos legítimos como inapropiados.2 Este caso es emblemático porque demuestra cómo el CSRF puede ser utilizado no solo para el robo financiero, sino también para la manipulación social y el daño a la reputación de una plataforma.

### **Infiltración en Gmail y Exfiltración de Datos**

Google también enfrentó desafíos con el CSRF. En 2007, se descubrió una falla en Gmail que permitía a los atacantes agregar filtros de correo electrónico de forma silenciosa. Un atacante podía forjar una solicitud para crear un filtro que reenviara automáticamente todos los correos electrónicos entrantes de la víctima a una dirección externa bajo el control del atacante.9 Este ataque era particularmente peligroso porque era persistente; una vez que el filtro se creaba mediante el ataque CSRF inicial, la exfiltración de datos continuaba sin que el usuario tuviera que volver a interactuar con el atacante.

### **El Caso de ING Direct y la Seguridad Financiera**

Las instituciones financieras no han sido inmunes. ING Direct, un importante banco en línea, sufrió una vulnerabilidad en 2008 que permitía transferencias ilícitas de dinero. A pesar de que el sitio utilizaba SSL para el cifrado de datos, la falta de protección específica contra CSRF significaba que una simple solicitud forjada podía mover fondos entre cuentas si el usuario estaba logueado en su banca en línea en otra pestaña del navegador.2 Esto refuerza la idea de que el cifrado de transporte (HTTPS) no protege contra el CSRF, ya que el ataque ocurre dentro del túnel cifrado legítimo.5

| Aplicación | Año | Impacto del Ataque CSRF | Estado Actual |
| :---- | :---- | :---- | :---- |
| **Gmail** | 2007 | Reenvío automático de correos (filtros forjados). | Mitigado con Tokens. |
| **YouTube** | 2008 | Acciones completas de usuario (likes, mensajes, denuncias). | Mitigado con Tokens. |
| **ING Direct** | 2008 | Transferencias de fondos no autorizadas. | Mitigado con múltiples capas. |
| **Netflix** | 2014 | Cambio de contraseña y secuestro de cuenta. | Mitigado con SameSite/Tokens. |
| **μTorrent** | 2008 | Ejecución de comandos en la interfaz local. | Parcheado en versiones nuevas. |

## **Mecanismos de Defensa: El Token de Sincronización (STP)**

La defensa más robusta y ampliamente aceptada contra el CSRF es el Patrón de Token de Sincronización. Este método rompe el tercer pilar de la vulnerabilidad: la predictibilidad de los parámetros.3

### **Generación y Validación del Token**

Un token CSRF es un valor alfanumérico, aleatorio y único generado por el servidor para cada sesión de usuario o, idealmente, para cada solicitud. Cuando el servidor renderiza una página que contiene un formulario sensible, inserta el token en un campo de entrada oculto (hidden field).4

HTML

\<form action\="/transferir" method\="POST"\>  
    \<input type\="hidden" name\="csrf\_token" value\="5j89ab2d9s1m4n3o8p9q7r6t"\>  
    \<input type\="text" name\="cantidad"\>  
    \<button type\="submit"\>Enviar\</button\>  
\</form\>

Cuando el usuario envía el formulario, el navegador envía el valor del token junto con los demás datos. El servidor compara el token recibido con el que tiene almacenado en la sesión del usuario. Si coinciden, la solicitud se procesa. Si el token falta o es incorrecto, el servidor debe rechazar la solicitud, registrar el evento como un posible ataque y, opcionalmente, invalidar la sesión del usuario para mayor seguridad.5

### **Propiedades de un Token Seguro**

Para que este mecanismo sea efectivo, el token debe cumplir con criterios criptográficos estrictos:

1. **Impredictibilidad:** Debe generarse mediante un generador de números aleatorios criptográficamente seguro (CSRNG) para evitar ataques de adivinación o fuerza bruta.4  
2. **Unicidad:** Debe ser único por sesión o por solicitud para evitar ataques de repetición.  
3. **Transmisión Segura:** Nunca debe enviarse en la URL (peticiones GET), ya que podría quedar expuesto en los registros del servidor, en el historial del navegador o en la cabecera Referer al navegar a sitios externos.6

## **Alternativas de Mitigación: Doble Envío de Cookie y HMAC**

En arquitecturas donde el servidor no mantiene un estado de sesión (stateless), como en muchas APIs modernas o sistemas distribuidos masivamente, el almacenamiento de tokens en el servidor puede resultar costoso o técnicamente inviable. En estos casos, se recurre a patrones alternativos.

### **Patrón de Doble Envío de Cookie (Double Submit Cookie)**

Este patrón es popular por su simplicidad y naturaleza sin estado. El servidor genera un valor aleatorio y lo envía al navegador del usuario en una cookie. Al mismo tiempo, el código de la aplicación (generalmente JavaScript) debe incluir ese mismo valor como un parámetro en la solicitud POST o en una cabecera personalizada.3

El servidor, al recibir la solicitud, no consulta una base de datos de sesiones. Simplemente verifica que el valor en la cookie coincida con el valor en el parámetro de la solicitud. Dado que los atacantes no pueden leer ni modificar cookies de un sitio diferente debido a la SOP, no pueden incluir el valor correcto en su solicitud forjada.4 Sin embargo, este método es vulnerable si un atacante logra comprometer un subdominio, ya que podría sobreescribir la cookie para el dominio principal.5

### **Uso de HMAC para Tokens CSRF**

Una técnica avanzada consiste en utilizar códigos de autenticación de mensajes basados en hash (HMAC) para generar tokens. En este esquema, el token no es un valor aleatorio almacenado, sino el resultado de firmar criptográficamente el ID de sesión del usuario y una marca de tiempo con una clave secreta del servidor.5

![][image1]  
Esto permite al servidor validar el token recalculando el hash sin necesidad de almacenamiento persistente, garantizando además que el token expire después de un tiempo determinado.5

## **La Revolución de las Cookies SameSite**

Uno de los cambios más significativos en la defensa contra el CSRF ha venido directamente de los fabricantes de navegadores a través de la introducción del atributo SameSite en las cookies. Este atributo instruye al navegador sobre si debe enviar cookies en solicitudes iniciadas desde otros sitios web.10

### **Configuraciones de SameSite: Strict, Lax y None**

El atributo SameSite ofrece tres niveles de protección que alteran fundamentalmente cómo el navegador maneja la "confianza automática":

1. **Strict:** Es el nivel más restrictivo. La cookie solo se envía si la solicitud proviene del mismo sitio donde se originó la cookie. Si un usuario está en un sitio externo y hace clic en un enlace a su banco, el banco no recibirá la cookie de sesión y el usuario aparecerá como no autenticado inicialmente.10  
2. **Lax:** Es el compromiso entre seguridad y usabilidad. Las cookies no se envían en solicitudes POST cruzadas, pero sí se envían cuando el usuario sigue un enlace (navegación de nivel superior mediante GET).10 Desde 2021, este es el comportamiento por defecto en navegadores como Chrome y Firefox para cookies que no especifican el atributo.11  
3. **None:** El navegador enviará la cookie en todos los contextos, incluyendo solicitudes cruzadas. Para usar este valor, la cookie debe tener obligatoriamente el atributo Secure, lo que significa que solo se transmitirá sobre HTTPS.10

### **Impacto del "Lax-by-Default" y Nuevos Vectores de Ataque**

La transición a SameSite=Lax por defecto ha eliminado de golpe una gran cantidad de vulnerabilidades CSRF "clásicas" basadas en formularios ocultos que se envían automáticamente mediante POST. Sin embargo, no es una solución mágica. Los atacantes han respondido buscando formas de convertir acciones POST en GET (si la aplicación es agnóstica al método) o explotando la ventana de 120 segundos que algunos navegadores (como Chrome) permiten para el envío de cookies Lax en solicitudes POST inmediatamente después de que se crea una cookie para permitir flujos de autenticación.11

| Atributo SameSite | Envío en POST Cross-Site | Envío en Enlaces (GET) | Recomendación de Uso |
| :---- | :---- | :---- | :---- |
| **Strict** | No | No | Acciones críticas (banca, administración). |
| **Lax** | No | Sí | Aplicaciones estándar (redes sociales, e-commerce). |
| **None** | Sí | Sí | Widgets de terceros, anuncios (Requiere HTTPS). |

## **Implementación Práctica en Frameworks Modernos: Django y AdonisJS**

Los marcos de desarrollo modernos han integrado la protección contra CSRF de manera tan profunda que a menudo los desarrolladores la utilizan sin comprender su funcionamiento interno. Analizar cómo lo hacen Django 5.0 y AdonisJS 6.0 revela las mejores prácticas actuales.

### **Seguridad Robusta en Django 5.0**

Django utiliza un sistema basado en tokens de sincronización gestionado por su CsrfViewMiddleware. El proceso es exhaustivo:

* **Enmascaramiento de Tokens:** Para protegerse contra ataques de oráculo de compresión (como BREACH), Django no envía el token "crudo" en el HTML. En su lugar, lo combina con una máscara aleatoria en cada renderización de página. El middleware des-enmascara el token antes de compararlo.12  
* **Verificación de Origen y Referer:** Django 5.0 realiza una doble comprobación. Para solicitudes HTTPS, exige que la cabecera Referer coincida con el host actual. También verifica la cabecera Origin contra una lista blanca configurada en CSRF\_TRUSTED\_ORIGINS.12  
* **Uso en AJAX:** Django facilita el uso de tokens en aplicaciones JavaScript mediante la lectura de la cookie csrftoken y su inclusión en la cabecera X-CSRFToken de la solicitud.12

### **Protección con Shield en AdonisJS 6**

AdonisJS aborda la seguridad mediante el paquete oficial @adonisjs/shield, que proporciona una capa de defensa configurable para aplicaciones SSR (Server-Side Rendering) y APIs.

* **Middleware Shield:** Valida automáticamente los métodos POST, PUT, PATCH y DELETE. Si el token falta o es inválido, lanza una excepción E\_BAD\_CSRF\_TOKEN.13  
* **Flexibilidad en la Entrega:** Permite entregar el token a través de formularios usando csrfField() o mediante una cookie XSRF-TOKEN diseñada para que bibliotecas frontend como Axios la lean automáticamente y la devuelvan en la cabecera X-XSRF-TOKEN.13  
* **Exenciones Dinámicas:** Los desarrolladores pueden definir rutas exentas (como webhooks externos) mediante patrones de cadena o funciones lógicas que evalúan el contexto de la solicitud en tiempo real.13

## **Defensas Emergentes: Fetch Metadata y Sec-Fetch-Site**

A medida que las cabeceras HTTP evolucionan, han surgido nuevas herramientas que permiten a los servidores tomar decisiones de seguridad basadas en el contexto de la solicitud, sin depender únicamente de tokens secretos. Este conjunto de cabeceras se conoce como Fetch Metadata.10

### **La Cabecera Sec-Fetch-Site**

Esta cabecera indica la relación entre el origen de la solicitud y el destino. Puede tener cuatro valores:

* same-origin: La solicitud proviene del mismo origen exacto.  
* same-site: Proviene de un subdominio o el mismo dominio principal.  
* cross-site: Proviene de un sitio completamente diferente.  
* none: Solicitudes iniciadas directamente por el usuario (como escribir en la barra de direcciones).

Un servidor moderno puede implementar una política de "aislamiento de recursos" donde simplemente rechaza cualquier solicitud de cambio de estado (POST/PUT/DELETE) cuyo valor de Sec-Fetch-Site sea cross-site.14 Esta es una defensa extremadamente potente y de bajo costo que complementa a los tokens CSRF.

### **Ventajas de Fetch Metadata como Defensa en Profundidad**

A diferencia de los tokens, Fetch Metadata no requiere gestión de estado ni inyección de valores en el HTML. Proporciona una forma fiable de bloquear el "ruido" de solicitudes cruzadas automáticas antes de que la solicitud llegue siquiera a la lógica de autenticación de la aplicación.14 No obstante, OWASP advierte que no debe ser la única defensa, ya que clientes antiguos o herramientas de automatización podrían no enviar estas cabeceras, y en esos casos, la aplicación debe caer (fail-safe) a la validación tradicional por tokens.14

## **Intersección Crítica: Por qué el XSS anula las Defensas CSRF**

Un concepto vital que todo profesional de seguridad debe asimilar es que el Cross-Site Scripting (XSS) actúa como un "comodín" que puede invalidar prácticamente todas las protecciones contra CSRF.3

### **El Mecanismo de Elusión mediante XSS**

Si un atacante encuentra una vulnerabilidad XSS en victim-site.com, puede inyectar un script que se ejecute en el mismo origen que la aplicación. Debido a que el script reside en el mismo origen:

1. **Puede leer el DOM:** El script puede buscar el campo oculto csrf\_token y extraer su valor.5  
2. **Puede leer Cookies:** A menos que las cookies estén marcadas como HttpOnly, el script puede extraer tokens de doble envío.5  
3. **Puede realizar Peticiones:** El script puede enviar una solicitud XMLHttpRequest o fetch que incluya el token correcto y las cookies de sesión, y el servidor no tendrá forma de detectar la forja.5

Este es el motivo por el cual OWASP y otros organismos enfatizan que la prevención del XSS es un requisito previo para la confianza en cualquier mitigación de CSRF.3

## **El CSRF en el Panorama de OWASP 2024-2025**

La percepción del CSRF como una amenaza independiente ha cambiado en las actualizaciones más recientes del OWASP Top 10\. Mientras que en versiones anteriores (como 2013\) tenía su propia categoría, en la versión de 2021 y la propuesta para 2025, el CSRF se considera una manifestación de fallos en el Control de Acceso (A01:2025) o en la Configuración de Seguridad (A02:2025).15

### **Evolución de la Tasa de Incidencia**

La disminución del CSRF en las listas de prioridades no se debe a que la vulnerabilidad sea menos peligrosa, sino a que los frameworks modernos (como los mencionados Django y AdonisJS) han tenido tanto éxito en implementar protecciones por defecto que la tasa de incidencia en nuevas aplicaciones ha caído drásticamente.16 Hoy en día, encontrar un CSRF trivial en una aplicación moderna es a menudo un signo de que un desarrollador desactivó explícitamente las protecciones o cometió un error grave en la configuración de las cookies.16

### **Enfoque en la Causa Raíz**

El movimiento de OWASP hacia categorías basadas en la causa raíz (como "Diseño Inseguro") refleja una comprensión más profunda de la seguridad. El CSRF es visto ahora como un síntoma de un sistema que no valida la intención del usuario. Por lo tanto, la recomendación actual no es solo "añadir tokens", sino diseñar flujos de trabajo que verifiquen la presencia activa y consciente del usuario en cada paso crítico.16

## **Conclusiones y Recomendaciones de Seguridad para el Futuro**

La lucha contra el Cross-Site Request Forgery ha entrado en una fase de madurez donde las soluciones técnicas son bien conocidas y están integradas en las herramientas de desarrollo. Sin embargo, la persistencia de sistemas legados y la complejidad de las integraciones modernas mantienen al CSRF como un riesgo latente.

Para garantizar la máxima protección, las organizaciones deben adoptar un enfoque de defensa en profundidad que incluya las siguientes directrices estratégicas:

1. **Uso de Frameworks con Protección Integrada:** No se debe intentar implementar una solución CSRF desde cero. Se deben utilizar las capacidades nativas de marcos probados como Django, Spring, Laravel o AdonisJS, asegurándose de que el middleware de seguridad esté activo para todas las rutas que cambian de estado.3  
2. **Configuración Estricta de Cookies:** Todas las cookies de sesión deben tener el atributo SameSite=Lax por defecto, o SameSite=Strict para aplicaciones de alta sensibilidad. Además, deben marcarse como HttpOnly para mitigar el impacto de un posible XSS y Secure para garantizar su transmisión cifrada.10  
3. **Implementación de Tokens de Sincronización:** A pesar de las mejoras en los navegadores, los tokens CSRF siguen siendo la única defensa que vincula criptográficamente una solicitud a una sesión específica y a un flujo de página concreto. Deben ser obligatorios para cualquier acción que altere datos del usuario o del sistema.4  
4. **Adopción de Fetch Metadata:** Configurar los servidores web para evaluar las cabeceras Sec-Fetch-Site y rechazar solicitudes cruzadas no deseadas. Esto proporciona una capa de seguridad perimetral que protege contra variantes modernas de ataques cross-site.14  
5. **Validación de Intención en Operaciones Críticas:** Para acciones de alto riesgo (transferencias bancarias, cambio de contraseñas, borrado de cuentas), se debe requerir una interacción adicional del usuario, como la re-introducción de la contraseña, un código de un solo uso (OTP) o un desafío CAPTCHA. Esta es la única defensa que permanece efectiva incluso ante un compromiso total del navegador mediante XSS.5

En última instancia, la seguridad contra el CSRF no es un destino, sino un proceso continuo de vigilancia y adaptación. Mientras los navegadores sigan siendo el agente que actúa en nombre del usuario, la posibilidad de abusar de esa delegación de autoridad existirá, y solo una arquitectura diseñada con la desconfianza por defecto podrá mitigar este riesgo de manera efectiva.

#### **Obras citadas**

1. What Is CSRF (Cross-Site Request Forgery)? \- Palo Alto Networks, fecha de acceso: mayo 12, 2026, [https://www.paloaltonetworks.com/cyberpedia/csrf-cross-site-request-forgery](https://www.paloaltonetworks.com/cyberpedia/csrf-cross-site-request-forgery)  
2. Cross-site request forgery \- Wikipedia, fecha de acceso: mayo 12, 2026, [https://en.wikipedia.org/wiki/Cross-site\_request\_forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery)  
3. Cross-Site Request Forgery Prevention \- OWASP Cheat Sheet Series, fecha de acceso: mayo 12, 2026, [https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site\_Request\_Forgery\_Prevention\_Cheat\_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)  
4. Cross-Site Request Forgery (CSRF): Examples & Prevention \- Wiz, fecha de acceso: mayo 12, 2026, [https://www.wiz.io/academy/application-security/cross-site-request-forgery-csrf](https://www.wiz.io/academy/application-security/cross-site-request-forgery-csrf)  
5. Cross-Site Request Forgery Prevention · OWASP Cheat Sheet Series, fecha de acceso: mayo 12, 2026, [https://jcarpizo.github.io/owasp-info/cheatsheets/Cross-Site\_Request\_Forgery\_Prevention\_Cheat\_Sheet.html](https://jcarpizo.github.io/owasp-info/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)  
6. Cross Site Request Forgery (CSRF) \- OWASP Foundation, fecha de acceso: mayo 12, 2026, [https://owasp.org/www-community/attacks/csrf](https://owasp.org/www-community/attacks/csrf)  
7. CSRF Attacks: Real Life Attacks and Code Walkthrough \- Bright Security, fecha de acceso: mayo 12, 2026, [https://brightsec.com/blog/csrf-attack/](https://brightsec.com/blog/csrf-attack/)  
8. What is CSRF (Cross-site request forgery)? Tutorial & Examples | Web Security Academy, fecha de acceso: mayo 12, 2026, [https://portswigger.net/web-security/csrf](https://portswigger.net/web-security/csrf)  
9. Cross-Site Request Forgery \- Reardon Tech, fecha de acceso: mayo 12, 2026, [https://www.reardontech.uk/posts/csrf/](https://www.reardontech.uk/posts/csrf/)  
10. Cross-site request forgery (CSRF) \- Security \- MDN Web Docs, fecha de acceso: mayo 12, 2026, [https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/CSRF)  
11. Bypassing SameSite cookie restrictions | Web Security Academy, fecha de acceso: mayo 12, 2026, [https://portswigger.net/web-security/csrf/samesite-cookies](https://portswigger.net/web-security/csrf/samesite-cookies)  
12. Cross Site Request Forgery protection | Django documentation ..., fecha de acceso: mayo 12, 2026, [https://docs.djangoproject.com/en/5.0/ref/csrf/](https://docs.djangoproject.com/en/5.0/ref/csrf/)  
13. Securing SSR apps (Security) \- AdonisJS Documentation, fecha de acceso: mayo 12, 2026, [https://docs.adonisjs.com/guides/security/securing-ssr-applications](https://docs.adonisjs.com/guides/security/securing-ssr-applications)  
14. Update: Cross-Site Request Forgery Prevention Cheat Sheet \- add Fetch Metadata · Issue \#1803 · OWASP/CheatSheetSeries \- GitHub, fecha de acceso: mayo 12, 2026, [https://github.com/OWASP/CheatSheetSeries/issues/1803](https://github.com/OWASP/CheatSheetSeries/issues/1803)  
15. Introduction \- OWASP Top 10:2025, fecha de acceso: mayo 12, 2026, [https://owasp.org/Top10/2025/0x00\_2025-Introduction/](https://owasp.org/Top10/2025/0x00_2025-Introduction/)  
16. OWASP Top 10 2025: Key Changes and What They Mean for Application Security, fecha de acceso: mayo 12, 2026, [https://orca.security/resources/blog/owasp-top-10-2025-key-changes/](https://orca.security/resources/blog/owasp-top-10-2025-key-changes/)  
17. The 2025 OWASP Top 10 and IdentityServer \- Duende Software, fecha de acceso: mayo 12, 2026, [https://duendesoftware.com/blog/20260423-the-2025-owasp-top-10](https://duendesoftware.com/blog/20260423-the-2025-owasp-top-10)  
18. OWASP Top 10 2025: What's changed and why it matters \- GitLab, fecha de acceso: mayo 12, 2026, [https://about.gitlab.com/blog/2025-owasp-top-10-whats-changed-and-why-it-matters/](https://about.gitlab.com/blog/2025-owasp-top-10-whats-changed-and-why-it-matters/)  
19. CSRF Protection \- AdonisJs, fecha de acceso: mayo 12, 2026, [https://legacy.adonisjs.com/docs/4.1/csrf](https://legacy.adonisjs.com/docs/4.1/csrf)
