require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')
const watchlistRoutes = require('./routes/watchlist')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/', authRoutes)
app.use('/profile', profileRoutes)
app.use('/watchlist', watchlistRoutes)

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB')
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log('MongoDB connection error:', err)
    })
