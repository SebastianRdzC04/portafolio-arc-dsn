---
title: "Patrones de diseño GoF"
description: "Distintos patrones de diseño con sus caracteristicas y descripciones"
date: 2026-03-20
draft: false
order: 4
tags: ["Arquitectura", "Diseño", "Software", "Patrones", "DevOps"]
---

## 1) Contexto rapido del proyecto

- **Backend:** AdonisJS + TypeScript + Lucid (Postgres) + Mongoose (Mongo)
- **Dashboard:** Angular 20 + Signals + Tailwind
- **Frontend:** Next.js 16 + React 19 + Tailwind
- **Casos comunes:** inventario, formularios, paginacion, modales, autenticacion, auditoria

---

## 2) Criterio de evidencia usado en este documento

Para cumplir tu peticion de "si muestras codigo, di de donde es", cada patron incluye:

1. **Codigo existente (comprobable)** con ruta real del repo.
2. **Ejemplo aplicado (propuesta)** para implementar el patron de forma explicita en `elroble-system`.
3. **Como verificar** rapido.

> Nota: en varios patrones el proyecto actual tiene equivalentes parciales, pero no una implementacion "de libro" todavia. Eso se marca como **equivalente** o **propuesta**.

---

## 3) Patrones de comportamiento (10)

### 3.1 Chain of Responsibility

**Estado actual:** equivalente claro en pipeline de middleware de Adonis.

**Codigo existente (fuente verificable):** `backend/start/kernel.ts`

```ts
server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
  () => import('@adonisjs/static/static_middleware')
])
```

**Codigo existente relacionado:** `backend/app/middleware/role_middleware.ts`

```ts
const output = await next()
return output
```

**Ejemplo aplicado (propuesta para pedidos):**
- Carpeta sugerida: `backend/app/services/orders/pipeline/`
- Encadenar `StockHandler -> CreditHandler -> FraudHandler`

**Como verificar:**
- Revisar `backend/start/kernel.ts` y ver la cadena real de middlewares.
- Crear test unitario donde se omite `FraudHandler` y el flujo sigue funcionando.

---

### 3.2 Command

**Estado actual:** no hay comandos explicitos por clase; hay acciones encapsuladas en metodos de servicio/controlador.

**Codigo existente (fuente verificable):** `dashboard-lirio/src/app/features/inventory/pages/inventory/inventory.ts`

```ts
async confirmDelete(): Promise<void> {
  const item = this.itemToDelete()
  if (item) {
    await this.inventoryService.deleteByIdentifier(item.identifier)
  }
}
```

**Interpretacion:** este metodo actua como comando de UI (accion concreta + receptor `InventoryService`).

**Ejemplo aplicado (propuesta formal):**
- Carpeta sugerida: `backend/app/commands/inventory/`
- `Command` con `execute()` y `undo()`
- `AddStock`, `RemoveStock`, `InventoryInvoker` con historial

**Como verificar:**
- Unit test con dobles de repositorio: ejecutar y luego `undo()`.

---

### 3.3 Iterator

**Estado actual:** equivalente en paginacion y recorrido por paginas.

**Codigo existente (fuente verificable):** `backend/app/repository/inventory.repository.ts`

```ts
const result = await db
  .from('inventory')
  .select(/* ... */)
  .whereNull('deleted_at')
  .groupBy('identifier', 'item_type')
  .paginate(page, limit)
```

**Codigo existente relacionado:** `dashboard-lirio/src/app/features/inventory/services/inventory.service.ts`

```ts
setCurrentPage(page: number): void {
  this.#currentPage.set(page)
  this.loadGroupedInventoryPaginated()
}
```

**Ejemplo aplicado (propuesta formal):**
- Carpeta sugerida: `backend/app/domain/catalog/iterators/`
- `PaginatedProductIterator.next()` hasta `{ done: true }`

**Como verificar:**
- Script o test que recorra pagina por pagina hasta fin.

---

### 3.4 Mediator

**Estado actual:** equivalente en componentes "page" que coordinan tabla, forms, paginador y modales.

**Codigo existente (fuente verificable):** `dashboard-lirio/src/app/features/places/pages/places/places.ts`

```ts
onPageChange(page: number) {
  this.placesService.setCurrentPage(page)
}

onDeletePlace(place: Place) {
  this.placeToDelete.set(place)
  this.isDeleteModalOpen.set(true)
}
```

**Codigo existente relacionado:** `dashboard-lirio/src/app/features/attachments/pages/attachments/attachments.ts`

```ts
onLimitChange(limit: number) {
  this.attachmentsService.setLimit(limit)
}
```

**Ejemplo aplicado (propuesta formal):**
- Crear `dashboard-lirio/src/app/mediators/catalog-mediator.service.ts`
- Canales: filtro, pagina, data, seleccion.

**Como verificar:**
- Componentes `Filter`, `Table`, `Paginator` sin referenciarse entre si, solo via mediador.

---

### 3.5 Memento

**Estado actual:** no hay memento explicito para formularios; hay señales de estado y restauracion de entidades (soft delete/restore) que son un equivalente parcial.

**Codigo existente (fuente verificable):** `backend/app/repository/inventory.repository.ts`

```ts
async restoreBySerialIdentifier(serialIdentifier: Inventory['serialIdentifier']): Promise<Inventory> {
  const item = (await Inventory.withTrashed()
    .where('serial_identifier', serialIdentifier)
    .firstOrFail()) as Inventory
  await item.restore()
  await item.save()
  await item.refresh()
  return item
}
```

**Ejemplo aplicado (propuesta formal):**
- `dashboard-lirio/src/app/state/form-memento.service.ts`
- `FormMemento` + `FormCaretaker` con `add()` y `undo()`

**Como verificar:**
- En formulario largo, boton "Deshacer" restaura `value + step` anterior.

---

### 3.6 Observer

**Estado actual:** muy claro en frontend con `IntersectionObserver`; tambien en Angular con signals/computed reactivos.

**Codigo existente (fuente verificable):** `frontend-jazmin/app/components/PlaceCard.tsx`

```tsx
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    setIsVisible(true)
    observer.disconnect()
  }
})
```

**Codigo existente relacionado:** `dashboard-lirio/src/app/features/auth/pages/auth/auth.ts`

```ts
readonly isLogin = computed(() => this.viewMode() === 'login')
```

**Ejemplo aplicado (propuesta backend):**
- `backend/app/events/InventoryObserver.ts`
- `InventorySubject.subscribe()` y `notify()` para WebSocket + auditoria.

**Como verificar:**
- Actualizar stock y observar dos subscribers ejecutados (socket + log).

---

### 3.7 State

**Estado actual:** equivalente en estados de vista/modales y estados de carga en Angular.

**Codigo existente (fuente verificable):** `dashboard-lirio/src/app/features/auth/pages/auth/auth.ts`

```ts
private readonly viewMode = signal<'login' | 'register'>('login')

setRegister() {
  this.viewMode.set('register')
}
```

**Codigo existente relacionado:** `dashboard-lirio/src/app/features/inventory/pages/inventory/inventory.ts`

```ts
isCreateItemModalOpen = signal(false)
isEditModalOpen = signal(false)
isDetailsModalOpen = signal(false)
```

**Ejemplo aplicado (propuesta formal de dominio):**
- `backend/app/domain/orders/state/`
- `Created`, `Paid`, `Shipped`, `Cancelled` con transiciones validas.

**Como verificar:**
- Test: `ship()` en `Created` debe lanzar error.

---

### 3.8 Strategy

**Estado actual:** equivalente en estrategias de transformacion/calculo reutilizable.

**Codigo existente (fuente verificable):** `dashboard-lirio/src/app/shared/utils/money.utils.ts`

```ts
export const convertToCents = (amount: number): number => Math.round(amount * 100)
export const convertFromCents = (amountInCents: number): number => amountInCents / 100
```

**Codigo existente relacionado:** `dashboard-lirio/src/app/features/places/services/places.service.ts` (aplica conversion segun flujo)

```ts
pricePerHour: convertFromCents(place.pricePerHour)
```

**Ejemplo aplicado (propuesta formal):**
- `backend/app/services/shipping/`
- `ShippingStrategy` con `LocalStrategy`, `ExpressStrategy`, `GroundStrategy`.

**Como verificar:**
- Seleccionar estrategia por zona postal y comparar costos esperados.

---

### 3.9 Template Method

**Estado actual:** equivalente en flujos repetidos de controlador: validar -> servicio -> responder OK/ERROR.

**Codigo existente (fuente verificable):** `backend/app/controllers/places_controller.ts`

```ts
try {
  const place = await this.placesService.update(params.id, payload, auth.user!.id)
  return response.ok({ message: 'Place updated successfully', data: { place } })
} catch (error) {
  return response.badRequest({ message: 'Failed to update place', error: error.message })
}
```

**Codigo existente relacionado:** `backend/app/controllers/inventories_controller.ts` (mismo esqueleto de pasos).

**Ejemplo aplicado (propuesta formal):**
- `backend/app/services/reports/ReportTemplate.ts`
- Metodo `run()` con pasos fijos `fetchData -> filter -> export`.

**Como verificar:**
- Test con subclase `SalesReport` que sobreescribe `filter` y `export`.

---

### 3.10 Visitor

**Estado actual:** no existe visitor explicito en dominio hoy.

**Codigo existente de referencia para dominio inventario:**
- `backend/app/models/inventory.ts`
- `backend/app/repository/inventory.repository.ts`

**Ejemplo aplicado (propuesta formal):**
- `backend/app/domain/inventory/visitor/`
- Nodos `Item`, `Category` con `accept(visitor)`
- Visitors: `ValuationVisitor`, `LabelGeneratorVisitor`

**Como verificar:**
- Test con arbol de categorias/items y validacion de valuacion total.

---

## 4) Tabla resumen (que, donde, para que)

| Patron | Carpeta sugerida | Caso concreto |
|---|---|---|
| Chain of Responsibility | `backend/app/services/orders/pipeline/` | Validaciones de pedido (stock, credito, fraude) |
| Command | `backend/app/commands/inventory/` | Acciones de stock con `undo` |
| Iterator | `backend/app/domain/catalog/iterators/` | Recorrido paginado agnostico de storage |
| Mediator | `dashboard-lirio/src/app/mediators/` | Coordinar filtro/tabla/paginador sin acoplar |
| Memento | `dashboard-lirio/src/app/state/` | Deshacer en formularios/wizards |
| Observer | `backend/app/events/` | Notificar cambios de stock a sockets/logs |
| State | `backend/app/domain/orders/state/` | Flujo de vida de pedidos |
| Strategy | `backend/app/services/shipping/` | Algoritmos de costo de envio |
| Template Method | `backend/app/services/reports/` | Pipeline comun para reportes |
| Visitor | `backend/app/domain/inventory/visitor/` | Operaciones multiples sobre arbol de inventario |

---

## 5) Evidencia sugerida a generar (tests/demo)

1. **State:** test que bloquea transicion invalida (`CREATED -> SHIPPED`).
2. **Command:** test de `execute` y `undo` en inventario.
3. **Chain:** test que omite un handler opcional y el flujo continua.
4. **Visitor:** test de valuacion total sobre arbol.
5. **Mediator (UI):** demo con filtro + tabla + paginador desacoplados.
6. **Memento (UI):** boton "Deshacer" que restaura snapshot.
7. **Observer:** log/salida WebSocket por cada cambio de stock.

---

## 6) Comandos para PDF

```bash
pandoc patrones-20-mar-26.md -f gfm -o comportamiento.pdf --pdf-engine=xelatex --toc
```

Si quieres separar por secciones, puedes usar `sed` antes de pasar a `pandoc`.

---

## 7) Checklist rapido

- Chain of Responsibility: equivalente actual en middleware pipeline; propuesta lista para pedidos
- Command: equivalente parcial en acciones de UI; propuesta formal con `undo`
- Iterator: equivalente actual en paginacion backend/frontend
- Mediator: equivalente actual en componentes page coordinadores
- Memento: sin implementacion formal; propuesta lista para forms
- Observer: implementado en React con `IntersectionObserver`; propuesta backend para stock
- State: equivalente actual en `signal` de modo/estado UI; propuesta formal para pedidos
- Strategy: equivalente actual en conversion monetaria y aplicacion por flujo
- Template Method: equivalente actual en esqueleto repetido de controladores
- Visitor: sin implementacion formal; propuesta lista para arbol de inventario

---

## 8) Fuentes exactas usadas (repo)

- `backend/start/kernel.ts`
- `backend/app/middleware/role_middleware.ts`
- `backend/app/repository/inventory.repository.ts`
- `backend/app/services/inventory.service.ts`
- `backend/app/controllers/places_controller.ts`
- `backend/app/controllers/inventories_controller.ts`
- `backend/app/services/logs.service.ts`
- `dashboard-lirio/src/app/features/places/pages/places/places.ts`
- `dashboard-lirio/src/app/features/attachments/pages/attachments/attachments.ts`
- `dashboard-lirio/src/app/features/inventory/pages/inventory/inventory.ts`
- `dashboard-lirio/src/app/features/inventory/services/inventory.service.ts`
- `dashboard-lirio/src/app/features/places/services/places.service.ts`
- `dashboard-lirio/src/app/features/auth/pages/auth/auth.ts`
- `dashboard-lirio/src/app/shared/components/tables/paginator/paginator.ts`
- `dashboard-lirio/src/app/shared/utils/money.utils.ts`
- `frontend-jazmin/app/components/PlaceCard.tsx`
- `frontend-jazmin/app/components/AboutUs.tsx`
- `frontend-jazmin/app/components/Landing.tsx`
