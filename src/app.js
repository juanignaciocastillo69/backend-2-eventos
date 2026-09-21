import express from 'express';
import healthRouter from './routes/health.router.js';
import eventsRouter from './routes/events.router.js';
import sessionsRouter from './routes/sessions.router.js';

const app = express();

app.use(express.json());
app.use('/api', healthRouter);
app.use('/api', eventsRouter);
app.use('/api', sessionsRouter);

export default app;