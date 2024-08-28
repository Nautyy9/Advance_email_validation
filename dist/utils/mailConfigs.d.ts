import nodemailer from "nodemailer";
declare const smtpTransporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
declare const popTransporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
export { smtpTransporter, popTransporter };
