const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
    id: String,
    symbol: String,
    name: String,
    price: Number,
    change: Number,
}, { _id: false })

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: null,
    },
    watchlist: {
        type: [stockSchema],
        default: [],
    },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
