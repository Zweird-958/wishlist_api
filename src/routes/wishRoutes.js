import multer from "multer"
import { prisma } from "../../app.js"
import auth from "../middlewares/auth.js"
import fetchWish from "../middlewares/fetchWish.js"
import uploadToImgur from "../middlewares/uploadToImgur.js"
import formatWish from "../utils/formatWish.js"
import sendMail from "../utils/sendMail.js"
import getWishlistShared from "../middlewares/getWishlistShared.js"
import getSharedWith from "../middlewares/getSharedWith.js"

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
    },
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
    },
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

  app.post("/share/wish", auth, async (req, res) => {
    const { user, body } = req
    const { username } = body

    if (user.username.toLowerCase() === username.toLowerCase()) {
      res.status(400).send({ error: req.t("addHimSelf") })

      return
    }

    try {
      const { wishlistShared, email } = await prisma.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: "insensitive",
          },
        },
        include: { wishlistShared: true },
      })

      if (wishlistShared.includes(user.id)) {
        res.status(400).send({ error: req.t("alreadyShared") })

        return
      }

      // Add user to wishlistShared
      await prisma.user.update({
        where: {
          email,
        },
        data: {
          wishlistShared: {
            connect: user,
          },
        },
      })

      // Add userShared to sharedWith
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          sharedWith: {
            connect: {
              email,
            },
          },
        },
      })

      await sendMail(
        req.t("common:wishlistSharedMail"),
        email,
        req.t("common:wishlistSharedMailContent", { user: user.username }),
      )
      res.send({ result: req.t("common:wishlistShared") })
    } catch (error) {
      console.error(error)

      res.status(500).send({ error: req.t("500") })
    }
  })

  app.get("/share/wish/:userId", auth, getWishlistShared, async (req, res) => {
    const { params, wishlistShared } = req
    const { userId } = params

    try {
      if (!wishlistShared.some(({ id }) => id === Number(userId))) {
        res.status(401).send({ error: req.t("notAuthorized") })

        return
      }

      const wishlist = await prisma.wish.findMany({
        where: {
          userId: Number(userId),
        },
        orderBy: {
          createdAt: "asc",
        },
      })

      res.send({
        result: wishlist.map((wish) => {
          return formatWish(wish, req)
        }),
      })
    } catch (error) {
      console.error(error)

      res.status(500).send({ error: req.t("500") })
    }
  })

  app.get("/share/wish", auth, getWishlistShared, async (req, res) => {
    const { wishlistShared } = req

    try {
      res.send({
        result: wishlistShared.map(({ username, id }) => {
          return {
            id,
            username,
          }
        }),
      })
    } catch (error) {
      console.error(error)

      res.status(500).send({ error: req.t("500") })
    }
  })

  app.delete("/share/wish/:userId", auth, getSharedWith, async (req, res) => {
    const { user, params, sharedWith } = req
    const { userId } = params

    const formattedUserId = Number(userId)

    if (user.id === formattedUserId) {
      res.status(400).send({ error: req.t("cannotUnshare") })

      return
    }

    if (!sharedWith.some(({ id }) => id === formattedUserId)) {
      res.status(401).send({ error: req.t("notAuthorized") })

      return
    }

    try {
      const userToUnshare = await prisma.user.findFirst({
        where: {
          id: formattedUserId,
        },
      })

      if (!userToUnshare) {
        res.status(500).send({ error: req.t("500") })

        return
      }

      // Remove userShared from sharedWith
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          sharedWith: {
            disconnect: {
              id: formattedUserId,
            },
          },
        },
      })

      // Remove user from wishlistShared
      await prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          wishlistShared: {
            disconnect: {
              id: user.id,
            },
          },
        },
      })

      res.send({
        result: req.t("common:wishlistUnshared", {
          user: userToUnshare.username,
        }),
      })
    } catch {
      res.status(500).send({ error: req.t("500") })
    }
  })

  app.get("/share/users", auth, getSharedWith, async (req, res) => {
    const { sharedWith } = req

    try {
      res.send({
        result: sharedWith.map(({ username, id }) => {
          return {
            id,
            username,
          }
        }),
      })
    } catch (error) {
      console.error(error)

      res.status(500).send({ error: req.t("500") })
    }
  })
}

export default wishRoutes
