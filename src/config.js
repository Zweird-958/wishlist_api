import "dotenv/config"

const config = {
  port: process.env.PORT || 3000,
  security: {
    password: {
      salt: process.env.SECURITY_PASSWORD_SALT,
      keylen: Number.parseInt(process.env.SECURITY_PASSWORD_KEYLEN, 10),
      iterations: Number.parseInt(process.env.SECURITY_PASSWORD_ITERATIONS, 10),
      digest: "sha512",
    },
    jwt: {
      expiresIn: "60 days",
      secret: process.env.SECURITY_JWT_SECRET,
    },
  },
  email: {
    user: process.env.EMAIL_USER,
    key: process.env.EMAIL_KEY,
  },
  image: {
    bucket: process.env.S3_BUCKET_NAME,
    accessKey: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accountId: process.env.ACCOUNT_ID,
    bucketUrl: process.env.BUCKET_URL,
  },
}

export default config
