import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import config from "../config.js"

export const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${config.image.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.image.accessKey,
    secretAccessKey: config.image.secretAccessKey,
  },
})

const uploadOnBucket = async (req, res, next) => {
  const image = req.file

  if (!image) {
    next()

    return
  }

  try {
    const imageName = Date.now() + "-" + Math.round(Math.random() * 1e9)

    const command = new PutObjectCommand({
      Bucket: config.image.bucket,
      Key: imageName,
      ContentType: image.mimetype,
      Body: image.buffer,
    })

    await S3.send(command)

    req.image = `${config.image.bucketUrl}/${imageName}`
    next()
  } catch (error) {
    console.log("error", error)
    res.status(500).send({ error: req.t("500") })
  }
}

export default uploadOnBucket
