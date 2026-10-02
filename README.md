# Plataforma de Eventos e Inscripciones - API

API REST para una plataforma de gestión de eventos e inscripciones, desarrollada como proyecto final del curso Backend II de CoderHouse.

## Tecnologías

- Node.js
- Express
- Mongoose (MongoDB)
- bcrypt
- jsonwebtoken
- cookie-parser
- Passport.js (passport-local, passport-jwt)
- dotenv

## Instalación

\`\`\`bash
git clone <URL-de-tu-repositorio>
cd backend-2
npm install
\`\`\`

## Configuración de variables de entorno

Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`:

\`\`\`
PORT=8080
NODE_ENV=development
MONGO_URL=
JWT_SECRET=
JWT_EXPIRES_IN=1h
\`\`\`

## Cómo ejecutar

\`\`\`bash
node src/server.js
\`\`\`

## Estructura de carpetas

\`\`\`
src/
├── app.js
├── server.js
├── env.js
├── config/
│   ├── db.js
│   └── passport.config.js
├── routes/
├── controllers/
├── services/
├── repositories/
├── dao/
├── models/
├── middlewares/
│   ├── auth.middleware.js
│   └── authorize.middleware.js
└── utils/
    ├── hash.js
    └── jwt.js
\`\`\`

## Roles y autorización

- **`user`**: puede consultar eventos publicados.
- **`organizer`**: puede crear eventos y modificar/cancelar los que él mismo creó.
- **`admin`**: acceso total — puede modificar cualquier evento y ver el listado completo de usuarios.

### 401 vs 403

- **401**: no hay sesión válida (sin cookie, o token inválido/expirado).
- **403**: hay sesión válida, pero el rol o la propiedad del recurso no habilitan esa acción.

## Entidad Event

Campos: `title`, `description`, `category`, `date`, `location`, `capacity`, `price`, `status`, `organizer`.

- `organizer` es una referencia (`ObjectId`) al `User` que creó el evento — se asigna automáticamente desde la sesión al crear, nunca viene del body.
- `status` acepta solo: `draft`, `published`, `cancelled`, `finished`. Un evento nuevo nace en `draft`.
- `capacity` debe ser mayor a 0; `price` no puede ser negativo.
- Los eventos nunca se eliminan físicamente: cancelar significa cambiar `status` a `cancelled`.
- Un evento cancelado no puede modificarse de ninguna forma (ni sus datos, ni su estado).
- No se puede publicar un evento que ya está `finished` o `cancelled`.
- No se puede crear un evento con fecha pasada.

## Rutas disponibles

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | /api/health | Público | Verifica que el servidor esté activo |
| POST | /api/sessions/register | Público | Registra un usuario (rol `user` por defecto) |
| POST | /api/sessions/login | Público | Inicia sesión |
| GET | /api/sessions/current | Autenticado | Usuario logueado |
| POST | /api/sessions/logout | Público | Cierra sesión |
| GET | /api/users | admin | Lista todos los usuarios |
| GET | /api/events | Público | Lista eventos, con filtros y paginación |
| GET | /api/events/:id | Público | Consulta un evento puntual |
| POST | /api/events | organizer, admin | Crea un evento |
| PUT | /api/events/:id | Dueño del evento, o admin | Modifica los datos de un evento |
| PATCH | /api/events/:id/status | Dueño del evento, o admin | Cambia el estado de un evento |

## Listado de eventos — filtros, paginación y orden

`GET /api/events` admite estos query params, todos opcionales:

| Parámetro | Ejemplo | Descripción |
|---|---|---|
| `status` | `?status=published` | Filtra por estado exacto |
| `category` | `?category=workshop` | Filtra por categoría exacta |
| `location` | `?location=Rosario` | Filtra por ubicación exacta |
| `dateFrom` | `?dateFrom=2027-01-01` | Eventos a partir de esta fecha |
| `dateTo` | `?dateTo=2027-12-31` | Eventos hasta esta fecha |
| `page` | `?page=2` | Página a mostrar (default: 1) |
| `limit` | `?limit=5` | Resultados por página (default: 10) |
| `sort` | `?sort=date` o `?sort=-date` | Campo de orden (`-` = descendente) |

Ejemplo combinado: `GET /api/events?status=published&category=workshop&page=1&limit=5`

Respuesta:
\`\`\`json
{
  "status": "success",
  "data": [ /* eventos de esta página */ ],
  "page": 1,
  "limit": 5,
  "total": 12,
  "totalPages": 3
}
\`\`\`

## Ejemplos de error

Crear evento con fecha pasada → 400:
\`\`\`json
{ "status": "error", "message": "La fecha del evento no puede ser pasada" }
\`\`\`

Crear evento con `capacity: 0` → 400:
\`\`\`json
{ "status": "error", "message": "La capacidad debe ser mayor a 0" }
\`\`\`

Modificar evento ajeno (sin ser admin) → 403:
\`\`\`json
{ "status": "error", "message": "No podés modificar un evento que no te pertenece" }
\`\`\`

Modificar o cambiar estado de un evento cancelado → 400:
\`\`\`json
{ "status": "error", "message": "No se puede modificar un evento cancelado" }
\`\`\`

Consultar un evento inexistente → 404:
\`\`\`json
{ "status": "error", "message": "Evento no encontrado" }
\`\`\`