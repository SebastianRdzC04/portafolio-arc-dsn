---
title: "Manual de uso e instalacion de SSH"
description: "Guía paso a paso para instalar, configurar y asegurar SSH en Linux cambiando el puerto, deshabilitando root y aplicando medidas de seguridad."
date: 2026-03-07
draft: false
tags: ["linux", "ssh", "servidores", "seguridad", "devops"]
order: 1
---

---

# Instalar y asegurar SSH en Linux

SSH (Secure Shell) es uno de los servicios más importantes en cualquier servidor Linux, ya que permite **administrar el sistema de forma remota y segura**.

Sin embargo, una instalación por defecto puede ser vulnerable a **ataques de fuerza bruta o accesos no autorizados**, por lo que es recomendable aplicar algunas configuraciones de seguridad básicas.

En esta guía aprenderás a:

- Instalar SSH
- Configurarlo correctamente
- Cambiar el puerto por defecto
- Deshabilitar acceso root
- Limitar accesos
- Aplicar medidas básicas de seguridad

---

# 1. Instalación de SSH

La mayoría de las distribuciones Linux usan **OpenSSH** como servidor SSH.

## Instalar en Ubuntu / Debian

```bash
sudo apt update
sudo apt install openssh-server
```

## Verificar que el servicio esté activo

```bash
sudo systemctl status ssh
```

Si está funcionando verás algo similar a:

```
Active: active (running)
```

---

![Status SSH](/images/seguridad-informatica/status-ssh.png)

---

# 2. Verificar el puerto SSH

Por defecto SSH funciona en el **puerto 22**.

Puedes verificarlo con:

```bash
sudo ss -tulpn | grep ssh
```

O:

```bash
sudo netstat -tulpn | grep ssh
```

Esto mostrará el puerto donde está escuchando el servicio SSH.

---

![Puerto SSH](/images/seguridad-informatica/puerto-ssh.png)

---

# 3. Archivo de configuración SSH

La configuración principal de SSH se encuentra en:

```
/etc/ssh/sshd_config
```

Para editarlo:

```bash
sudo nano /etc/ssh/sshd_config
```

Cada cambio que hagamos aquí **requiere reiniciar el servicio SSH**.

---

![Configuracion SSH](/images/seguridad-informatica/config-ssh.png)

---

# 4. Cambiar el puerto SSH

Cambiar el puerto ayuda a **reducir ataques automatizados** que escanean el puerto 22.

Busca esta línea en el archivo:

```
#Port 22
```

Y cámbiala por ejemplo a:

```
Port 2805
```

Guarda los cambios y reinicia el servicio.

---

## Reiniciar el servicio

```bash
sudo systemctl restart ssh
```

Ahora para conectarte deberás usar:

```bash
ssh usuario@ip -p 2805
```

---

![Configuracion SSH](/images/seguridad-informatica/puerto-config-ssh.png)

---

# 5. Deshabilitar acceso root por SSH

Por seguridad **no es recomendable permitir acceso directo al usuario root**.

Busca esta línea:

```
PermitRootLogin yes
```

Cámbiala por:

```
PermitRootLogin no
```

Esto obliga a conectarse con un usuario normal y luego utilizar `sudo`.

---

# 6. Deshabilitar autenticación por contraseña (recomendado)

La forma más segura de usar SSH es mediante **llaves SSH**.

Busca esta línea:

```
PasswordAuthentication yes
```

Cámbiala por:

```
PasswordAuthentication no
```

⚠️ **Importante**

Haz esto **solo si ya configuraste tus llaves SSH**, o podrías perder acceso al servidor.

---

# 7. Limitar usuarios que pueden conectarse por SSH

Puedes permitir únicamente ciertos usuarios agregando al final del archivo:

```
AllowUsers usuario
```

Ejemplo:

```
AllowUsers sebastian admin
```

Esto evita que otros usuarios del sistema puedan intentar conectarse por SSH.

---

---

# 8. Configurar firewall

Si usas **UFW en Ubuntu**, primero permite el nuevo puerto SSH.

Ejemplo:

```bash
sudo ufw allow 2805/tcp
```

Después activa el firewall:

```bash
sudo ufw enable
```

Verifica el estado:

```bash
sudo ufw status
```

# 10. Verificar configuración SSH

Antes de reiniciar SSH puedes comprobar que la configuración no tenga errores:

```bash
sudo sshd -t
```

Si no muestra salida significa que la configuración es válida.

---

# 11. Reiniciar SSH

Después de modificar la configuración:

```bash
sudo systemctl restart ssh
```

---

# 12. Probar la conexión

Desde otra terminal o computadora:

```bash
ssh usuario@ip -p puerto
```

Ejemplo:

```bash
ssh sebastian@192.168.1.50 -p 2805
```

---

# Conclusión

Configurar correctamente SSH es una de las primeras medidas de seguridad que debes aplicar en cualquier servidor Linux.

Las prácticas más recomendadas incluyen:

- Cambiar el puerto por defecto
- Deshabilitar root por SSH
- Usar autenticación con llaves SSH
- Limitar usuarios permitidos
- Usar firewall
- Instalar Fail2Ban

Aplicando estas medidas puedes **reducir significativamente los intentos de acceso no autorizados a tu servidor**.

---

# Recursos adicionales

Documentación oficial:

- https://www.openssh.com/manual.html
- https://linux.die.net/man/5/sshd_config
