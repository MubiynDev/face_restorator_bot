const mongoose = require("mongoose");
const { MONGO_URL } = require("../../config");

module.exports = () => {
    mongoose.connect(MONGO_URL, (err) => {
        if (err) {
            console.log("MONGO CONNECTION ERROR:", err)
        } else {
            console.log(`=====================================`);
            console.log(`🚀 DATABASE CONNECTED`);
            console.log(`=====================================`);
        }
    })
}


    