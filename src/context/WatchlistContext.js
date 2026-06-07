import React, { createContext, useContext, useState } from 'react'

const WatchlistContext = createContext(null)

export function WatchlistProvider({ children }) {
    const [watchlist, setWatchlist] = useState([])

    const addToWatchlist = (stock) => {
        setWatchlist((prev) => {
            if (prev.find((s) => s.symbol === stock.symbol)) return prev
            return [...prev, stock]
        })
    }

    const removeFromWatchlist = (symbol) => {
        setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol))
    }

    const isInWatchlist = (symbol) => {
        return watchlist.some((s) => s.symbol === symbol)
    }

    return (
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    )
}

export function useWatchlist() {
    const context = useContext(WatchlistContext)
    if (!context) {
        throw new Error('useWatchlist must be used inside a WatchlistProvider')
    }
    return context
}
