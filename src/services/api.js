import axios from 'axios'

// Change this IP to your computer's local IP when running the backend
const BASE_URL = 'http://10.0.2.2:3000'

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
})

// Attach the token to every request automatically
const authHeader = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
})

// ─── Auth ────────────────────────────────────────────────────────────────────

const register = (name, email, password) => {
    return api.post('/register', { name, email, password })
}

const login = (email, password) => {
    return api.post('/login', { email, password })
}

// ─── Profile ─────────────────────────────────────────────────────────────────

const getProfile = (token) => {
    return api.get('/profile', authHeader(token))
}

const updateProfile = (token, data) => {
    return api.put('/profile', data, authHeader(token))
}

const deleteProfile = (token) => {
    return api.delete('/profile', authHeader(token))
}

// ─── Watchlist ────────────────────────────────────────────────────────────────

const getWatchlist = (token) => {
    return api.get('/watchlist', authHeader(token))
}

const addToWatchlist = (token, stock) => {
    return api.post('/watchlist', { stock }, authHeader(token))
}

const removeFromWatchlist = (token, symbol) => {
    return api.delete(`/watchlist/${symbol}`, authHeader(token))
}

export default {
    register,
    login,
    getProfile,
    updateProfile,
    deleteProfile,
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
}
