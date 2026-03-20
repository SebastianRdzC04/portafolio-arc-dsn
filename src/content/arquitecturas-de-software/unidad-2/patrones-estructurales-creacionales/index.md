---
title: "Patrones Estructurales y Creacionales en elroble-system"
description: "Análisis exhaustivo de 12 patrones de diseño aplicados al proyecto elroble-system, incluyendo Factory Method, Singleton, Adapter, Decorator y más patrones implementados en el stack AdonisJS, Angular y Next.js."
date: 2026-03-20
draft: false
order: 7
tags: ["evaluación", "usabilidad", "sumativo", "testing", "UX", "lighthouse", "benchmarking", "rendimiento", "accesibilidad", "El Roble", "automatización"]
type: "pruebas-sumativas"
---





# Patrones de Diseño aplicados a `elroble-system`



Repositorio: https://github.com/SebastianRdzC04/elroble-system.git **Intente hacerlo publico pero me pide acceso con git mobile y no tengo internet en el cel, pero cuando tenga internet hago publico el repositorio para que pueda verificarlo**




**Análisis exhaustivo de 12 patrones de diseño aplicados al proyecto**

- **Repositorio:** `SebastianRdzC04/elroble-system`
- **Rama analizada:** `front-j`
- **Fecha de análisis:** 2026-03-20
- **Autor:** Análisis técnico de arquitectura

---

## 📋 Tabla de Contenidos

1. [Contexto del Proyecto](#contexto-del-proyecto)
2. [Patrones Creacionales](#patrones-creacionales)
3. [Patrones Estructurales](#patrones-estructurales)
4. [Matriz de Aplicación](#matriz-de-aplicación)

---

## Contexto del Proyecto

### Stack Tecnológico

| Capa | Tecnología | Ruta | Propósito |
|------|-----------|------|----------|
| **Backend** | AdonisJS v6 + TypeScript + PostgreSQL/MongoDB | `/backend` | API REST con inyección de dependencias, repositorios, servicios |
| **Dashboard** | Angular 20 + Signals + Tailwind CSS v4 | `/dashboard-lirio` | Admin panel con componentes standalone, reactive forms |
| **Frontend** | Next.js 16 + React 19 + Tailwind CSS v4 | `/frontend-jazmin` | Sitio público con App Router, API routes como BFF |
| **Infraestructura** | Docker Compose, Nginx | `/infrastructure` | Orquestación de servicios (PostgreSQL, MongoDB) |

### Dominio de la Aplicación

**El Roble** es un sistema integral de gestión para eventos, inventario e reservas:

- **Entidades principales:** Users, Clients, Events, Places, Inventory, Quotes, Attachments
- **Patrones de datos:** PostgreSQL para transacciones (Lucid ORM), MongoDB para logs/auditoría (Mongoose)
- **Patrón de acceso:** Repository pattern en Inventory, DI en AdonisJS, Signals en Angular

### Convenciones de Código

| Aspecto | Backend | Dashboard | Frontend |
|--------|---------|-----------|----------|
| **Archivos** | `snake_case` | `kebab-case` dirs | `kebab-case` dirs |
| **Clases** | `PascalCase` | `PascalCase` (no `Component` suffix) | `PascalCase` |
| **Funciones** | `camelCase` | `camelCase` | `camelCase` |
| **Imports** | Hash aliases (`#services/*`) | Relative paths | `@/*` path aliases |
| **Tipos** | `Infer<>` desde validators | `interface` en `.model.ts` | `interface` en `types/` |

---

---

# PATRONES CREACIONALES

## 1. Factory Method

### Definición
**Factory Method** proporciona una interfaz para crear objetos sin especificar sus clases concretas. Es útil cuando tienes múltiples subclases y quieres delegar la responsabilidad de creación.

### 🔍 Análisis en el Proyecto

#### Patrón Identificado: Repository Factory

En `backend/app/repository/inventory.repository.ts` existe un patrón de creación centralizada de repositorios. Aunque no está explícitamente factorizado, el servicio `InventoryService` actúa como productor de objetos de repositorio.

```typescript
// backend/app/repository/inventory.repository.ts
export default class InventoryRepository {
  async create(payload: CreateItemWithCreator): Promise<Inventory> {
    const item = await Inventory.create(payload)
    return item
  }

  async createMany(payloads: CreateItemWithCreator[]): Promise<Inventory[]> {
    const items = await Inventory.createMany(payloads)
    return items
  }
}
```

**Análisis:**
- ✅ El repositorio actúa como factory para items de inventario
- ✅ Delega la creación a Lucid ORM (`Inventory.create()`)
- ⚠️ No existe factory explícita para diferentes tipos de repositorios

#### Donde se Aplica Actualmente

**Backend - Inventory Service** (línea 34-54 en `inventory.service.ts`):

```typescript
async createNewOne(payload: CreateItemInventoryPayload, creator: User['id']): Promise<Inventory> {
  const existingItem = await this.inventoryRepository.getInventoryByIdentifier(payload.identifier)
  if (existingItem && existingItem.stock > 0) {
    throw new Error('Inventory item with this identifier already exists')
  }

  const itemToCreate: CreateItemInventoryPayload & {
    serialNumber: Inventory['serialNumber']
    serialIdentifier: Inventory['serialIdentifier']
    createdBy: User['id']
  } = {
    ...payload,
    serialNumber: 1,
    status: payload.status || 'available',
    serialIdentifier: `${payload.identifier}-1`,
    createdBy: creator,
  }

  const newItem = await this.inventoryRepository.create(itemToCreate)
  return newItem
}
```

**Evidencia:** El servicio actúa como factory delegando la creación compleja al repositorio.

### 📝 Implementación Completa (Propuesta)

Para mejorar la aplicación del patrón Factory Method, podríamos crear una factory explícita para diferentes tipos de repositorios (PostgreSQL vs MongoDB):

```typescript
// backend/app/factories/RepositoryFactory.ts
import InventoryRepository from '#repository/inventory.repository'
import InventoryMongoRepository from '#repository/mongo/inventory.repository'

export type RepositoryType = 'pg' | 'mongo'

export interface IRepositoryFactory {
  createInventoryRepository(): InventoryRepository | InventoryMongoRepository
}

export class RepositoryFactory implements IRepositoryFactory {
  constructor(private type: RepositoryType = 'pg') {}

  createInventoryRepository(): InventoryRepository | InventoryMongoRepository {
    if (this.type === 'mongo') {
      return new InventoryMongoRepository()
    }
    return new InventoryRepository()
  }

  static getInstance(type: RepositoryType = 'pg'): RepositoryFactory {
    return new RepositoryFactory(type)
  }
}

// Uso en Service
@inject()
export default class InventoryService {
  private inventoryRepository: InventoryRepository | InventoryMongoRepository

  constructor() {
    const factory = RepositoryFactory.getInstance(Env.get('REPO_TYPE') as RepositoryType)
    this.inventoryRepository = factory.createInventoryRepository()
  }
}
```

### 🎯 Casos de Uso en el Proyecto

1. **Dual Database Support:** Crear repositorios para Postgres o MongoDB dinámicamente
2. **Event Types:** Factory para crear diferentes tipos de eventos (virtuales, presenciales)
3. **Attachment Factories:** Crear handlers para diferentes tipos de archivos (PDF, imagen, video)

---

## 2. Abstract Factory

### Definición
**Abstract Factory** provee una interfaz para crear **familias** de objetos relacionados sin especificar sus clases concretas. Útil cuando el sistema debe ser independiente de cómo se crean sus objetos.

### 🔍 Análisis en el Proyecto

#### Patrón Identificado: Component UI Factories (Angular)

En `dashboard-lirio/src/app/shared/components/ui/` existe una familia de componentes reutilizables que podrían ser producidos por una Abstract Factory.

```
dashboard-lirio/src/app/shared/components/ui/
├── input-base/
├── button-side-bar/
├── card-user-profile/
├── base-modal/
├── large-modal/
├── toastr-base/
└── image-thumb/
```

**Análisis:**
- ✅ Existe una familia de componentes UI cohesivos
- ✅ Todos comparten convenciones de estilo (Tailwind v4)
- ✅ El patrón podría mejorarse con una factory centralizada

#### Donde se Aplica Actualmente

**Dashboard - Components Shared** (estructura en `/shared/components/`):

Los componentes UI son importados directamente en componentes que los necesitan:

```typescript
// dashboard-lirio/src/app/features/places/components/form-place-create/form-place-create.ts
import { InputBase } from '../../../../shared/components/ui/input-base/input-base'
import { ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-form-place-create',
  templateUrl: './form-place-create.html',
  styleUrl: './form-place-create.css',
  imports: [ReactiveFormsModule, InputBase], // Importación directa
})
export class FormPlaceCreate {
  // ...
}
```

### 📝 Implementación Completa (Propuesta)

Para implementar Abstract Factory en Angular para crear familias de componentes temáticos (Claro, Oscuro, Accesible):

```typescript
// dashboard-lirio/src/app/shared/factories/ui-component.factory.ts
import { Type } from '@angular/core'
import { InputBase } from '../components/ui/input-base/input-base'
import { BaseModal } from '../components/ui/base-modal/base-modal'
import { ToastrBase } from '../components/ui/toastr-base/toastr-base'

export type Theme = 'light' | 'dark' | 'accessible'

export interface UIComponentFamily {
  inputComponent: Type<any>
  modalComponent: Type<any>
  toastComponent: Type<any>
}

abstract class AbstractUIFactory {
  abstract createInputComponent(): Type<any>
  abstract createModalComponent(): Type<any>
  abstract createToastComponent(): Type<any>

  getComponentFamily(): UIComponentFamily {
    return {
      inputComponent: this.createInputComponent(),
      modalComponent: this.createModalComponent(),
      toastComponent: this.createToastComponent(),
    }
  }
}

class LightThemeFactory extends AbstractUIFactory {
  createInputComponent() {
    return InputBase // con clase 'light-input'
  }
  createModalComponent() {
    return BaseModal // con clase 'light-modal'
  }
  createToastComponent() {
    return ToastrBase // con clase 'light-toast'
  }
}

class DarkThemeFactory extends AbstractUIFactory {
  createInputComponent() {
    return InputBase // con clase 'dark-input'
  }
  createModalComponent() {
    return BaseModal // con clase 'dark-modal'
  }
  createToastComponent() {
    return ToastrBase // con clase 'dark-toast'
  }
}

// Servicio que proporciona la factory
@Injectable({ providedIn: 'root' })
export class UIFactoryService {
  private factories = new Map<Theme, AbstractUIFactory>([
    ['light', new LightThemeFactory()],
    ['dark', new DarkThemeFactory()],
  ])

  getFactory(theme: Theme): AbstractUIFactory {
    return this.factories.get(theme) || this.factories.get('light')!
  }
}

// Uso en componentes
export class MyComponent {
  private uiFactory = inject(UIFactoryService)

  ngOnInit() {
    const factory = this.uiFactory.getFactory('dark')
    const family = factory.getComponentFamily()
    // Usar family.inputComponent, family.modalComponent, etc.
  }
}
```

### 🎯 Casos de Uso en el Proyecto

1. **Temas Visuales:** Crear familias de componentes para tema claro/oscuro/accesible
2. **Tipos de Formularios:** Familias de inputs para datos diferentes (email, teléfono, fecha)
3. **Adaptadores Backend:** Familias de servicios para Postgres/MongoDB

---

## 3. Builder

### Definición
**Builder** permite construir objetos complejos paso a paso. Separa la construcción de la representación, permitiendo construir diferentes representaciones del mismo objeto.

### 🔍 Análisis en el Proyecto

#### Patrón Identificado: Reactive Forms Builder

En Angular, `FormBuilder` es un ejemplo de Builder pattern. En `dashboard-lirio`, los formularios se construyen dinámicamente:

```typescript
// dashboard-lirio/src/app/features/auth/components/form-login/form-login.ts
loginForm = new FormGroup({
  email: new FormControl(''),
  password: new FormControl(''),
})
```

**Análisis:**
- ✅ Angular's `FormBuilder` usa Builder internamente
- ✅ Los formularios se construyen paso a paso
- ⚠️ No existe un builder custom para queries complejas o reportes

#### Donde se Aplica Actualmente

**Backend - Query Building** (Lucid ORM en repositorios):

```typescript
// backend/app/repository/inventory.repository.ts - línea 56-73
async getGroupedInventoryPaginated(page: number, limit: number) {
  const result = await db
    .from('inventory')
    .select(
      db.raw('MIN(id) as id'),
      'identifier',
      db.raw('MAX(name) as name'),
      db.raw('MAX(description) as description'),
      'item_type as type',
      db.raw('COUNT(*) as stock'),
      db.raw(`COUNT(*) FILTER (WHERE status = 'available') as "availableCount"`)
    )
    .whereNull('deleted_at')
    .groupBy('identifier', 'item_type')
    .paginate(page, limit)

  return result
}
```

**Evidencia:** Lucid ORM proporciona una interfaz fluida (chainable) que es el patrón Builder.

### 📝 Implementación Completa (Propuesta)

Para crear reportes complejos de inventario con opciones encadenables:

```typescript
// backend/app/builders/InventoryReportBuilder.ts
import { DateTime } from 'luxon'

export interface ReportOptions {
  includeDeleted: boolean
  groupByType: boolean
  withTotals: boolean
  withCharts: boolean
  startDate?: DateTime
  endDate?: DateTime
}

export class InventoryReportBuilder {
  private options: Partial<ReportOptions> = {
    includeDeleted: false,
    groupByType: true,
    withTotals: false,
    withCharts: false,
  }

  includeDeleted(value: boolean = true): this {
    this.options.includeDeleted = value
    return this
  }

  groupByType(value: boolean = true): this {
    this.options.groupByType = value
    return this
  }

  withTotals(): this {
    this.options.withTotals = true
    return this
  }

  withCharts(): this {
    this.options.withCharts = true
    return this
  }

  fromDate(date: DateTime): this {
    this.options.startDate = date
    return this
  }

  toDate(date: DateTime): this {
    this.options.endDate = date
    return this
  }

  async buildCsv(): Promise<string> {
    const data = await this.buildData()
    return this.convertToCsv(data)
  }

  async buildPdf(): Promise<Buffer> {
    const data = await this.buildData()
    return this.convertToPdf(data)
  }

  async buildJson(): Promise<object> {
    return this.buildData()
  }

  private async buildData() {
    // Construir query según opciones
    let query = Inventory.query()

    if (!this.options.includeDeleted) {
      query = query.whereNull('deleted_at')
    }

    if (this.options.startDate) {
      query = query.where('created_at', '>=', this.options.startDate.toSQL())
    }

    if (this.options.endDate) {
      query = query.where('created_at', '<=', this.options.endDate.toSQL())
    }

    return await query
  }

  private convertToCsv(data: any[]): string {
    // Implementar conversión a CSV
    return ''
  }

  private convertToPdf(data: any[]): Buffer {
    // Implementar conversión a PDF
    return Buffer.from('')
  }
}

// Uso
@inject()
export class InventoriesController {
  async exportReport({ response }: HttpContext) {
    const report = new InventoryReportBuilder()
      .includeDeleted(false)
      .groupByType()
      .withTotals()
      .withCharts()
      .fromDate(DateTime.now().minus({ months: 1 }))
      .toDate(DateTime.now())

    const csv = await report.buildCsv()
    response.stream(csv)
  }
}
```

### 🎯 Casos de Uso en el Proyecto

1. **Reportes de Inventario:** Construir reportes con diferentes opciones
2. **Query Building:** Construir queries complejas dinámicamente
3. **Formularios Avanzados:** Construir formularios reactivos con validaciones complejas

---

## 4. Prototype

### Definición
**Prototype** permite crear nuevos objetos copiando un prototipo existente en lugar de crear desde cero. Útil para objetos costosos de crear o para reutilizar configuraciones.

### 🔍 Análisis en el Proyecto

#### Patrón Identificado: Formularios Reutilizables (Angular)

En `dashboard-lirio`, existen múltiples formularios similares que podrían ser prototipos clonables:

- `form-place-create` → `form-place-update`
- `form-inventory-create` → `form-inventory-edit`
- `form-attachment-create` → `form-attachment-update`

```typescript
// dashboard-lirio/src/app/features/places/components/form-place-create/form-place-create.ts
@Component({
  selector: 'app-form-place-create',
  templateUrl: './form-place-create.html',
  styleUrl: './form-place-create.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputBase],
})
export class FormPlaceCreate {
  private fb = inject(FormBuilder)

  form = this.fb.group({
    name: ['', [Validators.required]],
    address: [''],
    description: [''],
    capacity: [''],
  })
}
```

**Análisis:**
- ✅ Los formularios tienen estructura similar
- ✅ Podrían ser clonados desde un prototipo
- ⚠️ No existe un servicio centralizado de prototipos

### 📝 Implementación Completa (Propuesta)

Crear un servicio de prototipos de formularios en Angular:

```typescript
// dashboard-lirio/src/app/shared/services/form-prototype.service.ts
import { Injectable, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

export interface FormPrototype {
  name: string
  schema: any
}

@Injectable({ providedIn: 'root' })
export class FormPrototypeService {
  private fb = inject(FormBuilder)
  private prototypes = new Map<string, FormPrototype>()

  constructor() {
    this.registerPrototypes()
  }

  private registerPrototypes() {
    // Prototipo para Lugar
    this.prototypes.set('place', {
      name: 'place',
      schema: {
        name: ['', [Validators.required, Validators.minLength(3)]],
        address: ['', [Validators.required]],
        description: [''],
        capacity: ['', [Validators.required, Validators.min(1)]],
        phoneNumber: [''],
      },
    })

    // Prototipo para Inventario
    this.prototypes.set('inventory', {
      name: 'inventory',
      schema: {
        identifier: ['', [Validators.required]],
        name: ['', [Validators.required]],
        itemType: ['', [Validators.required]],
        description: [''],
        quantity: ['', [Validators.required, Validators.min(1)]],
        status: ['available'],
      },
    })

    // Prototipo para Cliente
    this.prototypes.set('client', {
      name: 'client',
      schema: {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required]],
        address: [''],
      },
    })
  }

  // Obtener prototipo y clonarlo
  cloneForm(prototypeName: string): FormGroup {
    const prototype = this.prototypes.get(prototypeName)
    if (!prototype) {
      throw new Error(`Prototype "${prototypeName}" not found`)
    }
    return this.fb.group(prototype.schema)
  }

  // Registrar un nuevo prototipo
  registerPrototype(name: string, schema: any): void {
    this.prototypes.set(name, { name, schema })
  }

  // Actualizar un prototipo existente
  updatePrototype(name: string, schema: any): void {
    if (this.prototypes.has(name)) {
      this.prototypes.set(name, { name, schema })
    }
  }

  // Listar prototipos disponibles
  listPrototypes(): string[] {
    return Array.from(this.prototypes.keys())
  }
}

// Uso en componentes
@Component({
  selector: 'app-form-client-create',
  template: `
    <form [formGroup]="form">
      <app-input-base formControlName="name" />
      <app-input-base formControlName="email" />
      <button (click)="onSubmit()">Crear Cliente</button>
    </form>
  `,
})
export class FormClientCreate {
  private formPrototype = inject(FormPrototypeService)
  form = this.formPrototype.cloneForm('client')

  onSubmit() {
    if (this.form.valid) {
      console.log('Crear cliente:', this.form.value)
    }
  }
}
```

**Backend - Prototipo de Payload:**

```typescript
// backend/app/services/payload-prototype.service.ts
import { CreateItemInventoryPayload } from '#validators/inventory'

export class PayloadPrototypeService {
  private prototypes = new Map<string, any>()

  registerPrototype(name: string, prototype: any): void {
    this.prototypes.set(name, prototype)
  }

  clone(name: string): any {
    const prototype = this.prototypes.get(name)
    if (!prototype) {
      throw new Error(`Prototype "${name}" not found`)
    }
    // Deep clone
    return JSON.parse(JSON.stringify(prototype))
  }
}

// Uso
const payloadProto = new PayloadPrototypeService()
payloadProto.registerPrototype('inventory-basic', {
  itemType: 'furniture',
  status: 'available',
  properties: {},
} as Partial<CreateItemInventoryPayload>)

// Reutilizar
const newPayload = payloadProto.clone('inventory-basic')
newPayload.identifier = 'SILLA-001'
newPayload.name = 'Silla de madera'
```

### 🎯 Casos de Uso en el Proyecto

1. **Clonación de Formularios:** Reutilizar esquemas de formularios para crear/editar
2. **Configuraciones Base:** Clonar configuraciones de eventos o lugares
3. **Payloads Predefinidos:** Clonar estructuras de datos comunes

---

## 5. Singleton

### Definición
**Singleton** asegura que una clase tenga solo una instancia y proporciona un punto de acceso global a ella. Útil para servicios compartidos.

### 🔍 Análisis en el Proyecto

#### Patrón Identificado: Angular Services y Auth Manager

En Angular 20, todos los servicios con `providedIn: 'root'` son singletons:

```typescript
// dashboard-lirio/src/app/features/auth/services/auth.service.ts
@Injectable({
  providedIn: 'root',  // ← Singleton a nivel de aplicación
})
export class AuthService {
  private apiUrl = environment.apiUrl
  private router = inject(Router)
  private http = inject(HttpClient)

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/session/login`, data)
  }

  logout() {
    return this.http.post(`${this.apiUrl}/auth/session/logout`, {})
  }

  verifySession() {
    return this.http.get<AuthResponse>(`${this.apiUrl}/auth/session/me`)
  }
}
```

**Análisis:**
- ✅ El patrón Singleton está completamente aplicado en Angular
- ✅ `ModalStackService` es otro ejemplo perfecto de Singleton
- ✅ `ToastrService` mantiene estado global

```typescript
// dashboard-lirio/src/app/core/services/modal-stack.service.ts
@Injectable({ providedIn: 'root' })
export class ModalStackService {
  #depth = signal(0)
  topDepth = this.#depth.asReadonly()

  push(): number {
    const next = this.#depth() + 1
    this.#depth.set(next)
    if (next === 1) {
      this.document.body.style.overflow = 'hidden'
    }
    return next
  }

  pop(): void {
    const next = Math.max(0, this.#depth() - 1)
    this.#depth.set(next)
    if (next === 0) {
      this.document.body.style.overflow = ''
    }
  }

  isTop(depth: number) {
    return depth === this.#depth()
  }
}
```

**Evidencia:** El servicio mantiene un estado compartido para la profundidad de modales.

### 📝 Implementación Completa (Propuesta)

Backend - Singleton para gestión de caché y configuración:

```typescript
// backend/app/services/cache-manager.service.ts
import Redis from '@ioc:Adonis/Addons/Redis'

export class CacheManager {
  private static instance: CacheManager | null = null
  private redis = Redis

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key)
    return value ? JSON.parse(value) : null
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value)
    if (ttl) {
      await this.redis.setex(key, ttl, serialized)
    } else {
      await this.redis.set(key, serialized)
    }
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern)
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }

  async clear(): Promise<void> {
    await this.redis.flushdb()
  }
}

// Uso en servicio
@inject()
export default class InventoryService {
  private cache = CacheManager.getInstance()

  async getGroupedInventory() {
    const cached = await this.cache.get<InventorySet[]>('inventory:grouped')
    if (cached) return cached

    const data = await this.inventoryRepository.getGroupedInventory()
    await this.cache.set('inventory:grouped', data, 300) // 5 minutos
    return data
  }
}
```

Next.js - Singleton para AuthManager:

```typescript
// frontend-jazmin/src/lib/auth-manager.ts
import { cookies } from 'next/headers'

class AuthManager {
  private static instance: AuthManager | null = null
  private tokenKey = 'auth-token'

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager()
    }
    return AuthManager.instance
  }

  async getToken(): Promise<string | null> {
    const cookieStore = await cookies()
    return cookieStore.get(this.tokenKey)?.value || null
  }

  async setToken(token: string): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.set(this.tokenKey, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })
  }

  async clearToken(): Promise<void> {
    const cookieStore = await cookies()
    cookieStore.delete(this.tokenKey)
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken()
    return !!token
  }
}

export const authManager = AuthManager.getInstance()

// Uso en middleware
export async function middleware(request: NextRequest) {
  const isAuthenticated = await authManager.isAuthenticated()
  
  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
```

### 🎯 Casos de Uso en el Proyecto

1. **Cache Manager:** Única instancia para Redis
2. **Auth Service:** Única gestión de sesión
3. **Configuration Service:** Única configuración de la aplicación
4. **Event Emitter:** Única instancia para comunicación entre servicios

---

---

# PATRONES ESTRUCTURALES

## 1. Adapter

### Definición
**Adapter** permite que objetos con interfaces incompatibles colaboren. Convierte la interfaz de una clase en otra que los clientes esperan.

### 🔍 Análisis en el Proyecto

#### Patrón Identificado: Services como Adaptadores

Los servicios en Angular actúan como adaptadores entre componentes y la API:

```typescript
// dashboard-lirio/src/app/features/places/services/places.service.ts
import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../../environments/environment'
import { Place } from '../models/place.model'

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl

  getPlaces() {
    return this.http.get<any>(`${this.apiUrl}/places`)
  }

  createPlace(data: any) {
    return this.http.post<any>(`${this.apiUrl}/places`, data)
  }
}
```

**Análisis:**
- ✅ El servicio adapta la API del HttpClient a métodos específicos de dominio
- ✅ Aísla los cambios de la API en una única ubicación
- ✅ Transforma respuestas genéricas en tipos del dominio

#### Donde se Aplica Actualmente

**Backend - Adaptadores de Pago** (Proposición):

En un sistema de pago, podrías tener múltiples proveedores (Stripe, MercadoPago, PayPal) con diferentes interfaces. Un adapter los unifica:

```typescript
// backend/app/adapters/PaymentAdapter.ts
export interface ExternalPaymentResponse {
  status: string
  amount_received: number
  id: string
  currency: string
}

export interface DomainPaymentResult {
  status: 'success' | 'failed' | 'pending'
  amount: number
  externalId: string
  timestamp: DateTime
}

export class StripePaymentAdapter {
  static toDomain(response: any): DomainPaymentResult {
    return {
      status: response.status === 'succeeded' ? 'success' : 'failed',
      amount: response.amount / 100,
      externalId: response.id,
      timestamp: DateTime.now(),
    }
  }
}

export class MercadoPagoPaymentAdapter {
  static toDomain(response: any): DomainPaymentResult {
    return {
      status: response.status === 'approved' ? 'success' : 'failed',
      amount: response.transaction_amount,
      externalId: response.id,
      timestamp: DateTime.now(),
    }
  }
}

// Uso en servicio
@inject()
export class PaymentService {
  async processStripePayment(paymentId: string) {
    const stripeResponse = await this.stripeClient.retrieve(paymentId)
    const domainResult = StripePaymentAdapter.toDomain(stripeResponse)
    return domainResult
  }

  async processMercadoPagoPayment(paymentId: string) {
    const mpResponse = await this.mpClient.getPayment(paymentId)
    const domainResult = MercadoPagoPaymentAdapter.toDomain(mpResponse)
    return domainResult
  }
}
```

### 📝 Implementación Completa (Propuesta)

Adapter para convertir entre formatos de archivos:

```typescript
// backend/app/adapters/DocumentAdapter.ts
import PDFDocument from 'pdfkit'
import * as XLSX from 'xlsx'

export interface DocumentFormat {
  type: 'pdf' | 'excel' | 'csv'
  content: Buffer | string
}

export class PDFAdapter {
  static fromData(data: any[]): DocumentFormat {
    const doc = new PDFDocument()
    let output = ''

    doc.on('data', (chunk) => {
      output += chunk
    })

    data.forEach((item) => {
      doc.text(`${item.name}: ${item.value}`)
    })

    doc.end()

    return {
      type: 'pdf',
      content: Buffer.from(output),
    }
  }
}

export class ExcelAdapter {
  static fromData(data: any[]): DocumentFormat {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
    const buffer = XLSX.write(workbook, { type: 'buffer' })

    return {
      type: 'excel',
      content: buffer as Buffer,
    }
  }
}

export class CSVAdapter {
  static fromData(data: any[]): DocumentFormat {
    const headers = Object.keys(data[0] || {}).join(',')
    const rows = data.map((item) => Object.values(item).join(','))
    const csv = [headers, ...rows].join('\n')

    return {
      type: 'csv',
      content: csv,
    }
  }
}

// Servicio que usa los adapters
@inject()
export class ReportService {
  async generateReport(data: any[], format: 'pdf' | 'excel' | 'csv'): Promise<DocumentFormat> {
    switch (format) {
      case 'pdf':
        return PDFAdapter.fromData(data)
      case 'excel':
        return ExcelAdapter.fromData(data)
      case 'csv':
        return CSVAdapter.fromData(data)
    }
  }
}
```

### 🎯 Casos de Uso en el Proyecto

1. **Payment Gateways:** Adaptar Stripe, MercadoPago, PayPal
2. **File Format Conversion:** Adaptar entre PDF, Excel, CSV
3. **External APIs:** Adaptar diferentes APIs externas
4. **Database Adapters:** Adaptar PostgreSQL y MongoDB

---

## 2. Bridge

### Definición
**Bridge** separa la abstracción de su implementación, permitiendo que ambas varíen independientemente. Útil cuando tienes múltiples dimensiones de variación.

### 🔍 Análisis en el Proyecto

#### Patrón Identificado: Notificaciones multicanal (Propuesta)

El patrón Bridge es perfecto para separar el concepto de "notificación" del "medio de envío":

```typescript
// backend/app/bridges/notifications/NotificationAbstraction.ts
export interface Channel {
  send(recipient: string, message: string): Promise<void>
}

export enum NotificationType {
  EVENT_CREATED = 'event_created',
  PAYMENT_CONFIRMED = 'payment_confirmed',
  RESERVATION_REMINDER = 'reservation_reminder',
}

export interface NotificationContent {
  type: NotificationType
  userId: string
  data: any
}

// Abstracciones (lado izquierdo del puente)
abstract class Notification {
  constructor(protected channel: Channel) {}
  abstract send(content: NotificationContent): Promise<void>
}

class EventNotification extends Notification {
  async send(content: NotificationContent): Promise<void> {
    const message = `Se ha creado un nuevo evento: ${content.data.eventName}`
    await this.channel.send(content.userId, message)
  }
}

class PaymentNotification extends Notification {
  async send(content: NotificationContent): Promise<void> {
    const message = `Tu pago de $${content.data.amount} ha sido confirmado`
    await this.channel.send(content.userId, message)
  }
}

// Implementaciones (lado derecho del puente)
export class EmailChannel implements Channel {
  async send(recipient: string, message: string): Promise<void> {
    // Usar servicio de email (nodemailer, sendgrid, etc.)
    console.log(`📧 Email a ${recipient}: ${message}`)
  }
}

export class WhatsAppChannel implements Channel {
  async send(recipient: string, message: string): Promise<void> {
    // Usar API de WhatsApp (Twilio, etc.)
    console.log(`💬 WhatsApp a ${recipient}: ${message}`)
  }
}

export class PushNotificationChannel implements Channel {
  async send(recipient: string, message: string): Promise<void> {
    // Usar servicio push (FCM, etc.)
    console.log(`🔔 Push a ${recipient}: ${message}`)
  }
}

// Uso en servicio
@inject()
export class NotificationService {
  async notifyEventCreated(userId: string, eventName: string, channel: Channel) {
    const notification = new EventNotification(channel)
    await notification.send({
      type: NotificationType.EVENT_CREATED,
      userId,
      data: { eventName },
    })
  }

  async notifyPaymentConfirmed(
    userId: string,
    amount: number,
    preferredChannel: 'email' | 'whatsapp' | 'push'
  ) {
    const channels: Record<string, Channel> = {
      email: new EmailChannel(),
      whatsapp: new WhatsAppChannel(),
      push: new PushNotificationChannel(),
    }

    const notification = new PaymentNotification(channels[preferredChannel])
    await notification.send({
      type: NotificationType.PAYMENT_CONFIRMED,
      userId,
      data: { amount },
    })
  }
}

// Uso en controller
@inject()
export class EventsController {
  async store({ request, response }: HttpContext) {
    const eventData = await request.validateUsing(createEventValidator)
    const event = await this.eventService.create(eventData)

    // Notificar por email
    await this.notificationService.notifyEventCreated(
      eventData.createdBy,
      event.name,
      new EmailChannel()
    )

    return response.created({ message: 'Evento creado', data: { event } })
  }
}
```

### 📝 Implementación Completa

El ejemplo anterior ya es bastante completo. Veamos otro caso - Bridge para diferentes estrategias de almacenamiento:

```typescript
// backend/app/bridges/storage/StorageAbstraction.ts
export interface StorageDriver {
  save(filename: string, content: Buffer): Promise<string>
  get(path: string): Promise<Buffer>
  delete(path: string): Promise<void>
}

// Abstracciones
abstract class FileStorage {
  constructor(protected driver: StorageDriver) {}
  abstract saveUserAvatar(userId: string, file: Buffer): Promise<string>
  abstract getUserAvatar(userId: string): Promise<Buffer>
}

class UserAvatarStorage extends FileStorage {
  async saveUserAvatar(userId: string, file: Buffer): Promise<string> {
    const filename = `avatars/user-${userId}-${Date.now()}.jpg`
    return await this.driver.save(filename, file)
  }

  async getUserAvatar(userId: string): Promise<Buffer> {
    // Obtener el avatar más reciente
    return await this.driver.get(`avatars/user-${userId}`)
  }
}

class EventPhotoStorage extends FileStorage {
  async saveEventPhoto(eventId: string, file: Buffer): Promise<string> {
    const filename = `events/event-${eventId}-${Date.now()}.jpg`
    return await this.driver.save(filename, file)
  }

  async getEventPhoto(eventId: string): Promise<Buffer> {
    return await this.driver.get(`events/event-${eventId}`)
  }
}

// Implementaciones
class LocalStorageDriver implements StorageDriver {
  private basePath = './storage'

  async save(filename: string, content: Buffer): Promise<string> {
    // Guardar en sistema de archivos local
    const path = `${this.basePath}/${filename}`
    // fs.writeFileSync(path, content)
    return path
  }

  async get(path: string): Promise<Buffer> {
    // Leer desde sistema de archivos
    // return fs.readFileSync(path)
    return Buffer.from('')
  }

  async delete(path: string): Promise<void> {
    // Eliminar archivo
    // fs.unlinkSync(path)
  }
}

class S3StorageDriver implements StorageDriver {
  private s3Client: AWS.S3

  async save(filename: string, content: Buffer): Promise<string> {
    // Guardar en AWS S3
    return ''
  }

  async get(path: string): Promise<Buffer> {
    // Descargar desde S3
    return Buffer.from('')
  }

  async delete(path: string): Promise<void> {
    // Eliminar de S3
  }
}

class CloudFlareR2StorageDriver implements StorageDriver {
  async save(filename: string, content: Buffer): Promise<string> {
    // Guardar en Cloudflare R2
    return ''
  }

  async get(path: string): Promise<Buffer> {
    // Descargar desde R2
    return Buffer.from('')
  }

  async delete(path: string): Promise<void> {
    // Eliminar de R2
  }
}
```

### 🎯 Casos de Uso en el Proyecto

1. **Notificaciones Multicanal:** Email, SMS, WhatsApp, Push
2. **Almacenamiento:** Local, S3, Cloudflare R2
3. **Pagos:** Stripe, MercadoPago, PayPal
4. **Logs:** Base de datos, archivos, servicios externos

---

## 3. Composite

### Definición
**Composite** compone objetos en estructuras de árbol para representar jerarquías parte-todo. Permite que los clientes traten objetos individuales y composiciones de objetos de manera uniforme.

### 🔍 Análisis en el Proyecto

#### Patrón Identificado: Estructura Jerárquica de Inventario

El inventario del sistema puede tener estructura jerárquica: Categoría > Subcategoría > Items

```typescript
// backend/app/domain/inventory/InventoryNode.ts
export interface IInventoryNode {
  getName(): string
  getStock(): number
  add(node: IInventoryNode): void
  remove(node: IInventoryNode): void
}

// Hoja (Item)
export class InventoryItem implements IInventoryNode {
  constructor(
    private name: string,
    private stock: number
  ) {}

  getName(): string {
    return this.name
  }

  getStock(): number {
    return this.stock
  }

  add(node: IInventoryNode): void {
    throw new Error('Cannot add child to leaf node')
  }

  remove(node: IInventoryNode): void {
    throw new Error('Cannot remove child from leaf node')
  }
}

// Rama (Categoría)
export class InventoryCategory implements IInventoryNode {
  private children: IInventoryNode[] = []

  constructor(private name: string) {}

  getName(): string {
    return this.name
  }

  add(node: IInventoryNode): void {
    this.children.push(node)
  }

  remove(node: IInventoryNode): void {
    const index = this.children.indexOf(node)
    if (index > -1) {
      this.children.splice(index, 1)
    }
  }

  getStock(): number {
    return this.children.reduce((total, child) => total + child.getStock(), 0)
  }

  getChildren(): IInventoryNode[] {
    return this.children
  }
}

// Construcción de árbol
const furniture = new InventoryCategory('Furniture')

const tables = new InventoryCategory('Tables')
tables.add(new InventoryItem('Round Table', 5))
tables.add(new InventoryItem('Square Table', 3))

const chairs = new InventoryCategory('Chairs')
chairs.add(new InventoryItem('Wooden Chair', 12))
chairs.add(new InventoryItem('Metal Chair', 8))

furniture.add(tables)
furniture.add(chairs)

// Usar de manera uniforme
console.log(furniture.getName()) // "Furniture"
console.log(furniture.getStock()) // 28 (total de todos los items)

// Búsqueda recursiva
function displayInventoryTree(node: IInventoryNode, indent: string = ''): void {
  console.log(
    `${indent}${node.getName()} (Stock: ${node.getStock()})`
  )

  if (node instanceof InventoryCategory) {
    node.getChildren().forEach((child) => {
      displayInventoryTree(child, indent + '  ')
    })
  }
}

displayInventoryTree(furniture)
// Output:
// Furniture (Stock: 28)
//   Tables (Stock: 8)
//     Round Table (Stock: 5)
//     Square Table (Stock: 3)
//   Chairs (Stock: 20)
//     Wooden Chair (Stock: 12)
//     Metal Chair (Stock: 8)
```

**Análisis:**
- ✅ Estructura jerárquica natural del inventario
- ✅ Permite calcular totales de manera recursiva
- ✅ Facilita operaciones uniformes en el árbol

### 📝 Implementación Completa (Propuesta)

Composite para gestión de permisos jerárquicos:

```typescript
// backend/app/domain/permissions/PermissionNode.ts
export interface IPermission {
  getName(): string
  hasPermission(action: string): boolean
  getDescription(): string
}

// Hoja (Permiso simple)
export class SimplePermission implements IPermission {
  constructor(
    private name: string,
    private action: string,
    private description: string
  ) {}

  getName(): string {
    return this.name
  }

  getDescription(): string {
    return this.description
  }

  hasPermission(action: string): boolean {
    return this.action === action
  }
}

// Rama (Rol con permisos)
export class Role implements IPermission {
  private permissions: IPermission[] = []

  constructor(
    private name: string,
    private description: string
  ) {}

  getName(): string {
    return this.name
  }

  getDescription(): string {
    return this.description
  }

  addPermission(permission: IPermission): void {
    this.permissions.push(permission)
  }

  removePermission(permission: IPermission): void {
    const index = this.permissions.indexOf(permission)
    if (index > -1) {
      this.permissions.splice(index, 1)
    }
  }

  hasPermission(action: string): boolean {
    return this.permissions.some((p) => p.hasPermission(action))
  }

  getPermissions(): IPermission[] {
    return this.permissions
  }
}

// Rama (Rol superior con subroles)
export class SuperRole implements IPermission {
  private childRoles: Role[] = []

  constructor(
    private name: string,
    private description: string
  ) {}

  getName(): string {
    return this.name
  }

  getDescription(): string {
    return this.description
  }

  addRole(role: Role): void {
    this.childRoles.push(role)
  }

  hasPermission(action: string): boolean {
    return this.childRoles.some((role) => role.hasPermission(action))
  }

  getChildRoles(): Role[] {
    return this.childRoles
  }
}

// Uso
const adminRole = new Role('Admin', 'Administrator with full access')
adminRole.addPermission(new SimplePermission('Create Users', 'users.create', 'Can create new users'))
adminRole.addPermission(new SimplePermission('Delete Users', 'users.delete', 'Can delete users'))
adminRole.addPermission(new SimplePermission('Create Events', 'events.create', 'Can create events'))

const managerRole = new Role('Manager', 'Event manager')
managerRole.addPermission(new SimplePermission('Create Events', 'events.create', 'Can create events'))
managerRole.addPermission(new SimplePermission('Edit Events', 'events.edit', 'Can edit own events'))

const superAdmin = new SuperRole('Super Admin', 'Full system access')
superAdmin.addRole(adminRole)
superAdmin.addRole(managerRole)

console.log(adminRole.hasPermission('users.create')) // true
console.log(superAdmin.hasPermission('events.edit')) // true
```

### 🎯 Casos de Uso en el Proyecto

1. **Estructura de Inventario:** Categorías anidadas con items
2. **Árbol de Permisos:** Roles con subroles
3. **Menús Jerárquicos:** Menús con submenús (para dashboard)
4. **Estructura Organizacional:** Departamentos con subdepartamentos

---

## 4. Decorator

### Definición
**Decorator** permite agregar responsabilidades a un objeto dinámicamente. Proporciona una alternativa flexible a la subclasificación para extender funcionalidad.

### 🔍 Análisis en el Proyecto

#### Patrón Identificado: Decoradores en TypeScript

TypeScript soporta decoradores nativamente, aunque en AdonisJS no se usan ampliamente. Sin embargo, el patrón Decorator es útil para agregar auditoría y caché:

```typescript
// backend/app/decorators/Audited.ts
import { DateTime } from 'luxon'
import AuditLog from '#models/audit_log'
import User from '#models/user'

export function Audited(action: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const user = this.user || args[0]?.auth?.user
      const result = await originalMethod.apply(this, args)

      await AuditLog.create({
        action,
        userId: user?.id,
        recordId: result?.id,
        oldValues: null,
        newValues: JSON.stringify(result),
        timestamp: DateTime.now(),
      })

      return result
    }

    return descriptor
  }
}

// Uso
@inject()
export default class InventoriesController {
  @Audited('inventory.create')
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createInventoryValidator)
    const item = await this.inventoryService.createNewOne(payload, request.user().id)
    return response.created({ message: 'Inventory created', data: { item } })
  }
}
```

#### Decorador más realista - Caché:

```typescript
// backend/app/decorators/Cached.ts
import Redis from '@ioc:Adonis/Addons/Redis'

export function Cached(ttl: number = 300) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    const cacheKey = `${target.constructor.name}:${propertyKey}`

    descriptor.value = async function (...args: any[]) {
      const cachedValue = await Redis.get(`${cacheKey}:${JSON.stringify(args)}`)
      if (cachedValue) {
        return JSON.parse(cachedValue)
      }

      const result = await originalMethod.apply(this, args)
      await Redis.setex(
        `${cacheKey}:${JSON.stringify(args)}`,
        ttl,
        JSON.stringify(result)
      )

      return result
    }

    return descriptor
  }
}

// Uso en servicio
@inject()
export default class InventoryService {
  @Cached(300) // Cache for 5 minutes
  async getGroupedInventory() {
    return await this.inventoryRepository.getGroupedInventory()
  }
}
```

### 📝 Implementación Completa (Propuesta)

Decorator para validación y logging:

```typescript
// backend/app/decorators/ValidateAndLog.ts
import { Logger } from '@adonisjs/core/services/logger'

export function ValidateAndLog(
  logLevel: 'info' | 'debug' | 'warn' | 'error' = 'info'
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    const logger = Logger

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now()

      try {
        logger[logLevel](
          `[${target.constructor.name}.${propertyKey}] Starting execution`,
          { args }
        )

        const result = await originalMethod.apply(this, args)

        const duration = Date.now() - startTime

        logger[logLevel](
          `[${target.constructor.name}.${propertyKey}] Completed in ${duration}ms`,
          { result }
        )

        return result
      } catch (error) {
        const duration = Date.now() - startTime

        logger.error(
          `[${target.constructor.name}.${propertyKey}] Failed after ${duration}ms`,
          { error }
        )

        throw error
      }
    }

    return descriptor
  }
}

// Uso
@inject()
export default class InventoryService {
  @ValidateAndLog('debug')
  async createNewOne(payload: CreateItemInventoryPayload, creator: User['id']) {
    // Implementación
    return result
  }
}
```

### 🎯 Casos de Uso en el Proyecto

1. **Auditoría:** Registrar cambios en entidades
2. **Caché:** Cachear resultados de métodos
3. **Logging:** Registrar entrada/salida de métodos
4. **Autorización:** Verificar permisos antes de ejecutar métodos
5. **Rate Limiting:** Limitar llamadas a métodos

---

## 5. Facade

### Definición
**Facade** proporciona una interfaz unificada y simplificada a un conjunto de interfaces en un subsistema. Facilita el uso de subsistemas complejos.

### 🔍 Análisis en el Proyecto

#### Patrón Identificado: Services como Facades

Los servicios en el backend actúan como facades sobre operaciones complejas:

```typescript
// backend/app/services/clients.service.ts
@inject()
export default class ClientsService {
  constructor(
    private clientRepository: ClientRepository,
    private userService: UsersService,
    private notificationService: NotificationService
  ) {}

  async registerNewClient(payload: CreateClientPayload, admin: User) {
    // Facade que coordina múltiples servicios
    const user = await this.userService.createClientUser(payload)
    const client = await this.clientRepository.create({
      ...payload,
      userId: user.id,
    })

    await this.notificationService.notifyClientCreated(client)

    return client
  }
}
```

### 📝 Implementación Completa (Propuesta)

Facade completa para onboarding de clientes:

```typescript
// backend/app/facades/ClientOnboardingFacade.ts
import ClientsService from '#services/clients'
import UsersService from '#services/users'
import NotificationService from '#services/notifications'
import QuotesService from '#services/quotes'
import { CreateClientPayload } from '#validators/client'
import User from '#models/user'

export interface OnboardingResult {
  success: boolean
  client: any
  user: any
  initialQuote?: any
  message: string
}

@inject()
export default class ClientOnboardingFacade {
  constructor(
    private clientsService: ClientsService,
    private usersService: UsersService,
    private notificationService: NotificationService,
    private quotesService: QuotesService
  ) {}

  /**
   * Facade simplificada para onboarding completo:
   * 1. Crear usuario
   * 2. Crear cliente
   * 3. Crear cotización inicial
   * 4. Enviar bienvenida
   */
  async onboardClient(
    payload: CreateClientPayload,
    createdBy: User['id']
  ): Promise<OnboardingResult> {
    try {
      // Paso 1: Crear usuario
      const user = await this.usersService.createClientUser({
        email: payload.email,
        password: payload.initialPassword || this.generateTempPassword(),
        name: payload.name,
      })

      // Paso 2: Crear cliente
      const client = await this.clientsService.createClient({
        ...payload,
        userId: user.id,
        createdBy,
      })

      // Paso 3: Crear cotización inicial de bienvenida
      let initialQuote = null
      if (payload.createInitialQuote) {
        initialQuote = await this.quotesService.createWelcomeQuote(client.id)
      }

      // Paso 4: Enviar notificación de bienvenida
      await this.notificationService.sendWelcomeEmail(client.email, client.name)

      return {
        success: true,
        client,
        user,
        initialQuote,
        message: `Cliente ${client.name} agregado exitosamente`,
      }
    } catch (error) {
      return {
        success: false,
        client: null,
        user: null,
        message: `Error durante onboarding: ${error.message}`,
      }
    }
  }

  /**
   * Facade para actualizar perfil completo del cliente
   */
  async updateClientProfile(
    clientId: string,
    updates: Partial<CreateClientPayload>,
    updatedBy: User['id']
  ): Promise<OnboardingResult> {
    try {
      const client = await this.clientsService.updateClient(clientId, updates)

      // Si cambió el email, actualizar usuario
      if (updates.email) {
        await this.usersService.updateEmail(client.userId, updates.email)
      }

      // Notificar cambios
      await this.notificationService.notifyClientUpdated(client)

      return {
        success: true,
        client,
        user: null,
        message: 'Perfil actualizado exitosamente',
      }
    } catch (error) {
      return {
        success: false,
        client: null,
        user: null,
        message: `Error al actualizar: ${error.message}`,
      }
    }
  }

  private generateTempPassword(): string {
    return Math.random().toString(36).slice(-10)
  }
}

// Uso en controller
@inject()
export default class ClientsController {
  constructor(private onboardingFacade: ClientOnboardingFacade) {}

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createClientValidator)

    const result = await this.onboardingFacade.onboardClient(
      payload,
      request.user().id
    )

    if (!result.success) {
      return response.badRequest({
        message: result.message,
      })
    }

    return response.created({
      message: result.message,
      data: {
        client: result.client,
        user: result.user,
        initialQuote: result.initialQuote,
      },
    })
  }
}
```

### 🎯 Casos de Uso en el Proyecto

1. **Onboarding de Clientes:** Crear usuario + cliente + cotización inicial
2. **Creación de Eventos:** Crear evento + reservar lugar + enviar invitaciones
3. **Procesar Pagos:** Validar pago + actualizar estado + emitir factura
4. **Gestión de Inventario:** Agregar item + actualizar stock + registrar auditoría

---

## 6. Flyweight

### Definición
**Flyweight** reduce el uso de memoria compartiendo datos comunes entre múltiples objetos similares. Útil cuando tienes muchos objetos pequeños.

### 🔍 Análisis en el Proyecto

#### Patrón Identificado: Estilos Tailwind Compartidos

En Angular y React, los estilos Tailwind se repiten en muchos componentes. Podrían ser compartidos:

```typescript
// dashboard-lirio/src/app/shared/factories/css-class.factory.ts
interface CSSClass {
  name: string
  classes: string
}

export class CSSClassFactory {
  private static pool = new Map<string, CSSClass>()

  static register(name: string, classes: string): void {
    if (!this.pool.has(name)) {
      this.pool.set(name, { name, classes })
    }
  }

  static get(name: string): string {
    const css = this.pool.get(name)
    if (!css) {
      throw new Error(`CSS class "${name}" not found`)
    }
    return css.classes
  }

  static list(): string[] {
    return Array.from(this.pool.keys())
  }
}

// Registrar estilos comunes
CSSClassFactory.register(
  'btn-primary',
  'tw-bg-green-600 tw-text-white tw-px-4 tw-py-2 tw-rounded tw-hover:bg-green-700'
)

CSSClassFactory.register(
  'btn-secondary',
  'tw-bg-gray-200 tw-text-gray-700 tw-px-4 tw-py-2 tw-rounded tw-hover:bg-gray-300'
)

CSSClassFactory.register(
  'card-base',
  'tw-bg-white tw-rounded-lg tw-shadow tw-p-4'
)

CSSClassFactory.register(
  'input-base',
  'tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-focus:outline-none tw-focus:ring tw-focus:ring-green-500'
)

// Uso en componentes
@Component({
  template: `
    <button [class]="buttonClass">Guardar</button>
    <div [class]="cardClass">
      <input [class]="inputClass" />
    </div>
  `,
})
export class MyComponent {
  buttonClass = CSSClassFactory.get('btn-primary')
  cardClass = CSSClassFactory.get('card-base')
  inputClass = CSSClassFactory.get('input-base')
}
```

### 📝 Implementación Completa (Propuesta)

Flyweight para iconos SVG compartidos:

```typescript
// dashboard-lirio/src/app/shared/factories/icon.factory.ts
interface IconDefinition {
  name: string
  svg: string
  size?: 'sm' | 'md' | 'lg'
}

@Injectable({ providedIn: 'root' })
export class IconFactory {
  private pool = new Map<string, IconDefinition>()

  constructor() {
    this.initializeCommonIcons()
  }

  private initializeCommonIcons(): void {
    this.register('home', `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    `)

    this.register('settings', `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14,12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l1.72-1.34c.15-.12.19-.34.09-.51l-1.63-2.83c-.12-.22-.39-.3-.61-.22l-2.03.81c-.42-.32-.86-.58-1.35-.78L14.4,2.7c0-.25-.2-.44-.44-.44h-3.27c-.24,0-.44.19-.44.44L9.7,4.95c-.48.2-.93.47-1.35.78l-2.03-.81c-.22-.09-.49,0-.61.22L2.07,8.97c-.1.17-.05.39.09.51l1.72,1.34c-.05.3-.07.62-.07.94s.02.64.07.94l-1.72,1.34c-.15.12-.19.34-.09.51l1.63,2.83c.12.22.39.3.61.22l2.03-.81c.42.32.86.58,1.35.78l.32,2.25c0,.25.2.44.44.44h3.27c.24,0,.44-.19.44-.44l.32-2.25c.48-.2.93-.47,1.35-.78l2.03.81c.22.09.49,0,.61-.22l1.63-2.83c.1-.17.06-.39-.09-.51l-1.72-1.34zM12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
      </svg>
    `)

    this.register('delete', `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6,19c0,1.1.9,2,2,2h8c1.1,0,2-.9,2-2V7H6V19zM19,4h-3.5l-1-1h-9l-1,1H5v2h14V4z"/>
      </svg>
    `)

    this.register('edit', `
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3,17.25V21h3.75L17.81,9.94l-3.75-3.75L3,17.25z M20.71,7.04c.39-.39.39-1.02,0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41,0l-1.83,1.83l3.75,3.75L20.71,7.04z"/>
      </svg>
    `)
  }

  register(name: string, svg: string, size: 'sm' | 'md' | 'lg' = 'md'): void {
    this.pool.set(name, { name, svg, size })
  }

  get(name: string): IconDefinition | null {
    return this.pool.get(name) || null
  }

  getAll(): Map<string, IconDefinition> {
    return new Map(this.pool)
  }
}

// Componente que usa el factory
@Component({
  selector: 'app-icon',
  template: `
    <span [innerHTML]="iconSvg | sanitizeHtml" [class]="sizeClass"></span>
  `,
  inputs: ['name', 'size'],
})
export class IconComponent {
  name = input.required<string>()
  size = input<'sm' | 'md' | 'lg'>('md')

  private iconFactory = inject(IconFactory)

  iconSvg = computed(() => {
    const icon = this.iconFactory.get(this.name())
    return icon?.svg || ''
  })

  sizeClass = computed(() => {
    const s = this.size()
    return {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    }[s]
  })
}

// Uso
@Component({
  template: `
    <app-icon name="home" size="md" />
    <app-icon name="settings" size="lg" />
    <app-icon name="delete" size="sm" />
  `,
})
export class MyComponent {}
```

### 🎯 Casos de Uso en el Proyecto

1. **Iconos SVG:** Compartir definiciones de iconos
2. **Estilos Tailwind:** Reutilizar clases CSS comunes
3. **Colores y Temas:** Compartir paleta de colores
4. **Validadores:** Reutilizar patrones de validación
5. **Mensajes de Error:** Compartir mensajes estándar

---

## 7. Proxy

### Definición
**Proxy** proporciona un sustituto o placeholder para otro objeto para controlar el acceso a él. Útil para agregar funcionalidad como lazy loading, caché, autorización.

### 🔍 Análisis en el Proyecto

#### Patrón Identificado: Servicios con Caché

Los servicios que cachean respuestas actúan como proxies:

```typescript
// backend/app/services/places.service.ts (Propuesta)
@inject()
export default class PlacesService {
  constructor(
    private placesRepository: PlacesRepository,
    private cacheManager: CacheManager
  ) {}

  async getPlaces() {
    // Proxy que cachea el resultado
    const cached = await this.cacheManager.get('places:all')
    if (cached) {
      return cached
    }

    const places = await this.placesRepository.getAll()
    await this.cacheManager.set('places:all', places, 300)
    return places
  }
}
```

### 📝 Implementación Completa (Propuesta)

Proxy para lazy loading de datos relacionados:

```typescript
// backend/app/proxies/LazyLoadProxy.ts
export class LazyLoadProxy<T> {
  private data: T | null = null
  private loaded = false

  constructor(
    private loader: () => Promise<T>,
    private cache: boolean = false
  ) {}

  async getData(): Promise<T> {
    if (this.loaded && this.cache) {
      return this.data!
    }

    this.data = await this.loader()
    this.loaded = true
    return this.data!
  }

  async reload(): Promise<T> {
    this.loaded = false
    this.data = null
    return this.getData()
  }
}

// Uso
@inject()
export default class EventsService {
  async getEventWithDetails(eventId: string) {
    const event = await this.eventsRepository.getById(eventId)

    // Crear proxies para datos relacionados
    const attachmentsProxy = new LazyLoadProxy(
      () => this.attachmentService.getByEventId(eventId),
      true
    )

    const quotesProxy = new LazyLoadProxy(
      () => this.quotesService.getByEventId(eventId),
      true
    )

    return {
      ...event,
      getAttachments: () => attachmentsProxy.getData(),
      getQuotes: () => quotesProxy.getData(),
      reloadAttachments: () => attachmentsProxy.reload(),
    }
  }
}
```

Proxy para control de acceso:

```typescript
// backend/app/proxies/PermissionProxy.ts
import User from '#models/user'

export class PermissionProxy<T> {
  constructor(
    private target: T,
    private user: User,
    private requiredRole: string
  ) {}

  async execute(methodName: keyof T, ...args: any[]): Promise<any> {
    // Verificar permiso antes de ejecutar
    if (!this.user.roles.map((r) => r.name).includes(this.requiredRole)) {
      throw new Error(`User does not have role: ${this.requiredRole}`)
    }

    const method = this.target[methodName] as Function
    return await method.apply(this.target, args)
  }
}

// Uso en controller
@inject()
export default class AdminController {
  async deleteUser({ params, request, response }: HttpContext) {
    const user = request.user()
    const userService = new PermissionProxy(
      this.userService,
      user,
      'admin'
    )

    try {
      await userService.execute('deleteUser', params.id)
      return response.ok({ message: 'Usuario eliminado' })
    } catch (error) {
      return response.forbidden({ message: error.message })
    }
  }
}
```

Proxy para instrumentación y logging:

```typescript
// backend/app/proxies/InstrumentationProxy.ts
import { Logger } from '@adonisjs/core/services/logger'

export class InstrumentationProxy<T> {
  constructor(
    private target: T,
    private logger: typeof Logger
  ) {}

  createProxy(): T {
    return new Proxy(this.target, {
      apply: (target: any, thisArg: any, args: any[]) => {
        const startTime = Date.now()
        this.logger.debug(`Method called with args:`, args)

        try {
          const result = target.apply(thisArg, args)

          const duration = Date.now() - startTime
          this.logger.debug(`Method completed in ${duration}ms`, { result })

          return result
        } catch (error) {
          const duration = Date.now() - startTime
          this.logger.error(`Method failed after ${duration}ms:`, error)
          throw error
        }
      },
    }) as T
  }
}
```

### 🎯 Casos de Uso en el Proyecto

1. **Caché:** Proxies para cachear resultados de API
2. **Lazy Loading:** Cargar datos bajo demanda
3. **Autorización:** Verificar permisos antes de ejecutar métodos
4. **Logging:** Instrumentar métodos para debugging
5. **Rate Limiting:** Controlar acceso a recursos limitados

---

---

# Matriz de Aplicación

## Tabla Resumen

| Patrón | Tipo | Aplicación Actual | Propuesta de Mejora | Complejidad | Impacto |
|--------|------|-------------------|-------------------|-------------|---------|
| **Factory Method** | Creacional | ✅ Repositorios Inventory | Dual DB support (PG/Mongo) | Media | Alto |
| **Abstract Factory** | Creacional | ⚠️ Componentes UI Angular | Familias temáticas (light/dark) | Alta | Medio |
| **Builder** | Creacional | ✅ Lucid Query Builder | Reportes personalizables | Media | Medio |
| **Prototype** | Creacional | ⚠️ Formularios Angular | FormPrototypeService centralizado | Baja | Bajo |
| **Singleton** | Creacional | ✅ Angular Services | CacheManager, AuthManager | Baja | Alto |
| **Adapter** | Estructural | ✅ Services como adaptadores | Payment Gateways, File Conversion | Media | Medio |
| **Bridge** | Estructural | ⚠️ Notificaciones simples | Multicanal (Email/SMS/Push/WhatsApp) | Alta | Medio |
| **Composite** | Estructural | ⚠️ Inventario plano | Jerarquía de categorías | Media | Alto |
| **Decorator** | Estructural | ⚠️ No utilizado | Auditoría, Caché, Logging | Media | Medio |
| **Facade** | Estructural | ✅ Servicios complejos | Onboarding Cliente completo | Baja | Alto |
| **Flyweight** | Estructural | ⚠️ Estilos repetidos | IconFactory, CSSClassFactory | Baja | Bajo |
| **Proxy** | Estructural | ✅ HTTP Interceptor | Caché, Lazy Loading, Autorización | Media | Medio |

---

## Recomendaciones de Priorización

### 🔴 Crítico (Implementar primero)
1. **Composite para Inventario:** Permitirá categorías jerárquicas
2. **Bridge para Notificaciones:** Separar abstracción de implementación
3. **Decorator para Auditoría:** Registrar cambios sin modificar código existente

### 🟡 Importante (Implementar luego)
1. **Abstract Factory para UI:** Facilitar cambios de tema
2. **Builder para Reportes:** Reportes más flexibles
3. **Proxy para Caché:** Mejorar rendimiento

### 🟢 Opcional (Considerar)
1. **Prototype para Formularios:** Reducir código duplicado
2. **Flyweight para Iconos:** Optimizar memoria
3. **Factory Method avanzado:** Soporte multi-BD

---

## Conclusión

Este análisis demuestra cómo los patrones de diseño están presentes en la mayoría de proyectos de software, ya sea de forma implícita (como en Angular) o explícita. El proyecto **elroble-system** tiene una buena base arquitectónica y se beneficiaría significativamente de:

1. **Implementar Composite** para manejar jerarquías en inventario
2. **Implementar Bridge** para notificaciones multicanal
3. **Implementar Decorator** para auditoría centralizada
4. **Mejorar Abstract Factory** para temas visuales
5. **Crear Facades** más robustas para operaciones complejas

Cada implementación debe evaluarse en términos de su ROI (retorno sobre inversión) en el contexto específico del proyecto.

---

**Fin del documento**

*Actualizado: 2026-03-20*  
*Análisis: Patrones de Diseño en elroble-system (rama front-j)*
