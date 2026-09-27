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
- (Próximamente: Nodemailer)

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
└── utils/
    ├── hash.js
    └── jwt.js
\`\`\`

## Autenticación con Passport.js

La autenticación se centraliza en `src/config/passport.config.js`, mediante tres estrategias:

- **`register`** (passport-local): valida los datos de registro, normaliza el email, hashea la contraseña y crea el usuario.
- **`login`** (passport-local): busca el usuario por email y compara la contraseña con bcrypt.
- **`current`** (passport-jwt): lee el JWT desde la cookie `currentUser`, valida su firma y expiración, y expone el payload en `req.user`.

Passport se inicializa una sola vez en `app.js` (`passport.initialize()`). Las rutas de sesiones delegan la autenticación en estas estrategias a través de un wrapper (`handlePassportAuth`), y el controller se limita a leer `req.user` y responder — la generación del JWT y el seteo de la cookie siguen ocurriendo en el controller, no en las estrategias.

Esta estructura deja el sistema preparado para sumar nuevas estrategias (por ejemplo, login con Google o GitHub) agregándolas directamente en `passport.config.js`, sin modificar `app.js` ni las rutas existentes.

## Rutas disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/health | Verifica que el servidor esté activo |
| GET | /api/events | Lista de eventos (por ahora vacía) |
| GET | /api/sessions | Endpoint de sesiones (placeholder) |
| POST | /api/sessions/register | Registra un nuevo usuario (estrategia `register`) |
| POST | /api/sessions/login | Inicia sesión y setea la cookie de autenticación (estrategia `login`) |
| GET | /api/sessions/current | Devuelve el usuario autenticado (estrategia `current`) |
| POST | /api/sessions/logout | Cierra la sesión (elimina la cookie; no pasa por Passport) |

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
- `201`: usuario creado
- `400`: faltan campos, o el email/contraseña no cumplen el formato mínimo
- `409`: el email ya está registrado

## Login

`POST /api/sessions/login`

Respuestas posibles:
- `200`: setea la cookie `currentUser` (HttpOnly)
- `401`: credenciales inválidas (mensaje genérico, no distingue la causa)

## Usuario actual

`GET /api/sessions/current`

Requiere la cookie `currentUser`.

Respuestas posibles:
- `200`: devuelve `{ id, email, role }`
- `401`: no hay cookie, o el token es inválido/expirado

## Logout

`POST /api/sessions/logout`

Elimina la cookie `currentUser`. Después de esto, `/api/sessions/current` vuelve a responder `401`.