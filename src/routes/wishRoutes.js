import { prisma } from "../../app.js"
import auth from "../middlewares/auth.js"
import { Currency } from "@prisma/client"

const wishRoutes = (app) => {
  app.post("/wish", auth, async (req, res) => {
    const { user, body } = req
    const { name, image, price, currency } = body

    try {
      const wish = await prisma.wish.create({
        data: {
          name,
          image,
          price,
          currency: Currency[currency],
          userId: user.id,
        },
      })

      res.send({ result: wish })
    } catch (error) {
      console.log(error)

      res.status(500).send({ error: "Something wrong." })
    }
  })
}

export default wishRoutes
