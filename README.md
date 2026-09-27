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

El sistema define tres roles, guardados en el campo `role` del modelo `User`:

- **`user`** (rol por defecto al registrarse): puede consultar eventos publicados.
- **`organizer`**: además de lo anterior, puede crear eventos y modificar/cancelar los eventos que él mismo creó.
- **`admin`**: acceso total — puede modificar cualquier evento (sea o no el creador) y ver el listado completo de usuarios.

El registro público (`POST /api/sessions/register`) siempre asigna `role: "user"` — no existe forma de elegir otro rol desde el body. Para promover a un usuario a `organizer` o `admin`, actualmente se hace de forma manual en la base de datos.

### Matriz de permisos

| Acción | user | organizer | admin |
|---|---|---|---|
| Consultar eventos publicados | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar/cancelar eventos propios | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |

### 401 vs 403 — la diferencia

- **401 (No autenticado)**: no hay cookie de sesión válida, o el token es inválido/expirado. La API no sabe quién sos.
- **403 (Sin permisos)**: la API sabe perfectamente quién sos (tu sesión es válida), pero tu rol, o el hecho de no ser el dueño del recurso, no te habilita a hacer esa acción puntual.

Ambos casos usan middlewares separados y reutilizables:
- `handlePassportAuth('current')` (en `passport.config.js`) responde 401 si no hay sesión.
- `authorize(rolesPermitidos)` (en `middlewares/authorize.middleware.js`) responde 403 si el rol no está en la lista permitida.
- La validación de "propiedad del recurso" (dueño vs. no dueño) vive en `services/events.service.js`, y también responde 403 cuando corresponde.

## Rutas disponibles

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | /api/health | Público | Verifica que el servidor esté activo |
| POST | /api/sessions/register | Público | Registra un nuevo usuario (rol `user` por defecto) |
| POST | /api/sessions/login | Público | Inicia sesión, setea la cookie `currentUser` |
| GET | /api/sessions/current | Autenticado | Devuelve el usuario logueado |
| POST | /api/sessions/logout | Público | Cierra la sesión |
| GET | /api/events | Público | Lista de eventos |
| POST | /api/events | organizer, admin | Crea un evento (el organizer se asigna automáticamente) |
| PUT | /api/events/:id | Dueño del evento, o admin | Modifica un evento |
| GET | /api/users | admin | Lista todos los usuarios (sin contraseñas) |

## Ejemplos de request/response

`POST /api/events` con rol `user` → 403:
\`\`\`json
{ "status": "error", "message": "No tenés permisos para realizar esta acción" }
\`\`\`

`POST /api/events` con rol `organizer` o `admin` → 201:
\`\`\`json
{ "status": "success", "payload": { "id": "...", "title": "Congreso Tech 2026", "organizer": "..." } }
\`\`\`

Ruta privada sin cookie → 401:
\`\`\`json
{ "status": "error", "message": "No autenticado" }
\`\`\`

`PUT /api/events/:id` sobre un evento ajeno (siendo `organizer`, no `admin`) → 403:
\`\`\`json
{ "status": "error", "message": "No podés modificar un evento que no te pertenece" }
\`\`\`