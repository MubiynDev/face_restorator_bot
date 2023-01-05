const userModel = require("../model/user.model")

 module.exports = async function(bot, message) {
        try {
            if(message.text === "/start") {
                await bot.sendMessage(message.from.id, `Hi, <b>${message.from.first_name}</b>.  Let's send me a pic  📷 :`, {
                    parse_mode: "HTML"
                })
    
                await userModel.findByIdAndUpdate(message.user._id, {
                    step : "send-pic",
                    isActive : true,
                })
            }   
        } catch (err) {
            console.log(err)
        }
    }

    