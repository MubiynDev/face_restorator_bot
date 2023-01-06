const { default: fetch } = require("node-fetch")
const { FETCH_URL, API_TOKEN } = require("../../config")
const userModel = require("../model/user.model")

module.exports = async (bot, message) => {
    try {
        if(message.photo) {
            const answer = await bot.sendMessage(message.from.id, `The process may take 20-30 seconds. Please wait...⏳`, {
             parse_mode: "HTML"})
             
        

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
           
           if(image.output) {
            await bot.sendMessage(message.from.id, `Your Picture is Ready:`)
            await bot.sendPhoto(message.from.id, image.output)
            await bot.deleteMessage(message.from.id, answer.message_id)

            await userModel.findByIdAndUpdate(message.user._id, {
                $push: {
                    result : {
                        input: link,
                        output: image.output
                    }
                }
            })

           } else{
            await bot.sendMessage(message.from.id, `Sorry, An error occurred. please try again :(
            `)
           }
        },  25000)
        } 
        else if(message.text === "/start") {
            await bot.sendMessage(message.from.id, "Let's send me a picture 📷")
           
        }
        else if(message.text && message.text !== "/ad" && message.text !== "/getUsers") {
            await bot.sendMessage(message.from.id, `Wrong format. please send me a picture only ❗️`)
        } 
        

        } catch(err) {
            console.log(err)
            await bot.sendMessage(message.from.id, `Sorry, An error occurred. please try again :(`)
        }

}


