import { prisma } from "../../app.js"
import auth from "../middlewares/auth.js"
import { Currency } from "@prisma/client"
import fetchWish from "../middlewares/fetchWish.js"

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

  app.delete(`/wish/:wishId`, auth, fetchWish, async (req, res) => {
    const { wish } = req

    try {
      await prisma.wish.delete({
        where: {
          id: wish.id,
        },
      })

      res.send({ result: wish })
    } catch (error) {
      console.error(error)

      res.status(500).send({ error: "Something wrong." })
    }
  })

  app.get("/wish/:wishId", auth, fetchWish, async (req, res) => {
    const { wish } = req

    res.send({ result: wish })
  })
}

export default wishRoutes
