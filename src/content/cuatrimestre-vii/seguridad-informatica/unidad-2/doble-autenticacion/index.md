---
title: "Configurar SSH con doble autenticación (2FA) Google Authenticator en Linux"
description: "Manual paso a paso para configurar acceso SSH seguro con doble autenticación (contraseña + código TOTP) en un usuario específico, manteniendo otro usuario con acceso por llave privada. Incluye configuración de PAM, SSH y buenas prácticas de seguridad."
date: 2026-03-18
draft: false
order: 2
tags: ["SSH", "Seguridad", "2FA", "Linux", "DevOps", "Autenticación"]
---

# 🔐 Introducción

Este manual describe cómo configurar un servidor Linux para permitir:

- Un usuario con acceso mediante **llave SSH**
- Otro usuario con **doble autenticación (2FA)** usando códigos temporales (TOTP)

El objetivo es mejorar la seguridad del servidor sin perder acceso administrativo.

---

# 🧱 Arquitectura final

Se configurará lo siguiente:

- **Usuario 1 (admin)**
  - Acceso: llave privada (SSH key)

- **Usuario 2 (`devas`)**
  - Acceso: contraseña + código temporal (2FA)

---

# ⚙️ Paso 1: Crear usuario para 2FA

```bash
sudo adduser tuusuario
```

![Creando Usuario](/images/seguridad-informatica/2FA/creating-user.jpeg)

---

# ⚙️ Paso 2: Instalar módulo de autenticación

```bash
sudo apt update
sudo apt install libpam-google-authenticator
```

![instalando librerias de autenticacion ](/images/seguridad-informatica/2FA/install-dep.jpeg)

---

# ⚙️ Paso 3: Configurar 2FA en el usuario

Cambiar al usuario:

```bash
su - devas
```

Ejecutar:

```bash
google-authenticator
```

Respuestas recomendadas:

- Tokens basados en tiempo → `y`
- Actualizar archivo → `y`
- Evitar reutilización → `y`
- Permitir desfase → `y`
- Limitar intentos → `y`

---

## 🔑 Resultado esperado

Se generará:

- Código QR
- Clave secreta
- Códigos de emergencia

⚠️ Guardar los códigos de emergencia en un lugar seguro.

![Ejecutando Google Auth](/images/seguridad-informatica/2FA/config-google.jpeg)

# 📱 Configuración en el teléfono

Usar una app de autenticación:

- Escanear el QR generado
- Verificar el código ingresándolo en la terminal

---

# ⚙️ Paso 4: Configurar PAM

Editar:

```bash
sudo nano /etc/pam.d/sshd
```

Agregar al final:

```bash
auth required pam_google_authenticator.so
```

---

# ⚙️ Paso 5: Configurar SSH

Editar:

```bash
sudo nano /etc/ssh/sshd_config
```

Asegurar que existan estas líneas:

```bash
UsePAM yes
ChallengeResponseAuthentication yes
KbdInteractiveAuthentication yes
```

![Mostrando config ssh](/images/seguridad-informatica/2FA/config-ssh.jpeg)

---

# ⚙️ Paso 6: Aplicar 2FA solo a un usuario

Agregar al final del archivo:

```bash
Match User devas
    AuthenticationMethods password,keyboard-interactive
```

![Mostrando config ssh2](/images/seguridad-informatica/2FA/config-ssh2.jpeg)

---

## 🔒 Explicación

Esto obliga a que el usuario `devas` use:

1. Contraseña
2. Código de verificación (TOTP)

---

# 🔄 Paso 7: Reiniciar servicio SSH

```bash
sudo systemctl restart ssh
```

---

# 🧪 Paso 8: Prueba de acceso

Desde otra terminal:

```bash
ssh -p 2805 devas@IP_DEL_SERVIDOR
```

Se solicitará:

```text
Password:
Verification code:
```

![Mostrando config ssh2](/images/seguridad-informatica/2FA/verify.jpeg)

---

# 🚨 Problemas comunes

## Error: `no authentication methods enabled`

Causa:

- Configuración incorrecta de métodos de autenticación

Solución:

- Verificar:

  ```bash
  KbdInteractiveAuthentication yes
  ```

- Revisar PAM y reiniciar SSH

---

# 🧠 Buenas prácticas

- Mantener una sesión abierta al configurar SSH
- No desactivar accesos existentes sin probar
- Guardar códigos de emergencia
- Usar usuarios separados por nivel de acceso

---

# 🚀 Seguridad avanzada (opcional)

Para un entorno más profesional:

- Desactivar login por contraseña global
- Permitir solo:
  - Admin → SSH key
  - Usuario 2FA → password + TOTP

- Implementar fail2ban
- Restringir acceso por IP

---

# ✅ Conclusión

Con esta configuración:

- Se mejora significativamente la seguridad del servidor
- Se separan roles de acceso
- Se reduce el riesgo de ataques automatizados

Este enfoque es estándar en entornos productivos y escalable a múltiples usuarios.

---
