const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

router.post('/register', (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' })
    }

    User.findOne({ email })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' })
            }

            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ message: 'Something went wrong' })
                }

                const newUser = new User({ name, email, password: hashedPassword })
                newUser.save()
                    .then((user) => res.status(201).json({ message: 'User created', userId: user._id }))
                    .catch(() => res.status(500).json({ message: 'Could not create user' }))
            })
        })
        .catch(() => res.status(500).json({ message: 'Something went wrong' }))
})

router.post('/login', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' })
    }

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(400).json({ message: 'Email or password is incorrect' })
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(400).json({ message: 'Email or password is incorrect' })
                }

                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

                res.json({
                    token,
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar,
                    }
                })
            })
        })
        .catch(() => res.status(500).json({ message: 'Something went wrong' }))
})

module.exports = router
