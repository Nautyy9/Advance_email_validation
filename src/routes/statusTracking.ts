import express from "express"

const router = express.Router()

// Endpoint to receive webhook events these works with the third party services like emailjs(which currently having bundling issue) or other like mailgun which have a subscription to track down the status
// which then will send the notification to the webhook about the status
router.post("/", (req, res) => {
  const event = req.body

  // Process the webhook event
  switch (event.event) {
    case "delivered":
      return res.status(200).send(`Email to ${event.email} was delivered.`)
    case "open":
      return res.status(200).send(`Email to ${event.email} was opened.`)
    case "bounce":
      return res.status(200).send(`Email to ${event.email} bounced.`)
    default:
      res.status(206).send(`Unhandled event: ${event.event}`)
  }

  res.status(200).send("Webhook received")
})

export { router }
