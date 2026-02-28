# Mesa de Partes — Municipalidad de Los Olivos

La **Municipalidad Distrital de Los Olivos** recibe a diario solicitudes en **Mesa de Partes**: licencias de funcionamiento para bodegas y restaurantes, constancias, autorizaciones para eventos vecinales, etc.  
En días de alta demanda (campañas de formalización, ferias o inspecciones), el registro manual se vuelve lento: expedientes duplicados, códigos mal escritos y dificultad para encontrar un trámite.

---

## Objetivo del proyecto
Construir un **CRUD sencillo** en Angular que permita:
- Registrar expedientes (crear)
- Verlos en una lista (leer)
- Actualizarlos (editar)
- Eliminarlos (eliminar)

---

## Alcance
Trabajaremos con **una sola entidad**: `Expediente`.

### Campos del expediente
- `id` (numérico, lo maneja JSON Server)
- `codigo` (autogenerado, formato municipal)
- `tipoDoc` (`DNI` | `RUC`)
- `nroDoc` (DNI 8 dígitos / RUC 11 dígitos)
- `solicitante` (nombre completo o razón social)
- `tramite` (lista fija: “Licencia de Funcionamiento”, “Constancia”, “Autorización de Evento”, etc.)
- `fechaIngreso` (YYYY-MM-DD)
- `estado` (lista fija: “Recibido”, “En evaluación”, “Aprobado”, “Observado”)
- `observacion` (opcional)

---

## Funcionalidades
### 1) Listado de expedientes
- Tabla con expedientes
- Buscador por **código** o **DNI/RUC**
- Botón **“Nuevo expediente”**
- Acciones por fila: **Editar** / **Eliminar**

### 2) Formulario (Crear / Editar)
- Mismo formulario para crear y editar
- Validaciones (ver sección de reglas)

### 3) Eliminar
- Eliminar desde la lista (idealmente con confirmación como mejora opcional)

---

## Autogeneración del código de expediente
Para que el sistema se sienta municipal y real, el **código del expediente se genera automáticamente** al registrar uno nuevo.

### Formato
`E-YYYY-NNNN`

Ejemplos:
- `E-2026-0001`
- `E-2026-0002`
- `E-2026-0123`

### Regla
- El correlativo **incrementa** dentro del mismo año.
- Al cambiar el año, el correlativo vuelve a `0001`.

### Implementación sugerida
Al presionar “Guardar” (crear):
1. Obtener el **último expediente** desde la API ordenado por `id` descendente (`?_sort=id&_order=desc&_limit=1`)
2. Si el último código es del mismo año, sumar +1 a `NNNN`
3. Si no existe o es de otro año, iniciar `0001`
4. Guardar el expediente con el `codigo` generado

---

## Reglas de validación
- `tipoDoc`: obligatorio
- `nroDoc`: obligatorio
  - si `tipoDoc = DNI` → **exactamente 8 dígitos**
  - si `tipoDoc = RUC` → **exactamente 11 dígitos**
- `solicitante`: obligatorio (mínimo 3 caracteres)
- `tramite`: obligatorio (de lista)
- `fechaIngreso`: obligatorio (no vacío)
- `estado`: obligatorio (de lista)
- `observacion`: opcional (máximo 200 caracteres recomendado)

---

## Tecnologías
- **Angular**
- TypeScript
- Angular Router
- Reactive Forms
- HttpClient
- **JSON Server** (API mock con `db.json`)

---

## Requisitos previos
- Node.js (recomendado LTS)
- Angular CLI
- npm

---

## Instalación y ejecución
### 1) Instalar dependencias
```bash
npm install
```

### 2) Levantar la API (JSON Server)
En otra terminal:
```bash
npx json-server --watch db.json --port 3000
```

La API quedará en:
- `http://localhost:3000`

### 3) Levantar Angular
```bash
ng serve -o
```

App en:
- `http://localhost:4200`

---

## Endpoints esperados (JSON Server)
Entidad: `expedientes`

- `GET    /expedientes`
- `GET    /expedientes/:id`
- `POST   /expedientes`
- `PUT    /expedientes/:id`
- `PATCH  /expedientes/:id`
- `DELETE /expedientes/:id`

Consulta útil para el “detalle pro”:
- `GET /expedientes?_sort=id&_order=desc&_limit=1`

---

## Estructura sugerida del proyecto
```
src/app/
  core/
    services/
      expedientes.service.ts
    models/
      expediente.model.ts
  features/
    expedientes/
      pages/
        expedientes-list/
        expediente-form/
      expedientes.routes.ts
  app.routes.ts
```

---

## Criterios de aceptación (checklist)
- [ ] Se puede **crear** un expediente y se guarda en JSON Server.
- [ ] El sistema **autogenera** `codigo` con formato `E-YYYY-NNNN`.
- [ ] Se puede **listar** expedientes y ver sus datos en tabla.
- [ ] Se puede **editar** un expediente existente.
- [ ] Se puede **eliminar** un expediente.
- [ ] El formulario valida DNI/RUC según `tipoDoc`.
- [ ] El listado permite **buscar** por código o número de documento.
