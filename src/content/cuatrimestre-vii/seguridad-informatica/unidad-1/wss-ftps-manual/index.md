---
title: "Manual de uso e instalacion de WSS & FTPS"
description: "Guia de instalacion de un servidor wss y transferencia de archivos medianta ftps"
date: 2026-03-09
draft: false
tags: ["linux", "wss", "servidores", "seguridad", "devops", "FTPS"]
order: 4
---

# Manual de Implementación de Servicios FTPS, SCP y WSS con Docker

---

# 1. Introducción

En este laboratorio se implementa un entorno de **transferencia segura de archivos y monitoreo en tiempo real** utilizando contenedores Docker.

El entorno incluye los siguientes servicios:

| Servicio | Protocolo        | Función                              |
| -------- | ---------------- | ------------------------------------ |
| FTPS     | FTP + TLS        | Transferencia segura de archivos     |
| SCP      | SSH              | Transferencia segura mediante claves |
| WSS      | WebSocket Secure | Monitoreo de archivos en tiempo real |
| Nginx    | HTTP             | Interfaz web cliente                 |

Toda la infraestructura se levanta utilizando **Docker Compose**, lo que permite iniciar todos los servicios con un solo comando.

---

# 2. Requisitos

Antes de comenzar es necesario tener instalado:

- Docker
- Docker Compose
- OpenSSL
- Cliente SSH

Verificar instalación:

```bash
docker --version
docker compose version
```

### Evidencia

---

# 3. Estructura del proyecto

Crear la siguiente estructura de carpetas:

```
lab-transfer/
│
├── docker-compose.yml
│
├── certs/
│   ├── server.crt
│   └── server.key
│
├── config/
│   └── server.js
│
├── keys/
│   └── authorized_keys
│
├── uploads/
│   ├── ftps/
│   └── scp/
│
└── index.html
```

### Evidencia

---

# 4. Archivo docker-compose.yml

Crear el archivo `docker-compose.yml` con el siguiente contenido.

```yaml
version: "3.8"

services:
  ftps-server:
    image: delfer/alpine-ftp-server
    container_name: lab_ftps
    ports:
      - "21:21"
      - "21100-21110:21100-21110"
    environment:
      - USERS=admin|Seguridad123!
      - MIN_PORT=21100
      - MAX_PORT=21110
      - TLS_CERT=/etc/ssl/private/server.crt
      - TLS_KEY=/etc/ssl/private/server.key
    volumes:
      - ./certs:/etc/ssl/private:ro
      - ./uploads/ftps:/ftp/admin
    restart: unless-stopped

  scp-server:
    image: linuxserver/openssh-server
    container_name: lab_scp
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Mexico_City
      - USER_NAME=admin
      - PUBLIC_KEY_DIR=/keys
      - PASSWORD_ACCESS=false
    ports:
      - "2222:2222"
    volumes:
      - ./keys:/keys:ro
      - ./uploads/scp:/config
    restart: unless-stopped

  wss-monitor:
    image: node:20
    container_name: lab_wss
    working_dir: /app
    ports:
      - "8443:8443"
    volumes:
      - ./config/server.js:/app/server.js
      - ./certs:/app/certs
      - ./uploads:/app/uploads
    command: sh -c "npm install ws chokidar && node server.js"
    restart: unless-stopped

  web-client:
    image: nginx:alpine
    container_name: lab_nginx
    ports:
      - "8080:80"
    volumes:
      - ./index.html:/usr/share/nginx/html/index.html
    restart: unless-stopped
```

### Evidencia

---

# 5. Generación de certificados TLS

Para habilitar **FTPS y WSS** se deben generar certificados TLS.

Crear la carpeta:

```bash
mkdir certs
```

Generar certificado autofirmado:

```bash
openssl req -x509 -nodes -days 365 \
-newkey rsa:2048 \
-keyout certs/server.key \
-out certs/server.crt
```

Esto generará los archivos:

```
certs/server.crt
certs/server.key
```

### Evidencia

---

# 6. Configuración de acceso SCP con SSH

Generar una clave SSH:

```bash
ssh-keygen -t rsa -b 4096
```

Copiar la clave pública generada al archivo:

```
keys/authorized_keys
```

Esto permitirá conectarse al servidor **SCP sin contraseña**.

### Evidencia

---

# 7. Servidor WebSocket (WSS)

Crear el archivo:

```
config/server.js
```

Código básico del servidor:

```javascript
const fs = require("fs");
const https = require("https");
const WebSocket = require("ws");
const chokidar = require("chokidar");

const server = https.createServer({
  cert: fs.readFileSync("./certs/server.crt"),
  key: fs.readFileSync("./certs/server.key"),
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Cliente conectado");
});

const watcher = chokidar.watch("./uploads");

watcher.on("add", (path) => {
  wss.clients.forEach((client) => {
    client.send("Nuevo archivo: " + path);
  });
});

server.listen(8443, () => {
  console.log("Servidor WSS activo");
});
```

Este servidor monitorea la carpeta **uploads** y envía notificaciones cuando se agrega un archivo.

### Evidencia

---

# 8. Levantar los servicios

Desde la carpeta del proyecto ejecutar:

```bash
docker compose up -d
```

Esto descargará las imágenes y levantará todos los contenedores.

Verificar contenedores activos:

```bash
docker ps
```

### Evidencia

---

# 9. Pruebas de funcionamiento

## Acceso FTPS

Configurar un cliente FTP:

```
Host: localhost
Usuario: admin
Contraseña: Seguridad123!
Puerto: 21
Modo: FTPS
```

---

## Acceso SCP

Transferir un archivo:

```bash
scp -P 2222 archivo.txt admin@localhost:/uploads
```

---

## Acceso Web

Abrir en navegador:

```
http://localhost:8080
```

---

## Conexión WebSocket

```
wss://localhost:8443
```

### Evidencia

---

# 10. Detener los servicios

Para apagar el entorno:

```bash
docker compose down
```

---

# Conclusión

En este laboratorio se implementó un entorno de servicios utilizando contenedores Docker que incluye:

- Transferencia segura mediante **FTPS**
- Transferencia de archivos con **SCP**
- Monitoreo de archivos mediante **WebSocket Secure**
- Interfaz web mediante **Nginx**

El uso de Docker permite desplegar y replicar fácilmente este tipo de entornos en diferentes sistemas.
