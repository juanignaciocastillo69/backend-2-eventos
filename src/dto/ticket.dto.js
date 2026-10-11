const toEventSummary = (event) => {
  if (event.title === undefined) return event.toString();
  return {
    id: event._id.toString(),
    title: event.title,
    date: event.date,
    location: event.location,
  };
};

const toUserSummary = (user) => {
  if (user.email === undefined) return user.toString();
  return {
    id: user._id.toString(),
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };
};

export const toTicketDTO = (ticket) => ({
  id: ticket._id.toString(),
  user: toUserSummary(ticket.user),
  event: toEventSummary(ticket.event),
  status: ticket.status,
  quantity: ticket.quantity,
  reservationCode: ticket.reservationCode,
  createdAt: ticket.createdAt,
  cancelledAt: ticket.cancelledAt,
});
