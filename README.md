# Plataforma de Eventos e Inscripciones - API

API REST para gestionar eventos e inscripciones: los usuarios se registran, los organizadores publican eventos y los usuarios se inscriben con control de cupos y email de confirmación. Proyecto final del curso Backend II de CoderHouse.

## Tecnologías

- Node.js y Express
- MongoDB con Mongoose
- Passport.js (passport-local y passport-jwt)
- JWT en cookie httpOnly, bcrypt, cookie-parser
- Nodemailer, dotenv

## Instalación

```bash
git clone <URL-de-tu-repositorio>
cd backend-2
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz tomando como referencia `.env.example`:

```
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
```

`MAIL_USER` es una cuenta de Gmail y `MAIL_PASS` una "contraseña de aplicación" generada desde la seguridad de esa cuenta (no la contraseña normal). El archivo `.env` nunca se sube al repositorio.

## Cómo ejecutar

```bash
node src/server.js
```

## Arquitectura en capas

Flujo de un request: routes → middlewares (autenticación y autorización) → controller → service → repository → DAO → modelo. Las respuestas pasan por un DTO y los errores llegan a un middleware centralizado.

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Routes | routes/ | Definen las rutas y encadenan los middlewares. |
| Middlewares | middlewares/ | Autenticación con Passport (401), autorización por rol (403) y manejo centralizado de errores. |
| Controllers | controllers/ | Extraen datos del request, llaman al service y responden. No tienen lógica de negocio ni importan modelos. |
| Services | services/ | Lógica de negocio: validaciones, cupos, estados, propiedad de recursos y envío de email. |
| Repositories | repositories/ | Métodos orientados al dominio sobre el DAO (por ejemplo countActiveTickets y cancelTicket). |
| DAO | dao/ | Único lugar donde se importan los modelos de Mongoose. |
| DTO | dto/ | Definen qué campos salen en cada respuesta de usuario, evento y ticket. Nunca exponen password. |
| Models | models/ | Esquemas de Mongoose. |
| Config y utils | config/, utils/ | Conexión a la base, estrategias de Passport, JWT, hash y envío de mails. |

## Autenticación

La autenticación se centraliza en `src/config/passport.config.js` con tres estrategias:

- `register` (passport-local): valida los datos, normaliza el email, hashea la contraseña con bcrypt y crea el usuario con rol `user`.
- `login` (passport-local): busca el usuario por email y compara la contraseña con bcrypt.
- `current` (passport-jwt): lee el JWT de la cookie `currentUser` y expone el usuario en `req.user`.

El controller de login genera el JWT (payload con `id`, `email` y `role`) y lo guarda en la cookie `currentUser` con `httpOnly`. Ninguna respuesta incluye la contraseña. Agregar un proveedor externo (Google, GitHub) consiste en sumar una estrategia en `passport.config.js`, sin tocar `app.js`.

Flujo: registro → login (se setea la cookie) → `/api/sessions/current` → logout (se borra la cookie) → `/current` responde 401.

## Roles y permisos

| Acción | user | organizer | admin |
|---|---|---|---|
| Consultar eventos | ✅ | ✅ | ✅ |
| Inscribirse a un evento | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar o cancelar eventos propios | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Ver inscripciones de un evento | ❌ | Solo de sus eventos | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |

- **401:** no hay sesión válida (sin cookie, token inválido o vencido).
- **403:** hay sesión válida, pero el rol o la propiedad del recurso no alcanzan.

El registro público siempre crea usuarios con rol `user` y no acepta `role` en el body.

## Usuarios de prueba

Se crean con `POST /api/sessions/register` y quedan con rol `user`. Para probar los otros roles, cambiar el campo `role` del usuario a `organizer` o `admin` directamente en la base (por ejemplo desde MongoDB Atlas, Data Explorer, colección `users`) y volver a hacer login para obtener un token nuevo.

## Eventos

Campos: `title`, `description`, `category`, `date`, `location`, `capacity`, `price`, `status` y `organizer` (referencia a `User`, se asigna desde la sesión y no puede venir del body).

- `status` acepta solo `draft`, `published`, `cancelled` y `finished`. Un evento nuevo nace en `draft`.
- No se puede crear un evento con fecha pasada, `capacity` menor o igual a 0 ni `price` negativo.
- Un evento cancelado no puede modificarse. Cancelar es cambiar el estado, no se elimina nada.
- No se puede publicar un evento finalizado o cancelado.

## Tickets e inscripciones

Campos: `user` y `event` (referencias), `status` (`confirmed`, `pending`, `cancelled`), `quantity`, `reservationCode`, `createdAt` y `cancelledAt`.

Al inscribirse el sistema valida, en este orden: que el evento exista, que esté `published`, que la cantidad sea válida, que el usuario no tenga ya una inscripción activa para ese evento y que haya cupo suficiente. Si todo es válido crea el ticket con un `reservationCode` y envía un email de confirmación; si el envío falla, el ticket queda creado igual.

Los cupos ocupados son la suma de `quantity` de los tickets que no están cancelados, así que cancelar un ticket libera el cupo. Los tickets nunca se eliminan.

## Endpoints

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | /api/health | Público | Verifica que el servidor esté activo |
| POST | /api/sessions/register | Público | Registra un usuario (rol `user`) |
| POST | /api/sessions/login | Público | Inicia sesión y setea la cookie |
| GET | /api/sessions/current | Autenticado | Devuelve `id`, `email` y `role` |
| POST | /api/sessions/logout | Público | Borra la cookie |
| GET | /api/users | admin | Lista todos los usuarios |
| GET | /api/events | Público | Lista eventos con filtros, paginación y orden |
| GET | /api/events/:id | Público | Consulta un evento |
| POST | /api/events | organizer, admin | Crea un evento |
| PUT | /api/events/:id | Dueño o admin | Modifica un evento |
| PATCH | /api/events/:id/status | Dueño o admin | Cambia el estado |
| POST | /api/events/:eid/tickets | Autenticado | Inscribirse a un evento |
| GET | /api/events/:eid/tickets | Dueño del evento o admin | Lista las inscripciones del evento |
| GET | /api/tickets/my-tickets | Autenticado | Lista los tickets propios |
| PATCH | /api/tickets/:tid/cancel | Dueño del ticket o admin | Cancela una inscripción |

## Listado de eventos

`GET /api/events` acepta estos parámetros, todos opcionales:

| Parámetro | Ejemplo | Descripción |
|---|---|---|
| status | ?status=published | Filtra por estado |
| category | ?category=workshop | Filtra por categoría |
| location | ?location=Rosario | Filtra por ubicación |
| dateFrom | ?dateFrom=2027-01-01 | Eventos desde esta fecha |
| dateTo | ?dateTo=2027-12-31 | Eventos hasta esta fecha |
| page | ?page=2 | Página (por defecto 1) |
| limit | ?limit=5 | Resultados por página (por defecto 10) |
| sort | ?sort=date o ?sort=-date | Orden (el guion indica descendente) |

Ejemplo: `GET /api/events?status=published&category=workshop&page=1&limit=5`

```json
{
  "status": "success",
  "data": [],
  "page": 1,
  "limit": 5,
  "total": 12,
  "totalPages": 3
}
```

## Manejo de errores

Todos los errores responden con `status: "error"` y un `message`. Los códigos usados son 400 (datos inválidos), 401 (no autenticado), 403 (sin permisos), 404 (no encontrado), 409 (conflicto: email repetido, inscripción duplicada o sin cupo) y 500 (error interno, sin detalles hacia el cliente).

Ejemplos:

```json
{ "status": "error", "message": "No hay cupos suficientes. Disponibles: 28" }
{ "status": "error", "message": "Ya tenés una inscripción activa para este evento" }
{ "status": "error", "message": "No tenés permisos para realizar esta acción" }
{ "status": "error", "message": "No autenticado" }
```