---
title: "Modelado de Sistema de Riego Agrícola con AMDL"
description: "Aplicación de AMDL para modelar un sistema embebido de riego agrícola, incluyendo abstracción de hardware, componentes, conectores, funciones y traductor conceptual con adaptabilidad reconfigurable."
date: 2026-03-17
draft: false
order: 2
tags: ["AMDL", "Arquitectura Embebida", "Modelado", "Reconfigurabilidad"]
---

## Introducción a AMDL

AMDL (Architecture Modeling and Description Language) es un lenguaje específico para modelar arquitecturas de sistemas embebidos. Permite:

- **Abstracción de hardware**: Separar lógica de implementación física
- **Modelado de componentes y conectores**: Definir elementos y sus interacciones
- **Definición de funciones**: Especificar reglas y comportamientos
- **Simulación mediante traductor conceptual**: Análisis sintáctico y traducción a módulos físicos
- **Adaptabilidad**: Reconfiguración sin reprogramación hardware

## Caso de Estudio: Sistema de Riego Agrícola

### Requisitos Iniciales

- Leer sensores de humedad del suelo
- Leer sensores de temperatura
- Activar válvulas de riego
- Reglas: Si humedad < 30% → Activar riego; Si temperatura > 35°C → Aumentar tiempo; Si humedad > 30% → No activar
- Adaptable a diferentes tamaños de terreno

### Modelo AMDL Inicial

```
// Definición de componentes
component SensorHumedad {
    interface: analog_input(pin: A0)
    output: float humidity
}

component SensorTemperatura {
    interface: analog_input(pin: A1)
    output: float temperature
}

component ValvulaRiego {
    interface: digital_output(pin: D2)
    input: bool activate
}

component Controlador {
    input: float humidity, float temperature
    output: bool activate_valve
    function:
        if humidity < 30.0 then activate_valve = true
        if temperature > 35.0 then activate_valve = true and increase_time(50%)
        if humidity > 30.0 then activate_valve = false
}

// Conectores
connect SensorHumedad.output -> Controlador.humidity
connect SensorTemperatura.output -> Controlador.temperature
connect Controlador.activate_valve -> ValvulaRiego.activate

// Abstracción de hardware
layer hardware: ArduinoUno
layer software: EmbeddedC
```

## Diagrama Arquitectónico

```
[Sensores] --> [Controlador]
    |             |
    v             v
[Humedad]     [Valvula Riego]
[Temperatura]     |
                  v
              [Terreno Agrícola]
```

_Diagrama conceptual del sistema de riego. Los sensores alimentan datos al controlador, que decide la activación de válvulas basándose en reglas configurables._

## Explicación del Traductor Conceptual

El traductor AMDL analiza el modelo y genera:

### 1. Análisis Sintáctico

- **Parsing**: Identifica componentes, conectores y funciones
- **Validación**: Verifica consistencia de interfaces (e.g., tipos de datos)
- **Dependencias**: Resuelve conexiones entre componentes

### 2. Generación de Tabla de Conexiones

| Componente Origen | Puerto Salida  | Componente Destino | Puerto Entrada | Tipo  |
| ----------------- | -------------- | ------------------ | -------------- | ----- |
| SensorHumedad     | humidity       | Controlador        | humidity       | float |
| SensorTemperatura | temperature    | Controlador        | temperature    | float |
| Controlador       | activate_valve | ValvulaRiego       | activate       | bool  |

### 3. Traducción a Módulos Físicos

- **SensorHumedad** → Módulo DHT22 (pin A0)
- **SensorTemperatura** → Módulo DS18B20 (pin A1)
- **ValvulaRiego** → Relé 5V (pin D2)
- **Controlador** → Microcontrolador ESP32 con firmware generado

El traductor genera código embebido automáticamente, abstrayendo detalles hardware.

## Versión Reconfigurada: Adaptabilidad por Estación

### Cambio Solicitado

- **Verano**: Límite humedad 40%
- **Invierno**: Límite humedad 25%

### Modelo AMDL Reconfigurado

```
component Controlador {
    input: float humidity, float temperature, string season
    output: bool activate_valve
    config:
        summer_threshold: 40.0
        winter_threshold: 25.0
    function:
        threshold = if season == "verano" then summer_threshold else winter_threshold
        if humidity < threshold then activate_valve = true
        if temperature > 35.0 then activate_valve = true and increase_time(50%)
        if humidity >= threshold then activate_valve = false
}
```

_La reconfiguración se realiza cambiando parámetros sin modificar hardware o lógica base._

## Documento Técnico

### Resumen Ejecutivo

El sistema modelado con AMDL sigue una arquitectura **Componente-Conector** con cuatro capas de abstracción que permiten la separación clara entre hardware y lógica de aplicación. Los componentes modulares facilitan la reutilización y mantenibilidad, mientras que el traductor conceptual habilita la simulación antes de la implementación física.

> 📄 Para el documento técnico completo con detalles de arquitectura, implementación del traductor, casos de estudio detallados y métricas de validación, consulte: **[Documento Técnico Completo](./documento-tecnico)**

Este modelado demuestra cómo AMDL facilita el diseño de sistemas embebidos complejos con requisitos cambiantes, manteniendo separación clara entre hardware y lógica.
