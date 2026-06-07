import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import {
    View, Text, StyleSheet, FlatList,
    TextInput, Pressable,
    StatusBar, RefreshControl
} from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme } from '../../context/ThemeContext'
import { allStocks } from '../../utils/mockData'

const FILTERS = ['All', 'Gainers', 'Losers']

const MarketScreen = () => {
    const { theme } = useTheme()
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState('All')
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = () => {
        setRefreshing(true)
        setTimeout(() => setRefreshing(false), 1500)
    }

    const filteredStocks = allStocks.filter((stock) => {
        const matchesSearch = stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
            stock.name.toLowerCase().includes(search.toLowerCase())
        if (activeFilter === 'Gainers') return matchesSearch && stock.change > 0
        if (activeFilter === 'Losers')  return matchesSearch && stock.change < 0
        return matchesSearch
    })

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
                    <View style={[styles.changeBadge, { backgroundColor: isProfit ? 'rgba(50,215,75,0.15)' : 'rgba(255,69,58,0.15)' }]}>
                        <Text style={[styles.stockChange, { color: isProfit ? theme.colors.profit : theme.colors.loss }]}>
                            {isProfit ? '+' : ''}{item.change.toFixed(2)}%
                        </Text>
                    </View>
                </View>
            </Pressable>
        )
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Market</Text>

                <TextInput
                    style={[styles.searchInput, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: theme.colors.border }]}
                    placeholder="Search stocks..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                />

                <View style={styles.filterRow}>
                    {FILTERS.map((filter) => (
                        <Pressable
                            key={filter}
                            style={[styles.filterBtn, { backgroundColor: activeFilter === filter ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.border }]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text style={[styles.filterText, { color: activeFilter === filter ? '#fff' : theme.colors.textSecondary }]}>
                                {filter}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            <FlatList
                data={filteredStocks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <StockCard item={item} />}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.colors.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={{ color: theme.colors.textSecondary, fontSize: 16 }}>No stocks found</Text>
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
    searchInput: {
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        marginBottom: 12,
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    filterBtn: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
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
        flex: 1,
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
        gap: 6,
    },
    stockPrice: {
        fontSize: 16,
        fontWeight: '600',
    },
    changeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    stockChange: {
        fontSize: 13,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 60,
    },
})

export default MarketScreen
