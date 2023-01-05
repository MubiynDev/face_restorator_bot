const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    tg_id: {
        type: String,
        unique: true,
    },
    first_name: {
        type: String,
    },
    username: {
        type: String,
    },
    step: {
        type: String,
        default: "start"
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    result: {
        type : [
            { 
                input: String,
                output: String
            }
        ]
    },
}, {
    timestamps: true
});

module.exports = model("users", userSchema)