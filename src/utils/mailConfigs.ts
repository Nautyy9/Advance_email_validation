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
// custom fallback to another server
smtpTransporter.sendMail = () => {
  return Promise.reject(new Error("Forced failure for testing fallback"))
}

const popTransporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  auth: {
    user: "project.2",
    pass: "secret.2",
  },
})

export { smtpTransporter, popTransporter }
