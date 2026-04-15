---
title: "Laboratorio Guiado: Mini Blockchain con Nodos Mineros en Ubuntu"
description: "Guía técnica paso a paso para implementar una blockchain básica con Python y Flask: nodo completo, nodos mineros y control de acceso por VPN en Ubuntu."
date: 2024-06-01
draft: false
tags:
  ["blockchain", "miner", "full node", "python", "flask", "vpn", "seguridad"]
order: 4
---

# Laboratorio: Mini Blockchain con nodos mineros

Este trabajo muestra cómo construir una blockchain didáctica, probar minería distribuida y aplicar controles de red básicos para reducir la superficie de ataque.

## Objetivo

Implementar un entorno funcional con:

- **1 Full Node**: almacena la cadena, valida bloques y expone API.
- **2 nodos mineros**: solicitan minado periódicamente al Full Node.
- **Conectividad controlada**: acceso por LAN o VPN, con reglas de firewall.

## Arquitectura del laboratorio

```text
                +------------------+
                |  Cliente / API   |
                |  GET /chain      |
                +---------+--------+
                          |
                          v
+-----------+    +------------------+    +-----------+
| Miner 1   +--->| Full Node (5000) |<---+ Miner 2   |
| GET /mine |    | Flask + Blockchain|   | GET /mine |
+-----------+    +------------------+    +-----------+
```

## Conceptos clave

| Componente | Función en el laboratorio                             |
| ---------- | ----------------------------------------------------- |
| Full Node  | Mantiene la blockchain y valida nuevos bloques        |
| Miner      | Ejecuta prueba de trabajo (PoW) y solicita minado     |
| Block      | Estructura con índice, timestamp, proof y hash previo |
| Chain      | Secuencia enlazada de bloques                         |
| Hash       | Huella criptográfica del contenido de un bloque       |

## Requisitos previos

- Ubuntu 22.04+ (servidor y mineros)
- Python 3 y pip
- Conectividad entre equipos (misma LAN o VPN)
- Permisos de `sudo`

---

## 1) Preparar el Full Node

### 1.1 Actualizar sistema e instalar dependencias

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv git
```

### 1.2 Crear proyecto

```bash
mkdir blockchain-lab
cd blockchain-lab
python3 -m venv .venv
source .venv/bin/activate
pip install flask
```

---

## 2) Implementar la lógica de blockchain

Crear `blockchain.py`:

```python
import hashlib
import json
from time import time


class Blockchain:
    def __init__(self):
        self.chain = []
        self.transactions = []
        self.create_block(proof=1, previous_hash="0")

    def create_block(self, proof, previous_hash):
        block = {
            "index": len(self.chain) + 1,
            "timestamp": time(),
            "proof": proof,
            "previous_hash": previous_hash,
            "transactions": list(self.transactions),
        }
        self.transactions = []
        self.chain.append(block)
        return block

    def get_previous_block(self):
        return self.chain[-1]

    def proof_of_work(self, previous_proof):
        new_proof = 1
        while True:
            operation = str(new_proof**2 - previous_proof**2).encode()
            hash_operation = hashlib.sha256(operation).hexdigest()
            if hash_operation[:4] == "0000":
                return new_proof
            new_proof += 1

    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()

    def add_transaction(self, sender, receiver, amount):
        self.transactions.append(
            {"sender": sender, "receiver": receiver, "amount": amount}
        )
        return self.get_previous_block()["index"] + 1
```

### ¿Qué hace este archivo?

- Crea un **bloque génesis** al iniciar.
- Mina nuevos bloques con una regla simple de PoW (`0000` al inicio del hash).
- Encadena bloques mediante `previous_hash`.
- Permite acumular transacciones antes de minar.

---

## 3) Exponer API con Flask

Crear `app.py`:

```python
from flask import Flask, jsonify, request

from blockchain import Blockchain


app = Flask(__name__)
blockchain = Blockchain()


@app.route("/mine", methods=["GET"])
def mine_block():
    previous_block = blockchain.get_previous_block()
    proof = blockchain.proof_of_work(previous_block["proof"])
    previous_hash = blockchain.hash(previous_block)
    block = blockchain.create_block(proof, previous_hash)

    response = {
        "message": "Bloque minado correctamente",
        "index": block["index"],
        "proof": block["proof"],
        "previous_hash": block["previous_hash"],
        "transactions": block["transactions"],
    }
    return jsonify(response), 200


@app.route("/transactions/new", methods=["POST"])
def add_transaction():
    json_data = request.get_json(silent=True) or {}
    required_keys = ["sender", "receiver", "amount"]

    if not all(key in json_data for key in required_keys):
        return jsonify({"error": "Faltan campos: sender, receiver, amount"}), 400

    block_index = blockchain.add_transaction(
        json_data["sender"],
        json_data["receiver"],
        json_data["amount"],
    )
    return jsonify({"message": f"Transacción agregada al bloque {block_index}"}), 201


@app.route("/chain", methods=["GET"])
def get_chain():
    return jsonify({"chain": blockchain.chain, "length": len(blockchain.chain)}), 200


@app.route("/health", methods=["GET"])
def healthcheck():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

### Ejecutar el Full Node

```bash
python3 app.py
```

Disponible en:

```text
http://TU_IP:5000
```

---

## 4) Configurar nodos mineros

En cada minero (otra VM, contenedor o equipo):

```bash
git clone TU_REPO_O_COPIA
cd blockchain-lab
python3 -m venv .venv
source .venv/bin/activate
pip install requests
```

Crear `miner.py`:

```python
import time

import requests


FULL_NODE = "http://IP_DEL_FULL_NODE:5000"


while True:
    try:
        response = requests.get(f"{FULL_NODE}/mine", timeout=10)
        data = response.json()
        print(
            f"[OK] Bloque #{data.get('index')} minado | proof={data.get('proof')}"
        )
    except requests.RequestException as error:
        print(f"[ERROR] No se pudo conectar al Full Node: {error}")

    time.sleep(5)
```

Ejecutar:

```bash
python3 miner.py
```

Repite el proceso en un segundo minero para simular concurrencia.

---

## 5) Probar y observar resultados

### Ver cadena completa

```bash
curl http://IP_DEL_FULL_NODE:5000/chain
```

### Insertar transacción de prueba

```bash
curl -X POST http://IP_DEL_FULL_NODE:5000/transactions/new \
  -H "Content-Type: application/json" \
  -d '{"sender":"alice","receiver":"bob","amount":10}'
```

### Minar manualmente un bloque

```bash
curl http://IP_DEL_FULL_NODE:5000/mine
```

---

## 6) Endurecimiento de red con VPN (recomendado)

Para un escenario más seguro:

- El Full Node escucha en una IP privada VPN (ej. `10.0.0.1`).
- Solo los mineros conectados a la VPN pueden alcanzar el puerto `5000`.

Reglas base con UFW:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 51820/udp
sudo ufw deny 5000/tcp
sudo ufw allow from 10.0.0.0/24 to any port 5000 proto tcp
sudo ufw enable
sudo ufw status
```

---

## 7) Criterios de validación

| Escenario                        | Resultado esperado                                        |
| -------------------------------- | --------------------------------------------------------- |
| Full Node encendido, sin mineros | La cadena crece solo con minado manual                    |
| Full Node + 2 mineros            | El campo `length` en `/chain` aumenta cada pocos segundos |
| Firewall + VPN activos           | Solo IPs de la VPN acceden al puerto `5000`               |

---

## 8) Problemas comunes y solución

- **Error `ModuleNotFoundError`**: instala dependencias dentro del entorno virtual.
- **`Connection refused` en mineros**: verifica IP, puerto y que `app.py` esté corriendo.
- **No crece la cadena**: confirma que los mineros lleguen a `/mine` sin timeout.
- **No responde desde otra red**: revisa reglas UFW y rutas de VPN.

---

## 9) Mejoras recomendadas (siguiente iteración)

1. Sustituir nodo central por red P2P real entre nodos.
2. Firmar transacciones con criptografía asimétrica.
3. Persistir la cadena en disco o base de datos.
4. Dockerizar cada nodo para despliegue reproducible.
5. Añadir consenso entre múltiples validadores.

## Conclusión

Con este laboratorio ya tienes una base sólida para entender cómo se construye una blockchain desde cero: estructura de bloques, prueba de trabajo, minería distribuida y controles de seguridad de red. A partir de aquí puedes evolucionar el proyecto hacia un sistema más realista y resistente.
