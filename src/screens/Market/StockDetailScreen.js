import React from 'react'
import {
    View, Text, StyleSheet, SafeAreaView,
    StatusBar, Pressable, ScrollView, Alert
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { useWatchlist } from '../../context/WatchlistContext'
import { allStocks } from '../../utils/mockData'

const StockDetailScreen = () => {
    const { symbol } = useLocalSearchParams()
    const { theme } = useTheme()
    const router = useRouter()
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
    const inWatchlist = isInWatchlist(symbol)

    const stock = allStocks.find((s) => s.symbol === symbol)

    if (!stock) {
        return (
            <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.text }}>Stock not found</Text>
            </View>
        )
    }

    const isProfit = stock.change >= 0

    const toggleWatchlist = () => {
        if (inWatchlist) {
            removeFromWatchlist(stock.symbol)
            Alert.alert('Removed', `${stock.symbol} removed from your watchlist`)
        } else {
            addToWatchlist(stock)
            Alert.alert('Added', `${stock.symbol} added to your watchlist`)
        }
    }

    const StatRow = ({ label, value }) => (
        <View style={[styles.statRow, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
        </View>
    )

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

            <View style={[styles.topBar, { borderBottomColor: theme.colors.border }]}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
                </Pressable>
                <Text style={[styles.topBarTitle, { color: theme.colors.text }]}>{stock.symbol}</Text>
                <Pressable onPress={toggleWatchlist}>
                    <Ionicons
                        name={inWatchlist ? 'star' : 'star-outline'}
                        size={24}
                        color={inWatchlist ? '#FFD60A' : theme.colors.textSecondary}
                    />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Text style={[styles.companyName, { color: theme.colors.textSecondary }]}>{stock.name}</Text>
                <Text style={[styles.price, { color: theme.colors.text }]}>${stock.price.toFixed(2)}</Text>

                <View style={[styles.changeBadge, { backgroundColor: isProfit ? 'rgba(50,215,75,0.15)' : 'rgba(255,69,58,0.15)' }]}>
                    <Ionicons
                        name={isProfit ? 'trending-up' : 'trending-down'}
                        size={18}
                        color={isProfit ? theme.colors.profit : theme.colors.loss}
                    />
                    <Text style={[styles.changeText, { color: isProfit ? theme.colors.profit : theme.colors.loss }]}>
                        {isProfit ? '+' : ''}{stock.change.toFixed(2)}% today
                    </Text>
                </View>

                <View style={[styles.statsCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                    <Text style={[styles.statsTitle, { color: theme.colors.text }]}>Key Statistics</Text>
                    <StatRow label="Market Cap"   value={stock.marketCap} />
                    <StatRow label="Volume"       value={stock.volume} />
                    <StatRow label="52W High"     value={`$${stock.high52.toFixed(2)}`} />
                    <StatRow label="52W Low"      value={`$${stock.low52.toFixed(2)}`} />
                </View>

                <Pressable
                    style={[styles.watchlistBtn, { backgroundColor: inWatchlist ? theme.colors.surface : theme.colors.primary, borderColor: theme.colors.border }]}
                    onPress={toggleWatchlist}
                >
                    <Ionicons
                        name={inWatchlist ? 'star' : 'star-outline'}
                        size={20}
                        color={inWatchlist ? '#FFD60A' : '#fff'}
                    />
                    <Text style={[styles.watchlistBtnText, { color: inWatchlist ? theme.colors.text : '#fff' }]}>
                        {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    </Text>
                </Pressable>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: {
        padding: 4,
    },
    topBarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        gap: 12,
    },
    companyName: {
        fontSize: 16,
    },
    price: {
        fontSize: 42,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        marginBottom: 8,
    },
    changeText: {
        fontSize: 16,
        fontWeight: '600',
    },
    statsCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        gap: 4,
        marginTop: 8,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    statLabel: {
        fontSize: 14,
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    watchlistBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        marginTop: 12,
        borderWidth: 1,
    },
    watchlistBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
})

export default StockDetailScreen
