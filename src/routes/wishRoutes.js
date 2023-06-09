import multer from "multer"
import { prisma } from "../../app.js"
import auth from "../middlewares/auth.js"
import fetchWish from "../middlewares/fetchWish.js"
import uploadToImgur from "../middlewares/uploadToImgur.js"
import formatWish from "../utils/formatWish.js"

const upload = multer()

const wishRoutes = (app) => {
  app.post(
    "/wish",
    auth,
    upload.single("image"),
    uploadToImgur,
    async (req, res) => {
      const { user, body, image } = req
      const { name, price, currency, link } = body

      try {
        const wish = await prisma.wish.create({
          data: {
            name,
            image,
            price: Number(price),
            link,
            currency,
            userId: user.id,
          },
        })

        res.send({ result: formatWish(wish, req) })
      } catch (error) {
        console.log(error)

        res.status(500).send({ error: req.t("500") })
      }
    }
  )

  app.patch(
    "/wish/:wishId",
    auth,
    fetchWish,
    upload.single("image"),
    uploadToImgur,
    async (req, res) => {
      const { wish, body, image } = req
      const { name, price, currency, link, purchased } = body

      try {
        const updatedWish = await prisma.wish.update({
          where: {
            id: wish.id,
          },
          data: {
            name: name || wish.name,
            price: Number(price) || wish.price,
            currency: currency || wish.currency,
            link: link || wish.link,
            purchased:
              typeof purchased === "boolean" ? purchased : purchased === "true",
            image: image || wish.image,
          },
        })

        res.send({ result: formatWish(updatedWish, req) })
      } catch (error) {
        console.error(error)

        res.status(500).send({ error: req.t("500") })
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

      res.send({ result: formatWish(wish, req) })
    } catch (error) {
      console.error(error)

      res.status(500).send({ error: req.t("500") })
    }
  })

  app.get("/wish/:wishId", auth, fetchWish, async (req, res) => {
    const { wish } = req

    res.send({
      result: formatWish(wish, req),
    })
  })

  app.get("/wish", auth, async (req, res) => {
    const { user } = req

    try {
      const wishes = await prisma.wish.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      })

      const wishesFormatted = wishes.map((wish) => {
        return formatWish(wish, req)
      })

      res.send({ result: wishesFormatted })
    } catch (error) {
      console.error(error)

      res.status(500).send({ error: req.t("500") })
    }
  })
}

export default wishRoutes
