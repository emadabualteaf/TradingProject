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
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            })
        })
        .catch(() => res.status(500).json({ message: 'Something went wrong' }))
})

router.put('/', requireAuth, (req, res) => {
    const { name, avatar } = req.body
    const updates = {}
    if (name) updates.name = name
    if (avatar) updates.avatar = avatar

    User.findByIdAndUpdate(req.userId, updates, { new: true })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            })
        })
        .catch(() => res.status(500).json({ message: 'Could not update profile' }))
})

router.delete('/', requireAuth, (req, res) => {
    User.findByIdAndDelete(req.userId)
        .then(() => res.json({ message: 'Account deleted' }))
        .catch(() => res.status(500).json({ message: 'Could not delete account' }))
})

module.exports = router
