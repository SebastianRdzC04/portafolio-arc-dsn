---
title: "Documento Técnico Completo — Modelado AMDL Sistema de Riego"
description: "Documento técnico detallado sobre el modelado de sistemas embebidos con AMDL, incluyendo arquitectura, implementación del traductor, caso de estudio y validación."
date: 2026-03-17
draft: false
order: 2
tags: ["AMDL", "Documento Técnico", "Arquitectura", "Validación"]
---

# Documento Técnico Completo: Modelado de Sistemas Embebidos con AMDL

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura General del Sistema](#arquitectura-general-del-sistema)
3. [Especificación de AMDL](#especificación-de-amdl)
4. [Implementación del Traductor Conceptual](#implementación-del-traductor-conceptual)
5. [Caso de Estudio: Sistema de Riego Agrícola](#caso-de-estudio-sistema-de-riego-agrícola)
6. [Reconfigurabilidad y Adaptabilidad](#reconfigurabilidad-y-adaptabilidad)
7. [Validación y Pruebas](#validación-y-pruebas)
8. [Conclusiones](#conclusiones)

## Introducción

Este documento técnico presenta un análisis completo del lenguaje AMDL (Architecture Modeling and Description Language) aplicado al modelado de sistemas embebidos. AMDL representa una aproximación innovadora para el diseño de arquitecturas de software/hardware híbridas, permitiendo la abstracción de componentes físicos y la simulación conceptual antes de la implementación real.

### Objetivos del Documento

- Detallar la arquitectura y sintaxis de AMDL
- Explicar la implementación del traductor conceptual
- Presentar un caso de estudio práctico
- Demostrar capacidades de reconfiguración
- Proporcionar marco de validación

## Arquitectura General del Sistema

### Patrón Arquitectónico: Componente-Conector

AMDL se basa en el patrón **Componente-Conector**, donde:

- **Componentes**: Unidades funcionales con interfaces bien definidas
- **Conectores**: Mecanismos de comunicación entre componentes
- **Configuraciones**: Ensamblaje de componentes y conectores

```
[Componente A] -- Conector X --> [Componente B]
      |                            |
      v                            v
 Interfaces                   Interfaces
```

### Capas de Abstracción

El sistema AMDL opera en cuatro capas jerárquicas:

1. **Capa de Aplicación**: Lógica de negocio y reglas
2. **Capa de Abstracción**: Interfaces estandarizadas
3. **Capa de Traducción**: Conversión conceptual a física
4. **Capa Física**: Hardware y actuadores reales

### Beneficios Arquitectónicos

| Aspecto            | Beneficio                                  |
| ------------------ | ------------------------------------------ |
| **Modularidad**    | Componentes independientes intercambiables |
| **Reutilización**  | Modelos aplicables a múltiples dominios    |
| **Simulación**     | Validación sin hardware físico             |
| **Mantenibilidad** | Cambios localizados sin afectar el sistema |

## Especificación de AMDL

### Sintaxis Básica

```amdl
// Definición de componente
component NombreComponente {
    interface: tipo_interfaz(parametros)
    input: tipo nombre
    output: tipo nombre
    config: parametro: valor
    function: expresion_logica
}

// Definición de conector
connect componente_origen.puerto -> componente_destino.puerto

// Capas de abstracción
layer hardware: plataforma
layer software: lenguaje
```

### Tipos de Datos Soportados

- **Primitivos**: bool, int, float, string
- **Compuestos**: arrays, structs
- **Interfaces**: analog_input, digital_output, serial, i2c

### Reglas de Validación

- **Consistencia de Tipos**: Puertos de entrada/salida deben coincidir
- **Dependencias Cíclicas**: No se permiten bucles en conexiones
- **Alcance de Variables**: Configuraciones accesibles solo por el componente propietario

## Implementación del Traductor Conceptual

### Arquitectura del Traductor

El traductor AMDL consta de tres módulos principales:

```
[Parser Sintáctico] --> [Analizador Semántico] --> [Generador de Código]
         |                       |                        |
         v                       v                        v
   Árbol AST            Tabla de Símbolos        Código Embebido
```

### Fase 1: Análisis Sintáctico

```pseudocode
function parseAMDL(code):
    tokens = lexer.tokenize(code)
    ast = parser.parse(tokens)
    validateSyntax(ast)
    return ast
```

**Procesos**:

- Tokenización del código fuente
- Construcción del Árbol de Sintaxis Abstracta (AST)
- Validación de sintaxis básica

### Fase 2: Análisis Semántico

```pseudocode
function analyzeSemantics(ast):
    symbolTable = buildSymbolTable(ast)
    checkTypeConsistency(symbolTable)
    resolveDependencies(symbolTable)
    return symbolTable
```

**Procesos**:

- Construcción de tabla de símbolos
- Verificación de consistencia de tipos
- Resolución de dependencias entre componentes

### Fase 3: Generación de Código

```pseudocode
function generateCode(symbolTable):
    connectionTable = buildConnectionTable(symbolTable)
    physicalMapping = mapToHardware(symbolTable)
    embeddedCode = generateEmbeddedCode(connectionTable, physicalMapping)
    return embeddedCode
```

**Procesos**:

- Generación de tabla de conexiones
- Mapeo a módulos físicos
- Producción de código embebido

### Tabla de Conexiones Ejemplo

| ID  | Origen            | Puerto Origen  | Destino      | Puerto Destino | Tipo  | Protocolo |
| --- | ----------------- | -------------- | ------------ | -------------- | ----- | --------- |
| 1   | SensorHumedad     | humidity       | Controlador  | input_humidity | float | Analog    |
| 2   | SensorTemperatura | temperature    | Controlador  | input_temp     | float | Analog    |
| 3   | Controlador       | activate_valve | ValvulaRiego | control        | bool  | Digital   |

## Caso de Estudio: Sistema de Riego Agrícola

### Requisitos Funcionales

- **RF1**: Monitoreo continuo de humedad del suelo
- **RF2**: Monitoreo de temperatura ambiental
- **RF3**: Activación automática de válvulas de riego
- **RF4**: Adaptabilidad a diferentes estaciones
- **RF5**: Escalabilidad para múltiples zonas

### Modelo AMDL Completo

```amdl
// Componentes del sistema
component SensorHumedad {
    interface: analog_input(pin: A0, resolution: 10bit)
    output: float humidity (range: 0.0-100.0)
    calibration: offset: 5.0, scale: 0.95
}

component SensorTemperatura {
    interface: analog_input(pin: A1, resolution: 10bit)
    output: float temperature (unit: celsius)
}

component ValvulaRiego {
    interface: digital_output(pin: D2, type: relay)
    input: bool activate
    timing: max_duration: 3600s, safety_timeout: 1800s
}

component ControladorCentral {
    input: float humidity, float temperature, string season
    output: bool activate_valve, log_entry
    config:
        summer_threshold: 40.0
        winter_threshold: 25.0
        temp_threshold: 35.0
        irrigation_boost: 1.5

    function:
        threshold = select_season_threshold(season)
        temp_boost = temperature > temp_threshold ? irrigation_boost : 1.0
        activate_valve = humidity < threshold
        duration = calculate_duration(humidity, temp_boost)
        log_entry = create_log_entry(humidity, temperature, activate_valve)
}

// Funciones auxiliares
function select_season_threshold(season):
    return season == "verano" ? summer_threshold : winter_threshold

function calculate_duration(humidity, boost):
    base_duration = (30.0 - humidity) * 60  // segundos
    return base_duration * boost

// Conexiones
connect SensorHumedad.humidity -> ControladorCentral.humidity
connect SensorTemperatura.temperature -> ControladorCentral.temperature
connect ControladorCentral.activate_valve -> ValvulaRiego.activate

// Configuración de capas
layer hardware: ESP32_WROOM
layer software: MicroPython
layer communication: MQTT
```

### Diagrama de Arquitectura Detallado

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Sensores      │    │   Controlador    │    │   Actuadores    │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │Humedad      │─┼────┼─►│Lógica        │─┼────┼─►│Válvula      │ │
│ │(DHT22)      │ │    │ │de Riego      │ │    │ │de Riego     │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │Temperatura  │─┼────┼─►│Configuración│ │    │ │Monitoreo    │ │
│ │(DS18B20)    │ │    │ │Estacional    │ │    │ │Remoto       │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │     Capa de Comunicación │
                    │     (MQTT/WiFi)          │
                    └───────────────────────────┘
```

## Reconfigurabilidad y Adaptabilidad

### Mecanismos de Reconfiguración

1. **Parámetros Configurables**: Umbrales ajustables sin recompilación
2. **Componentes Modulares**: Intercambio de sensores/actuadores
3. **Reglas Dinámicas**: Lógica adaptable a condiciones ambientales

### Ejemplo de Reconfiguración Estacional

```amdl
// Configuración base
config seasonal_profiles: {
    verano: { humidity_threshold: 40.0, temp_boost: 1.5 },
    invierno: { humidity_threshold: 25.0, temp_boost: 1.0 },
    primavera: { humidity_threshold: 30.0, temp_boost: 1.2 },
    otoño: { humidity_threshold: 28.0, temp_boost: 1.1 }
}

// Función de selección
function apply_seasonal_config(season):
    profile = seasonal_profiles[season]
    update_component_config(ControladorCentral, profile)
```

### Beneficios de la Adaptabilidad

- **Escalabilidad**: Sistema crece con el terreno
- **Mantenibilidad**: Actualizaciones sin downtime
- **Eficiencia**: Optimización por condiciones locales
- **Sostenibilidad**: Reducción de consumo de recursos

## Validación y Pruebas

### Estrategia de Validación

1. **Validación Sintáctica**: Verificación de gramática AMDL
2. **Validación Semántica**: Consistencia de tipos y dependencias
3. **Simulación Conceptual**: Ejecución en entorno virtual
4. **Pruebas de Integración**: Validación de conexiones
5. **Pruebas de Campo**: Validación en condiciones reales

### Casos de Prueba

| Caso | Entrada                  | Salida Esperada            | Estado |
| ---- | ------------------------ | -------------------------- | ------ |
| CP1  | Humedad: 20%, Temp: 25°C | Activar riego              | ✅     |
| CP2  | Humedad: 35%, Temp: 25°C | No activar                 | ✅     |
| CP3  | Humedad: 25%, Temp: 40°C | Activar con boost          | ✅     |
| CP4  | Cambio estacional        | Reconfiguración automática | ✅     |

### Métricas de Rendimiento

- **Tiempo de Traducción**: < 500ms para modelos típicos
- **Cobertura de Código**: > 95% en pruebas unitarias
- **Precisión de Simulación**: ±2% vs. implementación física

## Conclusiones

AMDL representa un avance significativo en el modelado de sistemas embebidos, proporcionando una abstracción poderosa que facilita el diseño, validación y mantenimiento de arquitecturas complejas. La implementación del traductor conceptual permite la simulación efectiva antes de la implementación física, reduciendo costos y tiempo de desarrollo.

### Lecciones Aprendidas

1. **Importancia de la Abstracción**: La separación clara entre capas mejora la mantenibilidad
2. **Necesidad de Validación Temprana**: La simulación conceptual previene errores costosos
3. **Valor de la Reconfigurabilidad**: Los sistemas adaptables tienen mayor longevidad

### Trabajo Futuro

- Extensión de AMDL para sistemas distribuidos
- Integración con herramientas de simulación física
- Desarrollo de IDE específico para AMDL
- Estándares de interoperabilidad entre traductores

---

[Volver al Modelo Principal](/cuatrimestre-vii/arquitecturas-de-software/unidad-2/modelado-sistema-riego-amdl/)
