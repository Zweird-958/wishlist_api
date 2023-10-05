import { prisma } from "../../app.js"

const getSharedWith = async (req, res, next) => {
  const { user } = req

  try {
    const { sharedWith } = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        sharedWith: true,
      },
    })

    req.sharedWith = sharedWith

    await next()
  } catch (err) {
    console.error(err)

    res.status(500).send({ error: req.t("500") })
  }
}

export default getSharedWith
