---
title: "Desplegar una página HTML con Nginx"
description: "Guía paso a paso para levantar un servidor Nginx con Docker y Docker Compose para servir una página HTML."
date: 2026-03-07
draft: false
tags: ["docker", "nginx", "devops", "linux", "servidores"]
---

---

# Desplegar una página HTML con Nginx usando Docker

En esta guía aprenderás a **levantar un servidor web Nginx usando Docker** para renderizar una página HTML estática.

Este método es muy útil cuando quieres:

- Desplegar páginas web de forma rápida
- Mantener entornos reproducibles
- Usar contenedores para desarrollo o producción
- Administrar servicios fácilmente con Docker Compose

Al finalizar tendrás:

- Un contenedor Docker con **Nginx**
- Una configuración personalizada
- Una página HTML servida desde el contenedor

---

# 1. Requisitos

Antes de comenzar asegúrate de tener instalado:

- Docker
- Docker Compose

Puedes verificarlo con:

```bash
docker --version
docker compose version
```

---

## Imagen sugerida

```
/images/docker/docker-version.png
```

---

# 2. Estructura del proyecto

Primero crearemos la estructura del proyecto.

```bash
mkdir nginx-docker
cd nginx-docker
```

Estructura final del proyecto:

```
nginx-docker
│
├── docker-compose.yml
├── Dockerfile
│
├── nginx
│   └── default.conf
│
└── html
    └── index.html
```

---

## Imagen sugerida

```
/images/nginx/project-structure.png
```

---

# 3. Crear la página HTML

Dentro de la carpeta **html** crearemos nuestra página.

```bash
mkdir html
nano html/index.html
```

Contenido de ejemplo:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mi servidor Nginx con Docker</title>
  </head>

  <body>
    <h1>Servidor funcionando 🚀</h1>
    <p>Este sitio está siendo servido por Nginx dentro de Docker.</p>
  </body>
</html>
```

---

## Imagen sugerida

```
/images/nginx/html-file.png
```

---

# 4. Crear la configuración de Nginx

Ahora crearemos una configuración personalizada.

```bash
mkdir nginx
nano nginx/default.conf
```

Contenido:

```nginx
server {
    listen 80;

    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Explicación:

- **listen 80** → Nginx escuchará en el puerto 80
- **root** → carpeta donde se encuentran los archivos HTML
- **index** → archivo principal que se renderizará

---

## Imagen sugerida

```
/images/nginx/nginx-config.png
```

---

# 5. Crear el Dockerfile

Ahora crearemos la imagen personalizada de Nginx.

```bash
nano Dockerfile
```

Contenido:

```dockerfile
FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

COPY html /usr/share/nginx/html
```

Explicación:

- **FROM nginx:alpine** → usa la imagen ligera de Nginx
- **COPY config** → reemplaza la configuración por defecto
- **COPY html** → copia nuestros archivos web

---

## Imagen sugerida

```
/images/nginx/dockerfile.png
```

---

# 6. Crear docker-compose

Docker Compose nos permite levantar el servicio fácilmente.

Crear el archivo:

```bash
nano docker-compose.yml
```

Contenido:

```yaml
version: "3.9"

services:
  nginx:
    build: .
    container_name: nginx-server

    ports:
      - "8080:80"

    restart: always
```

Explicación:

- **build** → construye la imagen usando el Dockerfile
- **ports** → expone el puerto 80 del contenedor en el 8080 del host
- **restart always** → reinicia el contenedor si falla

---

## Imagen sugerida

```
/images/nginx/docker-compose.png
```

---

# 7. Construir el contenedor

Ahora construiremos la imagen.

```bash
docker compose build
```

---

## Imagen sugerida

```
/images/nginx/docker-build.png
```

---

# 8. Levantar el servidor

Para iniciar el contenedor:

```bash
docker compose up -d
```

Esto ejecutará el servidor en segundo plano.

---

## Imagen sugerida

```
/images/nginx/docker-up.png
```

---

# 9. Verificar que el contenedor está activo

Puedes verificar los contenedores activos con:

```bash
docker ps
```

Deberías ver algo como:

```
nginx-server
```

---

## Imagen sugerida

```
/images/nginx/docker-ps.png
```

---

# 10. Acceder al servidor web

Abre tu navegador y entra a:

```
http://localhost:8080
```

Si todo está correcto verás la página HTML creada anteriormente.

---

## Imagen sugerida

```
/images/nginx/browser-result.png
```

---

# 11. Detener el servidor

Para detener el contenedor:

```bash
docker compose down
```

Esto apagará y eliminará el contenedor.

---

# Conclusión

Usar **Nginx con Docker** permite desplegar sitios web de forma rápida y reproducible.

Entre sus ventajas están:

- Fácil despliegue
- Entornos consistentes
- Aislamiento de servicios
- Escalabilidad

Este método es muy usado en **entornos de desarrollo, pruebas y producción**.

---

# Recursos adicionales

Documentación oficial:

- https://docs.docker.com
- https://hub.docker.com/_/nginx
- https://nginx.org/en/docs/
