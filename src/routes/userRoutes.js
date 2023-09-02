import auth from "../middlewares/auth.js"
import sendMail from "../utils/sendMail.js"

const userRoutes = (app) => {
  app.post("/mail", auth, async (req, res) => {
    const { email } = req.body

    await sendMail("New password", email, (error) => {
      if (error) {
        console.log(error)
        res.status(500).send({ error: req.t("500") })

        return
      } else {
        res.send({ result: "ok" })

        return
      }
    })
  })
}

export default userRoutes
