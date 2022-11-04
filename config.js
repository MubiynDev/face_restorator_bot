require("dotenv").config()
const { env } = process

module.exports = {
    TOKEN: env.TOKEN,
    PORT: env.PORT,
    SERVER_URL: env.SERVER_URL   
}