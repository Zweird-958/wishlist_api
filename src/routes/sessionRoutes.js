import auth from "../middlewares/auth.js"

const sessionRoutes = (app) => {
  app.get("/session", auth, async (req, res) => {
    res.send({ result: req.user })
  })
}

export default sessionRoutes
