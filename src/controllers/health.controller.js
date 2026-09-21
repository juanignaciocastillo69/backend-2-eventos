export const getHealth = (req, res) => {
  res.json({ status: 'ok', message: 'Servidor activo' });
};