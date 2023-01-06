const userModel = require("../model/user.model")

module.exports.sendAd = async (bot, message) => {
    if(message.text === "/ad") {
       await bot.sendMessage(message.from.id, `Okay. send me Ad: `)
       await userModel.findByIdAndUpdate(message.user._id, {
        step: "admin"
       })
    }
    else if(message.text === "/cancel") {
        await userModel.findByIdAndUpdate(message.user._id, {
            step: "send-pic"
           })
        await bot.sendMessage(message.from.id, `Cancelled`, { reply_to_message_id: message.message_id }) 
    }
    
    else if(message.user.step === "admin") {
        let interval = (1 / 15) * 1000;
        const users = await userModel.find().lean();
        
    
        if(users) {
            setTimeout(async () => {
                let count = 0;
                for(let user in users) {
                    try {
                        await bot.copyMessage(
                            Number(users[user].tg_id),
                            Number(message.chat.id),
                            message.message_id,
                        );
                        count += 1;
                    } catch (err) {

                            if(err.response.body.error_code == 403) {
                                await userModel.findByIdAndUpdate(users[user]._id, {
                                    isActive: false,
                                    step: "start"
                                })
                            }
                        
                        
                    }
                }
                
                await bot.sendMessage(message.from.id, `<b>${count}</b>ta xabar muvaffaqqiyatli yuborildi`, {
                    parse_mode: "HTML",
                    reply_to_message_id: message.message_id,
                });

            }, interval)

    }
    await userModel.findByIdAndUpdate(message.user._id, {
        step: "send-pic"
       })
    }
    
}


module.exports.getUsers = async (bot, message) => {
    if(message.text === "/getUsers") {
        const users = await userModel.find().lean()
        const inActiveUsers = await userModel.find({ isActive: false }).lean()

        try {
            await bot.sendMessage(message.from.id, `<b>All Users:</b>  ${users.length}
<b>Active Users:</b>  ${users.length - inActiveUsers.length}
<b>InActive Users:</b>  ${inActiveUsers.length}
        `, { 
            parse_mode: "HTML",
            reply_to_message_id: message.message_id,
         })


        } catch(err) {
            console.log(err)
        }


    }
    


}
