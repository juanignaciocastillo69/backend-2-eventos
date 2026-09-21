# Plataforma de Eventos e Inscripciones - API

API REST para una plataforma de gestión de eventos e inscripciones, desarrollada como proyecto final del curso Backend II de CoderHouse.

## Tecnologías

- Node.js
- Express
- dotenv
- (Próximamente: MongoDB, Mongoose, JWT, Passport, bcrypt, cookie-parser, Nodemailer)

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
\`\`\`

## Cómo ejecutar

\`\`\`bash
node src/server.js
\`\`\`

El servidor levanta en el puerto definido en `PORT` (por defecto 8080 si no se especifica).

## Estructura de carpetas

\`\`\`
src/
├── app.js
├── server.js
├── config/
├── routes/
├── controllers/
├── services/
├── repositories/
├── dao/
├── models/
├── middlewares/
└── utils/
\`\`\`

## Rutas disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/health | Verifica que el servidor esté activo |
| GET | /api/events | Lista de eventos (por ahora vacía) |
| GET | /api/sessions | Endpoint de sesiones (placeholder, sin lógica de autenticación todavía) |