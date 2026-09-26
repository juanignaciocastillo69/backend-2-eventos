# Plataforma de Eventos e Inscripciones - API

API REST para una plataforma de gestión de eventos e inscripciones, desarrollada como proyecto final del curso Backend II de CoderHouse.

## Tecnologías

- Node.js
- Express
- Mongoose (MongoDB)
- bcrypt
- jsonwebtoken
- cookie-parser
- dotenv
- (Próximamente: Passport, Nodemailer)

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

El servidor levanta en el puerto definido en `PORT` (por defecto 8080 si no se especifica), y se conecta a MongoDB usando `MONGO_URL`.

## Estructura de carpetas

\`\`\`
src/
├── app.js
├── server.js
├── config/
│   └── db.js
├── routes/
├── controllers/
├── services/
├── repositories/
├── dao/
├── models/
├── middlewares/
│   └── auth.middleware.js
└── utils/
    ├── hash.js
    └── jwt.js
\`\`\`

## Rutas disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/health | Verifica que el servidor esté activo |
| GET | /api/events | Lista de eventos (por ahora vacía) |
| GET | /api/sessions | Endpoint de sesiones (placeholder) |
| POST | /api/sessions/register | Registra un nuevo usuario |
| POST | /api/sessions/login | Inicia sesión y setea la cookie de autenticación |
| GET | /api/sessions/current | Devuelve el usuario autenticado (requiere cookie válida) |
| POST | /api/sessions/logout | Cierra la sesión (elimina la cookie) |

## Registro de usuarios

`POST /api/sessions/register`

Body esperado (JSON):
\`\`\`json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "ana@mail.com",
  "password": "Secreta123"
}
\`\`\`

Respuestas posibles:
- `201`: usuario creado, devuelve `id`, `first_name`, `last_name`, `email`, `role` (nunca la contraseña)
- `400`: faltan campos obligatorios, o el email/contraseña no cumplen el formato mínimo
- `409`: el email ya está registrado

## Login

`POST /api/sessions/login`

Body esperado (JSON):
\`\`\`json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
\`\`\`

Respuestas posibles:
- `200`: credenciales correctas. Devuelve `{ "status": "success", "message": "Login correcto" }` y setea la cookie `currentUser` (HttpOnly) con un JWT
- `401`: credenciales inválidas (email inexistente o contraseña incorrecta; el mensaje no distingue cuál de las dos)

## Usuario actual

`GET /api/sessions/current`

Requiere la cookie `currentUser` (se obtiene haciendo login previamente).

Respuestas posibles:
- `200`: devuelve `{ "status": "success", "payload": { "id": "...", "email": "...", "role": "..." } }`
- `401`: no hay cookie, o el token es inválido/expirado

## Logout

`POST /api/sessions/logout`

Elimina la cookie `currentUser`. Devuelve `200` con `{ "status": "success", "message": "Sesión cerrada" }`. Después de esto, `/api/sessions/current` vuelve a responder `401`.