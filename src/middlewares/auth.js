import config from "../config.js"
import jsonwebtoken from "jsonwebtoken"
import { prisma } from "../../app.js"

const auth = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    res.status(403).send({ error: "Forbidden" })

    return
  }

  try {
    const { payload } = jsonwebtoken.verify(
      authorization,
      config.security.jwt.secret
    )

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    })

    if (!user) {
      res.status(403).send({ error: "Forbidden" })

      return
    }

    req.user = user

    await next()
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      res.status(403).send({ error: "Forbidden" })

      return
    }

    console.error(err)

    res.status(500).send({ error: "Oops. Something wrong." })
  }
}

export default auth
