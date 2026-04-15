---
title: "VPN + Proxy + Base de Datos Segura en Ubuntu"
description: "Guía paso a paso para configurar una VPN, un proxy y una base de datos segura en Ubuntu."
date: 2024-06-01
draft: false
tags: ["vpn", "proxy", "base de datos", "seguridad", "ubuntu"]
order: 3
---

# Manual Completo: VPN + Proxy + Base de Datos Segura en Ubuntu

## Objetivo

Este manual te enseña a: - Crear una VPN (WireGuard) - Configurar un
Proxy (Nginx) - Levantar una Base de Datos accesible solo localmente -
Acceder a la BD únicamente mediante VPN

---

## Requisitos

- Ubuntu 22.04+
- Usuario con sudo
- IP pública o dominio

---

## 1. Actualizar el sistema

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 2. Instalar WireGuard (VPN)

```bash
sudo apt install wireguard -y
```

### Generar claves

```bash
wg genkey | tee privatekey | wg pubkey > publickey
```

---

## 3. Configurar servidor VPN

Archivo:

```bash
sudo nano /etc/wireguard/wg0.conf
```

Contenido:

```ini
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = TU_PRIVATE_KEY

PostUp = iptables -A FORWARD -i wg0 -j ACCEPT
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT
```

Activar:

```bash
sudo wg-quick up wg0
sudo systemctl enable wg-quick@wg0
```

---

## 4. Configurar cliente VPN

```ini
[Interface]
PrivateKey = CLIENT_PRIVATE_KEY
Address = 10.0.0.2/24

[Peer]
PublicKey = SERVER_PUBLIC_KEY
Endpoint = TU_IP:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

---

## 5. Instalar Base de Datos (PostgreSQL)

```bash
sudo apt install postgresql -y
```

Configurar para solo localhost:

Editar:

```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
```

Cambiar:

```ini
listen_addresses = 'localhost'
```

Editar:

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Asegurar:

    host all all 127.0.0.1/32 md5

Reiniciar:

```bash
sudo systemctl restart postgresql
```

---

## 6. Instalar Nginx como Proxy

```bash
sudo apt install nginx -y
```

Configurar:

```bash
sudo nano /etc/nginx/sites-available/proxy
```

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

Activar:

```bash
sudo ln -s /etc/nginx/sites-available/proxy /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 7. Acceso a la Base de Datos vía VPN

Solo usuarios conectados a la VPN podrán acceder usando:

```bash
psql -h 10.0.0.1 -U usuario -d basedatos
```

---

## 8. Seguridad adicional

- Firewall:

```bash
sudo ufw allow 51820/udp
sudo ufw enable
```

- Bloquear acceso externo a PostgreSQL:

```bash
sudo ufw deny 5432
```

---

## 9. Pruebas

- Sin VPN → NO acceso
- Con VPN → acceso correcto

---

## Conclusión

Con esta arquitectura: - BD protegida (localhost) - Acceso seguro
mediante VPN - Proxy para servicios web

---

## Siguientes mejoras

- HTTPS con Certbot
- Autenticación avanzada VPN
- Dockerización
