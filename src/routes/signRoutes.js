import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"
import hashPassword from "../utils/hashPassword.js"
import { prisma } from "../../app.js"

const signRoutes = (app) => {
  app.post("/sign-up", async (req, res) => {
    const { email, password } = req.body

    try {
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hashPassword(password),
        },
      })

      res.send({ result: user })
    } catch (err) {
      console.error(err)
      res.send({ error: "Something wrong." })
    }
  })
  app.post("/sign-in", async (req, res) => {
    const { email, password } = req.body
    const passwordHash = hashPassword(password)

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user || user.passwordHash !== passwordHash) {
      res.status(401).send({ error: "Invalid credentials" })

      return
    }

    const sessionToken = jsonwebtoken
      .sign(
        {
          payload: {
            userId: user._id,
          },
        },
        config.security.jwt.secret,
        { expiresIn: config.security.jwt.expiresIn }
      )
      .toString("hex")

    res.send({ result: sessionToken })
  })
}

export default signRoutes
