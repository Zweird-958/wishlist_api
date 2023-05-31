import { prisma } from "../../app.js"
import auth from "../middlewares/auth.js"
import { Currency } from "@prisma/client"
import fetchWish from "../middlewares/fetchWish.js"
import upload from "../middlewares/upload.js"

const wishRoutes = (app) => {
  app.post("/wish", auth, upload.single("/image"), async (req, res) => {
    const { user, body, file } = req
    const { name, price, currency } = body

    try {
      const wish = await prisma.wish.create({
        data: {
          name,
          image: file.filename,
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

  app.get("/wish", auth, async (req, res) => {
    const { user } = req

    try {
      const wishes = await prisma.wish.findMany({
        where: {
          userId: user.id,
        },
      })

      res.send({ result: wishes })
    } catch (error) {
      console.error(error)

      res.status(500).send({ error: "Something wrong." })
    }
  })
}

export default wishRoutes
