import React, { useState, useEffect } from 'react'
import {
    View, Text, StyleSheet, SafeAreaView, StatusBar,
    Pressable, TextInput, Alert, ScrollView, Image
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const ProfileScreen = () => {
    const { user, logout, updateUser } = useAuth()
    const { theme, isDark, toggleTheme } = useTheme()
    const [editing, setEditing] = useState(false)
    const [name, setName] = useState(user?.name || '')
    const [avatar, setAvatar] = useState(user?.avatar || null)

    useEffect(() => {
        ImagePicker.requestMediaLibraryPermissionsAsync()
        ImagePicker.requestCameraPermissionsAsync()
    }, [])

    const pickImage = () => {
        Alert.alert('Profile Photo', 'Choose an option', [
            {
                text: 'Camera',
                onPress: () => openCamera()
            },
            {
                text: 'Gallery',
                onPress: () => openGallery()
            },
            { text: 'Cancel', style: 'cancel' }
        ])
    }

    const openCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync()
        if (!permission.granted) {
            Alert.alert('Permission required', 'Camera permission is needed to take a photo')
            return
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        })
        if (!result.canceled) {
            const uri = result.assets[0].uri
            setAvatar(uri)
            updateUser({ avatar: uri })
        }
    }

    const openGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        })
        if (!result.canceled) {
            const uri = result.assets[0].uri
            setAvatar(uri)
            updateUser({ avatar: uri })
        }
    }

    const handleSave = () => {
        if (name.trim().length < 2) {
            Alert.alert('Error', 'Name must be at least 2 characters')
            return
        }
        updateUser({ name: name.trim() })
        setEditing(false)
        Alert.alert('Success', 'Profile updated')
    }

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout }
        ])
    }

    const handleDelete = () => {
        Alert.alert('Delete Account', 'This action cannot be undone. Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    logout()
                }
            }
        ])
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
            <ScrollView contentContainerStyle={styles.content}>

                <Text style={[styles.title, { color: theme.colors.text }]}>Profile</Text>

                <View style={styles.avatarContainer}>
                    <Pressable onPress={pickImage}>
                        {avatar
                            ? <Image source={{ uri: avatar }} style={styles.avatar} />
                            : (
                                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
                                    <Text style={styles.avatarInitial}>
                                        {(user?.name || 'U')[0].toUpperCase()}
                                    </Text>
                                </View>
                            )
                        }
                        <View style={[styles.cameraIcon, { backgroundColor: theme.colors.primary }]}>
                            <Ionicons name="camera" size={16} color="#fff" />
                        </View>
                    </Pressable>
                </View>

                <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                    <Text style={[styles.cardLabel, { color: theme.colors.textSecondary }]}>Full Name</Text>
                    {editing
                        ? (
                            <TextInput
                                style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.primary }]}
                                value={name}
                                onChangeText={setName}
                                autoFocus
                            />
                        )
                        : <Text style={[styles.cardValue, { color: theme.colors.text }]}>{user?.name}</Text>
                    }

                    <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                    <Text style={[styles.cardLabel, { color: theme.colors.textSecondary }]}>Email</Text>
                    <Text style={[styles.cardValue, { color: theme.colors.text }]}>{user?.email}</Text>
                </View>

                {editing
                    ? (
                        <View style={styles.row}>
                            <Pressable
                                style={[styles.btn, { backgroundColor: theme.colors.primary, flex: 1 }]}
                                onPress={handleSave}
                            >
                                <Text style={styles.btnText}>Save</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.btn, { backgroundColor: theme.colors.surface, flex: 1, borderWidth: 1, borderColor: theme.colors.border }]}
                                onPress={() => { setEditing(false); setName(user?.name || '') }}
                            >
                                <Text style={[styles.btnText, { color: theme.colors.text }]}>Cancel</Text>
                            </Pressable>
                        </View>
                    )
                    : (
                        <Pressable
                            style={[styles.btn, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }]}
                            onPress={() => setEditing(true)}
                        >
                            <Ionicons name="pencil-outline" size={18} color={theme.colors.primary} />
                            <Text style={[styles.btnText, { color: theme.colors.primary }]}>Edit Profile</Text>
                        </Pressable>
                    )
                }

                <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                    <View style={styles.settingRow}>
                        <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                            {isDark ? 'Dark Mode' : 'Light Mode'}
                        </Text>
                        <Pressable
                            style={[styles.toggleBtn, { backgroundColor: isDark ? theme.colors.primary : theme.colors.surface, borderColor: theme.colors.border }]}
                            onPress={toggleTheme}
                        >
                            <Ionicons
                                name={isDark ? 'moon' : 'sunny'}
                                size={18}
                                color={isDark ? '#fff' : theme.colors.warning}
                            />
                        </Pressable>
                    </View>
                </View>

                <Pressable
                    style={[styles.btn, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }]}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={18} color={theme.colors.loss} />
                    <Text style={[styles.btnText, { color: theme.colors.loss }]}>Logout</Text>
                </Pressable>

                <Pressable
                    style={[styles.btn, { backgroundColor: 'rgba(255,69,58,0.1)', borderWidth: 1, borderColor: theme.colors.loss }]}
                    onPress={handleDelete}
                >
                    <Ionicons name="trash-outline" size={18} color={theme.colors.loss} />
                    <Text style={[styles.btnText, { color: theme.colors.loss }]}>Delete Account</Text>
                </Pressable>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    avatarContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        gap: 6,
    },
    cardLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        marginVertical: 8,
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    btnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    toggleBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
})

export default ProfileScreen
