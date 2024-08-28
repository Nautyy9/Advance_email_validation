import nodemailer from "nodemailer"

const smtpTransporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  // secure: true,
  auth: {
    user: "project.1",
    pass: "secret.1",
  },
})
const popTransporter = nodemailer.createTransport({
  host: "localhost",
  port: 1110,
  // secure: true,
  auth: {
    user: "project.1",
    pass: "secret.1",
  },
})

export { smtpTransporter, popTransporter }
