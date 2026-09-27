import { generateToken } from '../utils/jwt.js';
export const getSessions = (req, res) => {
  res.json({ status: 'success', message: 'Sessions endpoint - por implementar' });
};

export const register = (req, res) => {
  const newUser = req.user;
  res.status(201).json({
    status: 'success',
    payload: {
      id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      role: newUser.role,
    },
  });
};

export const login = (req, res) => {
  const user = req.user;
  const token = generateToken({ id: user._id, email: user.email, role: user.role });

  res.cookie('currentUser', token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 3600000,
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({ status: 'success', message: 'Login correcto' });
};

export const current = (req, res) => {
  const { id, email, role } = req.user;
  res.status(200).json({ status: 'success', payload: { id, email, role } });
};

export const logout = (req, res) => {
  res.clearCookie('currentUser');
  res.status(200).json({ status: 'success', message: 'Sesión cerrada' });
};