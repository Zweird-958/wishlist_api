import cors from "cors"
import express from "express"
import config from "./src/config.js"

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

app.listen(config.port, () => console.log(`Listening on :${config.port}`))
