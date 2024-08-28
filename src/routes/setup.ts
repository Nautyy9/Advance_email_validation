import { config } from "dotenv"
config()
import express from "express"
import { popTransporter, smtpTransporter } from "../utils/mailConfigs.ts"
import { RateLimiterRes } from "rate-limiter-flexible"
import { rateLimiter } from "../utils/rateLimiter.ts"
import { dataType } from "../../types.ts"

// import { EmailJSResponseStatus } from "@emailjs/nodejs/cjs/models/EmailJSResponseStatus"
// import emailjs from "@emailjs/browser"
// sib_does have the ts file package to install hence to skip the ts error in the terminal we need to ignore ts transpiling errors
const route = express.Router()
const time = 10 * 1000 // 10 seconds

const data = new Set<dataType>()

function cleanUpKeys() {
  const now = Date.now()
  for (const item of data) {
    if (item.expiresIn <= now) {
      data.delete(item)
    }
  }
}
setInterval(() => {
  cleanUpKeys()
}, 1000)
route.post("/send", async (req, res) => {
  // console.log(req.ip)
  try {
    // rate-limiter
    await rateLimiter.consume(req.ip!)
    // getting the body data from postman or any other api platform
    const { senderEmail, senderName } = req.body.mailer
    const subject = req.body.subject
    const text = req.body.text
    // idempotency check
    for (const item of data) {
      if (item.emailId === senderEmail) {
        return res
          .status(409)
          .send("You email has been sent already . Try again after 10 seconds")
      }
    }
    data.add({ emailId: senderEmail, expiresIn: Date.now() + time })
    try {
      // mail service --> fallback mechanism 1st provider
      const info = await smtpTransporter.sendMail({
        from: " 👻" + senderEmail, // sender address
        sender: senderName, // sender name
        to: process.env.RECIEVER_MAIL, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: "<b>Hello world?</b>", // html body
      })
      console.log("Message sent: %s", info.messageId)
      return res.status(200).json({ data: info })
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    } catch (e) {
      //below cause issue due to multiple responses hence replaced it with just log since it is not needed
      //    res.status(400).json({
      //     data: "Primary provider failed  " + e + "retrying with another server",
      //   })
      console.log(
        "Primary provider failed  " + e + "retrying with another server"
      )

      try {
        // mail service --> fallback mechanism 2nd provider
        const info = await popTransporter.sendMail({
          from: " 👻" + senderEmail, // sender address
          to: process.env.RECIEVER_MAIL, // list of receivers
          subject: subject, // Subject line
          text: text, // plain text body
          html: "<b>Hello world?</b>", // html body
        })
        console.log("Message sent: %s", info.messageId)
        return res.status(200).json({ data: info })
      } catch (e) {
        return res.status(400).json({
          data:
            "Secondary provider has also failed.. Try again after some time  " +
            e,
        })
      }
    }
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      return res
        .status(429)
        .json({ error: "TO MANY REQUEST TRY AGAIN AFTER 60 SECONDS" + error })
    } else {
      return res.status(400).json({ error: "ERROR OCCURED" + error })
    }
  }
})
export { route }
//# sourceMappingURL=setup.js.map
