const { default: fetch } = require('node-fetch');
// const Koa =require("koa")
// const Router = require("koa-router")
// const bodyParser = require("koa-bodyparser")
const TelegramBot = require("node-telegram-bot-api");
const { TOKEN, PORT, SERVER_URL, CHANNEL_FOR_LOG, FETCH_URL, API_TOKEN } = require("../config");

const bot = new TelegramBot(TOKEN, {
    webHook: {
        port: PORT,
        autoOpen: false
    }
})
bot.openWebHook()
bot.setWebHook(`${SERVER_URL}/bot${TOKEN}`)

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
    const chatId = message.from.id;
    const text = message.text;
    const name = message.from.first_name
    const userName = message.from.username
    

    await bot.forwardMessage(CHANNEL_FOR_LOG, chatId, message.message_id)

    
    if(text === "/start") {
        await bot.sendMessage(chatId, `Assalomu alaykum <b>${name}</b>. Tiniqlashtirmoqchi bo'lgan rasmingizni yuboring :`, {
            parse_mode: "HTML"
        })
        
    }
    else if(message.photo) {

     try {
        await bot.sendMessage(chatId, "Process jarayoni 20-30 soniya vaqt olishi mumkin. iltimos biroz kuting...")

        const fileId = message.photo[message.photo.length - 1].file_id
        const link = await bot.getFileLink(fileId)
        
        const data = {
            version: '9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3', 
            input: { img: link  }
           }
        
        let result = await fetch(FETCH_URL, {
            method: 'post',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : API_TOKEN
                     },
            body: JSON.stringify(data)
        
        })
        result = await result.json()

        setTimeout(async () => {
            let image = await fetch(result.urls.get, {
                method: 'GET',
                headers: { 
                    'Content-Type'  : 'application/json',
                    'Authorization' : API_TOKEN 
                    }
            })
           image = await image.json()
           console.log(image)
           
           if(image.output) {
            await bot.sendMessage(chatId, `Rasmingiz tayyor:`)
            await bot.sendPhoto(chatId, image.output)

            await bot.sendMessage(CHANNEL_FOR_LOG, `${image.output} @${userName}`)
           } else {
            await bot.sendMessage(chatId, `Xatolik yuz berdi. iltimos qaytadan urinib ko'ring`)
           }
        },  25000)

        } catch(err) {
            console.log(err)
            await bot.sendMessage(chatId, `Xatolik yuz berdi. iltimos qaytadan urinib ko'ring`)
        }

    } 

    else if(!message.photo && text !== "/start") {
        
        await bot.sendMessage(chatId, "Noto'g'ri format. Iltimos faqat rasm yuboring !")
    }


})
