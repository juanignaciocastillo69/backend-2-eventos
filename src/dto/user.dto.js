export const toUserDTO = (user) => ({
  id: user._id.toString(),
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  role: user.role,
});

export const toCurrentUserDTO = ({ id, email, role }) => ({ id, email, role });