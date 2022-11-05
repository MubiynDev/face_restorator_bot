require("dotenv").config()
const { env } = process

module.exports = {
    API_TOKEN: env.API_TOKEN,
    TOKEN: env.TOKEN,
    PORT: env.PORT,
    SERVER_URL: env.SERVER_URL,
    CHANNEL_FOR_LOG: env.CHANNEL_FOR_LOG,
    FETCH_URL: env.FETCH_URL
}