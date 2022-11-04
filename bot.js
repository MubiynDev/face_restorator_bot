const { default: fetch } = require('node-fetch');
const TelegramBot = require("node-telegram-bot-api");
const { TOKEN } = require("./config");

const bot = new TelegramBot(TOKEN, {
    polling: true,
});


bot.on("message", async message => {
    const chatId = message.from.id;
    const text = message.text;
    const name = message.from.first_name
    
    
    await bot.forwardMessage("@MsXbotlogger", chatId, message.message_id)

    
    if(text === "/start") {
        await bot.sendMessage(chatId, `Assalomu alaykum <b>${name}</b>. Tiniqlashtirmoqchi bo'lgan rasmingizni yuboring :`, {
            parse_mode: "HTML"
        })
        
    }
    else if(message.photo) {

        await bot.sendMessage(chatId, "Process jarayoni 20-30 soniya vaqt olishi mumkin. iltimos biroz kuting...")

        const fileId = message.photo[3] ? message.photo[3].file_id : message.photo[2].file_id
        const link = await bot.getFileLink(fileId)
        
        const data = {
            version: '9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3', 
            input: { img: link  }
           }
        
        let result = await fetch("https://api.replicate.com/v1/predictions", {
            method: 'post',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : 'Token 667312eaae60d0ed2921b5194473e8cacf36ef84'
                     },
            body: JSON.stringify(data)
        
        })
        result = await result.json()

        setTimeout(async () => {
            let image = await fetch(result.urls.get, {
                method: 'GET',
                headers: { 
                    'Content-Type'  : 'application/json',
                    'Authorization' : 'Token 667312eaae60d0ed2921b5194473e8cacf36ef84' 
                    }
            })
           image = await image.json()
           console.log(image)
           
           if(image.output) {
            await bot.sendMessage(chatId, `Rasmingiz tayyor:`)
            await bot.sendPhoto(chatId, image.output)
           } else {
            await bot.sendMessage(chatId, `Xatolik yuz berdi. iltimos qaytadan urinib ko'ring`)
           }
        },  25000)


    } 

    else if(!message.photo && text !== "/start") {
        
        await bot.sendMessage(chatId, "Noto'g'ri format. Iltimos faqat rasm yuboring !")
    }


})
