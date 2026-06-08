const express = require('express')
const User = require('../models/User')
const requireAuth = require('../middleware/auth')

const router = express.Router()

router.get('/', requireAuth, (req, res) => {
    User.findById(req.userId)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
            res.json(user.watchlist)
        })
        .catch(() => res.status(500).json({ message: 'Something went wrong' }))
})

router.post('/', requireAuth, (req, res) => {
    const { stock } = req.body

    if (!stock || !stock.symbol) {
        return res.status(400).json({ message: 'Stock data is required' })
    }

    User.findById(req.userId)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            const alreadyAdded = user.watchlist.some((item) => item.symbol === stock.symbol)
            if (!alreadyAdded) {
                user.watchlist.push(stock)
                user.save()
            }

            res.json(user.watchlist)
        })
        .catch(() => res.status(500).json({ message: 'Could not update watchlist' }))
})

router.delete('/:symbol', requireAuth, (req, res) => {
    const { symbol } = req.params

    User.findById(req.userId)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            user.watchlist = user.watchlist.filter((item) => item.symbol !== symbol)
            user.save()
                .then(() => res.json(user.watchlist))
        })
        .catch(() => res.status(500).json({ message: 'Could not update watchlist' }))
})

module.exports = router
