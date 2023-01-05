// const Koa =require("koa")
// const Router = require("koa-router")
// const bodyParser = require("koa-bodyparser")
const TelegramBot = require("node-telegram-bot-api");
const { TOKEN, PORT, SERVER_URL, FETCH_URL, API_TOKEN } = require("../config");
const mainController = require('./controllers/mainController');
const adminController = require('./controllers/adminController');
const sendPicController = require('./controllers/sendPicController');
const { getuser } = require('./helpers/get.user');
const userModel = require('./model/user.model');
const mongoose = require('./modules/mongoose');

// const bot = new TelegramBot(TOKEN, {
//     webHook: {
//         port: PORT,
//         autoOpen: false
//     }
// })
// bot.openWebHook()
// bot.setWebHook(`${SERVER_URL}/bot${TOKEN}`)
const bot = new TelegramBot(TOKEN, {
    polling: true,
})

mongoose()

// const app = new Koa()
// const router = Router()

// router.post("/bot", ctx => {
//     const { body } = ctx.request
//     bot.processUpdate(body)
//     ctx.status = 200
   
// })
// app.use(bodyParser())
// app.use(router.routes())

// app.listen(PORT, () => {
//     console.log(`running at ${PORT}`)
// })
///////////////////////////////////////////////////////////////////////////////////////////////

bot.on("message", async message => {
    const user = await getuser(message)
    const step = user.step;
    message.user = user;

    if(step === "start") {
        await mainController(bot, message)
    }
    else if(step === "send-pic") {
        await sendPicController(bot, message)
    }
    if(user.isAdmin) {
        await adminController.sendAd(bot, message)
        await adminController.getUsers(bot, message)


    }
    
    
    
})





