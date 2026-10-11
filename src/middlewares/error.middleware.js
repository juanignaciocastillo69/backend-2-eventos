export const notFoundHandler = (req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;

  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'El cuerpo de la request no es un JSON válido';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'El identificador no es válido';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Ya existe un registro con esos datos';
  }

  if (statusCode >= 500) {
    console.error(err);
    message = 'Error interno del servidor';
  }

  res.status(statusCode).json({ status: 'error', message });
};
