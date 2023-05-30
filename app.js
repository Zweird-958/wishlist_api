import express from "express"
import cors from "cors"
import config from "./src/config.js"
import { PrismaClient } from "@prisma/client"
import signRoutes from "./src/routes/signRoutes.js"

const prisma = new PrismaClient()

const app = express()

app.use(cors())
app.use(express.json())
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
    },
  }

  next()
})

signRoutes(app)

app.use(function (_, res) {
  res.status(404).send({ error: "Not found" })
})

app.listen(config.port, () => console.log(`Listening on : ${config.port}`))

export { prisma }
