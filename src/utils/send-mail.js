require('../../config/config')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERID,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendWelcomeEmail = async (user) => {
  await transporter.sendMail({
    to: user.email,
    subject: 'Welcome to DebtSquare',
    html: `Hello<b> ${user.firstName} ${user.lastName},</b><br><br><br>
    <b>Your account has been successfully created.</b><br><br>
    Now just login into your account and clear your Debts :)<br><br><br><br><br><br>
    <b>Regards,<br>DebeSquare Team</b>
    `
  })
}

module.exports = { sendWelcomeEmail }