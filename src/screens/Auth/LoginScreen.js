import React, { useState } from 'react'
import {
    View, Text, TextInput, Pressable, StyleSheet,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard, Alert, SafeAreaView, ActivityIndicator
} from 'react-native'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const BASE_URL = 'http://10.0.2.2:3000'

const LoginScreen = ({ navigation }) => {
    const { login } = useAuth()
    const { theme } = useTheme()
    const [form, setForm] = useState({ email: '', password: '' })
    const [inputStyles, setInputStyles] = useState({
        email: regularInput,
        password: regularInput
    })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const changeField = (field, value) => {
        setForm({ ...form, [field]: value })
        setInputStyles({ ...inputStyles, [field]: regularInput })
    }

    const handleLogin = () => {
        if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }
        setLoading(true)
        axios.post(`${BASE_URL}/login`, form)
            .then((res) => {
                login(res.data.user, res.data.token)
            })
            .catch((err) => {
                console.log(err)
                Alert.alert('Error', 'Email or password is incorrect')
            })
            .finally(() => setLoading(false))
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>

                        <Text style={[styles.title, { color: theme.colors.primary }]}>
                            Trading App
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            Sign in to your account
                        </Text>

                        <TextInput
                            style={[inputStyles.email, { color: theme.colors.text, borderColor: inputStyles.email === goodInput ? theme.colors.profit : inputStyles.email === badInput ? theme.colors.loss : theme.colors.border }]}
                            placeholder="Email"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={(text) => changeField('email', text)}
                            onBlur={() => {
                                if (form.email.length === 0) return
                                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                    setInputStyles({ ...inputStyles, email: goodInput })
                                else
                                    setInputStyles({ ...inputStyles, email: badInput })
                            }}
                        />
                        {inputStyles.email === badInput && <Text style={styles.errorText}>Please enter a valid email address</Text>}

                        <TextInput
                            style={[inputStyles.password, { color: theme.colors.text, borderColor: inputStyles.password === goodInput ? theme.colors.profit : inputStyles.password === badInput ? theme.colors.loss : theme.colors.border }]}
                            placeholder="Password"
                            placeholderTextColor={theme.colors.textSecondary}
                            secureTextEntry={!showPassword}
                            onChangeText={(text) => changeField('password', text)}
                            onBlur={() => {
                                if (form.password.length === 0) return
                                if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(form.password))
                                    setInputStyles({ ...inputStyles, password: goodInput })
                                else
                                    setInputStyles({ ...inputStyles, password: badInput })
                            }}
                        />
                        {inputStyles.password === badInput && <Text style={styles.errorText}>Min 8 chars, uppercase, number and special character</Text>}

                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <Text style={{ color: theme.colors.textSecondary, marginBottom: 10 }}>
                                {showPassword ? 'Hide password' : 'Show password'}
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, { backgroundColor: theme.colors.primary }]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.buttonText}>Login</Text>
                            }
                        </Pressable>

                        <Pressable onPress={() => navigation.navigate('Register')}>
                            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                                Don't have an account? Register
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[styles.demoButton, { borderColor: theme.colors.border }]}
                            onPress={() => login({ _id: 'demo', name: 'Demo User', email: 'demo@test.com' }, 'demo-token')}
                        >
                            <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>
                                Skip — Demo Mode
                            </Text>
                        </Pressable>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    inner: {
        paddingHorizontal: 30,
        gap: 10,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 2,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: 'transparent',
    },
    good: {
        backgroundColor: 'rgba(0, 200, 0, 0.08)'
    },
    bad: {
        backgroundColor: 'rgba(200, 0, 0, 0.08)'
    },
    errorText: {
        color: 'red',
        fontSize: 13,
        marginTop: -6,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkText: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 10,
    },
    demoButton: {
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        marginTop: 6,
    }
})

const regularInput = StyleSheet.flatten([styles.input])
const goodInput = StyleSheet.flatten([styles.input, styles.good])
const badInput = StyleSheet.flatten([styles.input, styles.bad])

export default LoginScreen
