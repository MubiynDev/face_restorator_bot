const userModel = require("../model/user.model")

module.exports.getuser = async (message) => {
    let user = await userModel.findOne({ tg_id : message.from.id }).lean()

    if(!user) {
        user = await userModel.create({
                tg_id : message.from.id,
                first_name: message.from.first_name,
                username: message.from.username,
                step: "start"
        })
    }

    return user;
}