import { createTransport } from "nodemailer"
import emailTemplate from "./emailTemplate.js"
import config from "../config.js"

const transporter = createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: config.email.user,
    pass: config.email.key,
  },
})

const sendMail = async (subject, receiver, callback) => {
  const mailOptions = {
    from: `My Wishlist <${config.email.user}>`,
    to: receiver,
    subject: subject,
    text: emailTemplate(),
  }

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      callback(error)
    } else {
      callback(null)
    }
  })
}

export default sendMail
