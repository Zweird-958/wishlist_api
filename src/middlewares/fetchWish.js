import { prisma } from "../../app.js"

const fetchWish = async (req, res, next) => {
  const { user, params, ctx } = req
  const { wishId } = params

  try {
    const wish = await prisma.wish.findUnique({
      where: {
        id: Number(wishId),
      },
    })

    if (ctx.util.handleNotFound(wish) || ctx.util.notAuthorized(wish, user)) {
      return
    }

    req.wish = wish

    next()
  } catch (error) {
    res.status(500).send({ error: "Something wrong." })

    return
  }
}

export default fetchWish
