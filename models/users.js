const mongoose = require('mongoose');
const { Schema } = mongoose;

const Users = new Schema({
    username: String,
    log: [{
        description: String,
        duration: Number,
        date: Date,
    }]
})

module.exports = mongoose.model('User', Users);