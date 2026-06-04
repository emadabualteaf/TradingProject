import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../src/context/ThemeContext'

export default function Profile() {
    const { theme } = useTheme()
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.text, fontSize: 24 }}>Profile</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
})
