import { Currency } from "@prisma/client"

const currencyRoutes = (app) => {
  app.get("/currency", async (req, res) => {
    res.send({ result: Object.keys(Currency) })
  })
}
export default currencyRoutes
