import { prisma } from "../../app.js"

const getWishlistShared = async (req, res, next) => {
  const { user } = req

  try {
    const { wishlistShared } = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        wishlistShared: true,
      },
    })

    req.wishlistShared = wishlistShared

    await next()
  } catch (err) {
    console.error(err)

    res.status(500).send({ error: req.t("500") })
  }
}

export default getWishlistShared
