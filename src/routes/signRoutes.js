import jsonwebtoken from "jsonwebtoken"
import yup from "yup"
import { prisma } from "../../app.js"
import config from "../config.js"
import hashPassword from "../utils/hashPassword.js"

const signUpSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  username: yup.string().min(3).required(),
})

const signRoutes = (app) => {
  app.post("/sign-up", async (req, res) => {
    const { email, username, password } = req.body

    try {
      await signUpSchema.validate({ email, password, username })

      const existingUsername = await prisma.user.findFirst({
        where: {
          OR: [
            {
              username: {
                equals: username,
                mode: "insensitive",
              },
            },
          ],
        },
      })

      if (existingUsername) {
        res.status(500).send({ error: req.t("500") })

        return
      }

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash: hashPassword(password),
          username,
        },
      })

      res.send({ result: user })
    } catch (err) {
      console.error(err)

      res.status(500).send({ error: req.t("500") })
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
      res.status(401).send({ error: req.t("invalidCredentials") })

      return
    }

    const sessionToken = jsonwebtoken
      .sign(
        {
          payload: {
            userId: user.id,
          },
        },
        config.security.jwt.secret,
        { expiresIn: config.security.jwt.expiresIn },
      )
      .toString("hex")

    res.send({ result: sessionToken })
  })
}

export default signRoutes
