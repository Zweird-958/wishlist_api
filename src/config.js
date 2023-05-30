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
      expiresIn: "2 days",
      secret: process.env.SECURITY_JWT_SECRET,
    },
  },
}

export default config
