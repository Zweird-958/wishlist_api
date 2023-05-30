import { pbkdf2Sync } from "node:crypto"
import config from "../config.js"

const hashPassword = (password) =>
  pbkdf2Sync(
    password,
    config.security.password.salt,
    config.security.password.iterations,
    config.security.password.keylen,
    config.security.password.digest
  ).toString("hex")

export default hashPassword
