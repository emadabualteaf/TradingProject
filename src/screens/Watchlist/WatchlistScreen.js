import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import {
    View, Text, StyleSheet, FlatList,
    StatusBar, Pressable
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { useWatchlist } from '../../context/WatchlistContext'

const WatchlistScreen = () => {
    const { theme } = useTheme()
    const { watchlist, removeFromWatchlist } = useWatchlist()
    const router = useRouter()

    const StockCard = ({ item }) => {
        const isProfit = item.change >= 0
        return (
            <Pressable
                style={[styles.stockCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                onPress={() => router.push(`/stock/${item.symbol}`)}
            >
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
                <Pressable onPress={() => removeFromWatchlist(item.symbol)} style={styles.removeBtn}>
                    <Ionicons name="star" size={22} color="#FFD60A" />
                </Pressable>
            </Pressable>
        )
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Watchlist</Text>
            </View>
            <FlatList
                data={watchlist}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <StockCard item={item} />}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="star-outline" size={60} color={theme.colors.border} />
                        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                            No stocks in your watchlist yet
                        </Text>
                        <Text style={[styles.emptySubText, { color: theme.colors.textSecondary }]}>
                            Tap the star on any stock to add it here
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        flexGrow: 1,
    },
    stockCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 10,
    },
    stockLeft: {
        flex: 1,
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
        marginRight: 12,
    },
    stockPrice: {
        fontSize: 16,
        fontWeight: '600',
    },
    stockChange: {
        fontSize: 13,
        fontWeight: '600',
    },
    removeBtn: {
        padding: 4,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        gap: 12,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
    },
    emptySubText: {
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
})

export default WatchlistScreen
