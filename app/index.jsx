import { Redirect } from 'expo-router'
import { View, ActivityIndicator } from 'react-native'
import { useAuth } from '../src/context/AuthContext'

export default function Index() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D0D0D' }}>
                <ActivityIndicator size="large" color="#4A9EFF" />
            </View>
        )
    }

    if (user) return <Redirect href="/(tabs)/home" />

    return <Redirect href="/login" />
}
