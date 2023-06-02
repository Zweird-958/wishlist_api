import multer from "multer"
import { prisma } from "../../app.js"
import auth from "../middlewares/auth.js"
import fetchWish from "../middlewares/fetchWish.js"
import uploadToImgur from "../middlewares/uploadToImgur.js"

const upload = multer()

const wishRoutes = (app) => {
  app.post(
    "/wish",
    auth,
    upload.single("image"),
    uploadToImgur,
    async (req, res) => {
      const { user, body, link } = req
      const { name, price, currency } = body

      try {
        const wish = await prisma.wish.create({
          data: {
            name,
            image: link,
            price: Number(price),
            currency,
            userId: user.id,
          },
        })

        res.send({ result: wish })
      } catch (error) {
        console.log(error)

        res.status(500).send({ error: "Something wrong." })
      }
    }
  )

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
