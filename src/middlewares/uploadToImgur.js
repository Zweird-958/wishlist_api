import fetch, { Headers } from "node-fetch"
import config from "../config.js"

const uploadToImgur = async (req, res, next) => {
  const image = req.file

  if (!image) {
    next()

    return
  }

  let headers = new Headers()
  headers.append("Authorization", `Client-ID ${config.client_id}`)

  let requestOptions = {
    method: "POST",
    headers,
    body: image.buffer,
    redirect: "follow",
  }

  try {
    const response = await fetch(
      "https://api.imgur.com/3/image",
      requestOptions
    )
    const {
      data: { link },
    } = await response.json()

    req.image = link
    next()
  } catch (error) {
    console.log("error", error)
    res.status(500).send({ error: req.t("500") })
  }
}

export default uploadToImgur
