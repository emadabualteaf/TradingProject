import { Slot } from 'expo-router'
import { AuthProvider } from '../src/context/AuthContext'
import { ThemeProvider } from '../src/context/ThemeContext'
import { WatchlistProvider } from '../src/context/WatchlistContext'

export default function RootLayout() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <WatchlistProvider>
                    <Slot />
                </WatchlistProvider>
            </ThemeProvider>
        </AuthProvider>
    )
}
