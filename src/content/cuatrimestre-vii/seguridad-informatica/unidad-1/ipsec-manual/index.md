---
title: "Manual de instalación y configuración de IPsec (strongSwan)"
description: "Guía práctica para instalar strongSwan y establecer una comunicación segura (IPsec) entre dos equipos en la misma red, comprobada con ping."
date: 2026-03-09
draft: false
tags: ["linux", "ipsec", "strongswan", "seguridad", "vpn"]
order: 3
---

# IPsec con strongSwan: instalación y prueba de conectividad (ping)

IPsec permite crear túneles seguros entre equipos. En este laboratorio usaremos **strongSwan** para configurar una conexión host‑to‑host entre dos máquinas Linux con direcciones IP diferentes en la misma red y verificaremos conectividad con `ping`.

---

# 1. Resumen del laboratorio

- Objetivo: instalar strongSwan en ambos equipos y crear una conexión IPsec (IKEv2, PSK) entre:
  - Equipo A: `192.168.1.10`
  - Equipo B: `192.168.1.20`
- Verificación: `ipsec statusall` y `ping 192.168.1.20` desde A (y viceversa).

---

# 2. Requisitos

- Dos máquinas Linux (Ubuntu/Debian recomendados) en la misma red local.
- Acceso root o privilegios sudo en ambas máquinas.
- Puertos UDP 500 y 4500 abiertos entre los equipos (firewall/ufw).
- Imágenes de evidencias opcionales en `/images/seguridad-informatica/ipsec-manual/`.

---

# 3. Instalación (ambas máquinas)

```bash
sudo apt update
sudo apt install -y strongswan strongswan-pki
```

Verificar el servicio:

```bash
sudo systemctl status strongswan
```

---

![Instalación strongSwan](/images/seguridad-informatica/ipsec-manual/01-instalacion.png)

---

# 4. Ajustes del sistema

Habilitar forwarding IPv4 (si fuera necesario para rutas):

```bash
sudo sysctl -w net.ipv4.ip_forward=1
# Para permanencia:
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
```

Si existen problemas con rp_filter (en algunas topologías):

```bash
sudo sysctl -w net.ipv4.conf.all.rp_filter=0
sudo sysctl -w net.ipv4.conf.default.rp_filter=0
```

---

# 5. Configuración de strongSwan

A continuación ejemplos para ambos equipos. Usamos PSK para simplicidad.

En `/etc/ipsec.conf` (ambos equipos, con valores adecuados):

Equipo A (`/etc/ipsec.conf`):

```conf
config setup
    charondebug="ike 1, knl 1, cfg 0"

conn host-to-host
    keyexchange=ikev2
    ike=aes256-sha256-modp1024
    esp=aes256-sha256
    left=192.168.1.10
    leftid=192.168.1.10
    leftsubnet=192.168.1.10/32
    right=192.168.1.20
    rightid=192.168.1.20
    rightsubnet=192.168.1.20/32
    authby=psk
    auto=add
```

Equipo B (`/etc/ipsec.conf`): (mismos parámetros pero intercambiando left/right)

```conf
config setup
    charondebug="ike 1, knl 1, cfg 0"

conn host-to-host
    keyexchange=ikev2
    ike=aes256-sha256-modp1024
    esp=aes256-sha256
    left=192.168.1.20
    leftid=192.168.1.20
    leftsubnet=192.168.1.20/32
    right=192.168.1.10
    rightid=192.168.1.10
    rightsubnet=192.168.1.10/32
    authby=psk
    auto=add
```

---

# 6. Secreto pre‑compartido (PSK)

Editar `/etc/ipsec.secrets` en ambos equipos y añadir la misma PSK:

```text
# /etc/ipsec.secrets
192.168.1.10 192.168.1.20 : PSK "MiPSKsegura_ChangeMe"
```

Guarda y protege el archivo:

```bash
sudo chmod 600 /etc/ipsec.secrets
```

---

# 7. Reiniciar y activar la conexión

Reinicia strongSwan y activa la conexión:

```bash
sudo systemctl restart strongswan
# Comprueba estado
sudo ipsec statusall
# Forzar subida de la conn (desde A o B)
sudo ipsec up host-to-host
```

## Captura de estado:

![Estado IPsec](/images/seguridad-informatica/ipsec-manual/02-estado.png)

---

# 8. Comprobación con ping

Una vez la conexión esté establecida, prueba ping entre equipos:

Desde A:

```bash
ping -c 4 192.168.1.20
```

Desde B:

```bash
ping -c 4 192.168.1.10
```

Si el túnel funciona verás respuestas ICMP. Si falla, revisa:

- `sudo ipsec statusall`
- `sudo journalctl -u strongswan --no-pager | tail -n 200`
- Firewall (ufw/iptables) permitiendo UDP 500 y 4500

---

# 9. Firewall (UFW) — ejemplo en Ubuntu

Permitir IKE/NAT-T:

```bash
sudo ufw allow 500/udp
sudo ufw allow 4500/udp
# Si usas SSH, conserva el puerto:
sudo ufw allow ssh
sudo ufw enable
sudo ufw status
```

---

# 10. Solución de problemas comunes

- PSK no coincide: revisar `/etc/ipsec.secrets` en ambos lados.
- Rutas y subredes: asegurar que `leftsubnet`/`rightsubnet` estén correctamente definidas.
- Conexión no inicia: comprobar logs con `journalctl` y `ipsec statusall`.
- Conflictos si ambos hosts están en la misma subred física: en algunos entornos puede requerirse configuración adicional (VTI o políticas de kernel); para pruebas con /32 suele funcionar.

---

# 11. Evidencias sugeridas

- Captura de instalación y versión de strongSwan (`strongswan --version`)  
  Placeholder: `/images/seguridad-informatica/ipsec-manual/01-instalacion.png`
- Salida de `ipsec statusall` con la conexión establecida  
  Placeholder: `/images/seguridad-informatica/ipsec-manual/02-estado.png`
- Captura del ping exitoso  
  Placeholder: `/images/seguridad-informatica/ipsec-manual/03-ping.png`

---

# Conclusión

Este manual ofrece una configuración mínima y reproducible para validar IPsec host‑to‑host con strongSwan y PSK. Para entornos de producción se recomienda usar certificados (PKI), políticas de cifrado actualizadas y análisis de seguridad más profundo.

---

# Recursos

- strongSwan official: https://www.strongswan.org/
- strongSwan docs — configuration: https://wiki.strongswan.org/projects/strongswan/wiki/IpsecConf
