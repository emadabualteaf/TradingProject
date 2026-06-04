import { Tabs, Redirect } from 'expo-router'
import { useAuth } from '../../src/context/AuthContext'
import { useTheme } from '../../src/context/ThemeContext'
import { ActivityIndicator, View } from 'react-native'

export default function TabLayout() {
    const { user, isLoading } = useAuth()
    const { theme } = useTheme()

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        )
    }

    if (!user) return <Redirect href="/login" />

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: theme.colors.tabBar, borderTopColor: theme.colors.border },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textSecondary,
        }}>
            <Tabs.Screen name="home" options={{ title: 'Home' }} />
            <Tabs.Screen name="market" options={{ title: 'Market' }} />
            <Tabs.Screen name="watchlist" options={{ title: 'Watchlist' }} />
            <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        </Tabs>
    )
}
