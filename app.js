import express from "express"
import cors from "cors"
import config from "./src/config.js"
import { PrismaClient } from "@prisma/client"
import signRoutes from "./src/routes/signRoutes.js"
import wishRoutes from "./src/routes/wishRoutes.js"
import currencyRoutes from "./src/routes/currencyRoutes.js"
import sessionRoutes from "./src/routes/sessionRoutes.js"

const prisma = new PrismaClient()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("./public/images"))
app.use((req, res, next) => {
  req.ctx = {
    util: {
      handleNotFound: (x) => {
        if (!x) {
          res.status(404).send({ error: "Not found" })

          return true
        }

        return false
      },

      notAuthorized: (wish, user) => {
        if (wish.userId !== user.id) {
          res.status(401).send({ error: "Not authorized" })

          return true
        }

        return false
      },
    },
  }

  next()
})

signRoutes(app)
wishRoutes(app)
currencyRoutes(app)
sessionRoutes(app)

app.use(function (_, res) {
  res.status(404).send({ error: "Not found" })
})

app.listen(config.port, () => console.log(`Listening on : ${config.port}`))

export { prisma }
