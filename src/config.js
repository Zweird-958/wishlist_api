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
  client_id: process.env.IMGUR_CLIENT_ID,
  email: {
    user: process.env.EMAIL_USER,
    key: process.env.EMAIL_KEY,
  },
}

export default config
