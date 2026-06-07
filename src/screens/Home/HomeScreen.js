import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import {
    View, Text, StyleSheet, FlatList,
    StatusBar, Pressable
} from 'react-native'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const mockStocks = [
    { id: '1', symbol: 'AAPL', name: 'Apple Inc.',     price: 189.45, change: 1.23 },
    { id: '2', symbol: 'TSLA', name: 'Tesla Inc.',      price: 245.67, change: -2.15 },
    { id: '3', symbol: 'GOOGL', name: 'Alphabet Inc.',  price: 142.89, change: 0.87 },
    { id: '4', symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.92, change: 1.54 },
    { id: '5', symbol: 'AMZN', name: 'Amazon.com',      price: 185.23, change: -0.43 },
]

const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
}

const HomeScreen = () => {
    const { user } = useAuth()
    const { theme } = useTheme()

    const StockCard = ({ item }) => {
        const isProfit = item.change >= 0
        return (
            <View style={[styles.stockCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <View style={styles.stockLeft}>
                    <Text style={[styles.stockSymbol, { color: theme.colors.text }]}>{item.symbol}</Text>
                    <Text style={[styles.stockName, { color: theme.colors.textSecondary }]}>{item.name}</Text>
                </View>
                <View style={styles.stockRight}>
                    <Text style={[styles.stockPrice, { color: theme.colors.text }]}>${item.price.toFixed(2)}</Text>
                    <Text style={[styles.stockChange, { color: isProfit ? theme.colors.profit : theme.colors.loss }]}>
                        {isProfit ? '+' : ''}{item.change.toFixed(2)}%
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
            <FlatList
                data={mockStocks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <StockCard item={item} />}
                ListHeaderComponent={
                    <View>
                        <View style={styles.header}>
                            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
                                {getGreeting()}
                            </Text>
                            <Text style={[styles.userName, { color: theme.colors.text }]}>
                                {user?.name || 'Trader'}
                            </Text>
                        </View>

                        <View style={[styles.portfolioCard, { backgroundColor: theme.colors.primary }]}>
                            <Text style={styles.portfolioLabel}>Portfolio Value</Text>
                            <Text style={styles.portfolioValue}>$12,483.50</Text>
                            <Text style={styles.portfolioChange}>+2.34% today</Text>
                        </View>

                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                            Trending Stocks
                        </Text>
                    </View>
                }
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    header: {
        marginTop: 20,
        marginBottom: 20,
    },
    greeting: {
        fontSize: 16,
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 4,
    },
    portfolioCard: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
    },
    portfolioLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    portfolioValue: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    portfolioChange: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    stockCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 10,
    },
    stockLeft: {
        gap: 4,
    },
    stockSymbol: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    stockName: {
        fontSize: 13,
    },
    stockRight: {
        alignItems: 'flex-end',
        gap: 4,
    },
    stockPrice: {
        fontSize: 16,
        fontWeight: '600',
    },
    stockChange: {
        fontSize: 14,
        fontWeight: '600',
    },
})

export default HomeScreen
