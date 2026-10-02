import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendTicketConfirmationEmail = async (to, eventTitle) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: `Confirmación de inscripción: ${eventTitle}`,
    text: `¡Listo! Tu inscripción al evento "${eventTitle}" fue confirmada.`,
    html: `<p>¡Listo! Tu inscripción al evento <strong>${eventTitle}</strong> fue confirmada.</p>`,
  });
};