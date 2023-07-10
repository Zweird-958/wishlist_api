import { PrismaClient } from "@prisma/client"
import cors from "cors"
import express from "express"
import config from "./src/config.js"
import currencyRoutes from "./src/routes/currencyRoutes.js"
import signRoutes from "./src/routes/signRoutes.js"
import wishRoutes from "./src/routes/wishRoutes.js"
import i18next from "i18next"
import Backend from "i18next-fs-backend"
import middleware from "i18next-http-middleware"

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    lng: "en", // Default language
    fallbackLng: "en",
    supportedLngs: ["en", "fr"], // Langues prises en charge
    backend: {
      loadPath: "locales/{{lng}}/{{ns}}.json",
    },
  })

const prisma = new PrismaClient()

const app = express()

app.use(
  middleware.handle(i18next, {
    removeLngFromUrl: false,
  })
)

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

app.use(function (_, res) {
  res.status(404).send({ error: "Not found" })
})

app.listen(config.port, () => console.log(`Listening on : ${config.port}`))

export { prisma }
