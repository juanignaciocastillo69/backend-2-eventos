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
- Nodemailer
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
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
\`\`\`

`MAIL_USER` es una dirección de Gmail propia, y `MAIL_PASS` es una "contraseña de aplicación" generada desde la configuración de seguridad de esa cuenta de Google (no la contraseña normal de la cuenta).

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
└── utils/
    ├── hash.js
    ├── jwt.js
    └── mailer.js
\`\`\`

## Entidad Ticket

Campos: `user` (referencia a `User`), `event` (referencia a `Event`), `status`, `quantity`, `reservationCode`, `createdAt`, `cancelledAt`.

- `status` acepta solo: `confirmed`, `pending`, `cancelled`.
- Los tickets nunca se eliminan físicamente: cancelar cambia `status` a `cancelled` y registra `cancelledAt`.
- Los cupos ocupados de un evento se calculan sumando `quantity` de todos los tickets **no** cancelados — un ticket cancelado libera su cupo automáticamente.
- Un usuario no puede tener más de una inscripción activa para el mismo evento.

## Flujo de inscripción

1. El usuario autenticado hace `POST /api/events/:eid/tickets` con `{ quantity }`.
2. El sistema valida, en este orden: que el evento exista, que esté `published`, que la cantidad sea válida, que el usuario no tenga ya una inscripción activa para ese evento, y que haya cupo suficiente.
3. Si todo es válido, se crea el ticket con un `reservationCode` único y se envía un email de confirmación (si el envío falla, el ticket igual queda creado — el error solo se registra en el servidor).

## Rutas disponibles

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | /api/events/:eid/tickets | Autenticado | Inscribirse a un evento |
| GET | /api/tickets/my-tickets | Autenticado | Lista los tickets propios |
| GET | /api/events/:eid/tickets | Dueño del evento, o admin | Lista las inscripciones de un evento |
| PATCH | /api/tickets/:tid/cancel | Dueño del ticket, o admin | Cancela una inscripción |

## Ejemplos de error

Evento sin cupo suficiente → 400:
\`\`\`json
{ "status": "error", "message": "No hay cupos suficientes. Disponibles: 1" }
\`\`\`

Inscripción duplicada → 400:
\`\`\`json
{ "status": "error", "message": "Ya tenés una inscripción activa para este evento" }
\`\`\`

Cancelar ticket ajeno (sin ser admin) → 403:
\`\`\`json
{ "status": "error", "message": "No podés cancelar un ticket que no te pertenece" }
\`\`\`