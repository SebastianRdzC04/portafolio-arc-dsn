---
title: "Patrones de Diseno de Software"
description: "Estudio de los principales patrones de diseno creacionales, estructurales y de comportamiento."
date: 2026-02-14
draft: false
order: 2
tags: ["patrones", "GoF", "diseno"]
---

## Introduccion

Los patrones de diseno son soluciones reutilizables a problemas comunes en el desarrollo de software. Fueron popularizados por el libro *"Design Patterns: Elements of Reusable Object-Oriented Software"* (1994), escrito por Gamma, Helm, Johnson y Vlissides, conocidos como la **Gang of Four (GoF)**.

## Clasificacion

Los patrones de diseno se clasifican en tres categorias principales:

### Patrones creacionales

Se encargan de los mecanismos de creacion de objetos.

- **Singleton**: Garantiza que una clase tenga una unica instancia
- **Factory Method**: Define una interfaz para crear objetos, delegando a las subclases
- **Builder**: Separa la construccion de un objeto complejo de su representacion

### Patrones estructurales

Se ocupan de la composicion de clases y objetos.

- **Adapter**: Permite que interfaces incompatibles trabajen juntas
- **Decorator**: Anade responsabilidades a un objeto de forma dinamica
- **Facade**: Proporciona una interfaz simplificada a un subsistema complejo

### Patrones de comportamiento

Se enfocan en la comunicacion entre objetos.

- **Observer**: Define una dependencia uno-a-muchos entre objetos
- **Strategy**: Permite seleccionar un algoritmo en tiempo de ejecucion
- **Command**: Encapsula una solicitud como un objeto

## Ejemplo: Patron Observer

```javascript
class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    const callbacks = this.listeners[event] || [];
    callbacks.forEach(cb => cb(data));
  }
}

// Uso
const emitter = new EventEmitter();
emitter.on('userLogin', (user) => {
  console.log(`Usuario conectado: ${user.name}`);
});
emitter.emit('userLogin', { name: 'Sebastian' });
```

## Cuando usar patrones

Es importante recordar que los patrones de diseno deben aplicarse cuando realmente resuelven un problema, no por el simple hecho de usarlos. El **sobrediseno** (over-engineering) puede ser tan perjudicial como la falta de estructura.

> "Cada patron describe un problema que ocurre una y otra vez en nuestro entorno, y describe la esencia de la solucion a ese problema." — Christopher Alexander
