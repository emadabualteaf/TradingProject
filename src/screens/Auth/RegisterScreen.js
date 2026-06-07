import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import {
    View, Text, TextInput, Pressable, StyleSheet,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback,
    Keyboard, Alert, ScrollView, ActivityIndicator
} from 'react-native'
import axios from 'axios'
import { useTheme } from '../../context/ThemeContext'

const BASE_URL = 'http://10.0.2.2:3000'

const RegisterScreen = ({ navigation }) => {
    const { theme } = useTheme()
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [inputStyles, setInputStyles] = useState({
        name: regularInput,
        email: regularInput,
        password: regularInput,
        confirmPassword: regularInput
    })
    const [loading, setLoading] = useState(false)

    const changeField = (field, value) => {
        setForm({ ...form, [field]: value })
        setInputStyles({ ...inputStyles, [field]: regularInput })
    }

    const handleRegister = () => {
        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }
        if (form.password !== form.confirmPassword) {
            Alert.alert('Error', 'Passwords do not match')
            return
        }
        setLoading(true)
        axios.post(`${BASE_URL}/register`, {
            name: form.name,
            email: form.email,
            password: form.password
        })
            .then(() => {
                Alert.alert('Success', 'Account created! Please log in.')
                navigation.navigate('Login')
            })
            .catch((err) => {
                console.log(err)
                Alert.alert('Error', 'Email already exists')
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
                    <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">

                        <Text style={[styles.title, { color: theme.colors.primary }]}>
                            Create Account
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            Register to start trading
                        </Text>

                        <TextInput
                            style={[inputStyles.name, { color: theme.colors.text, borderColor: inputStyles.name === goodInput ? theme.colors.profit : inputStyles.name === badInput ? theme.colors.loss : theme.colors.border }]}
                            placeholder="Full Name"
                            placeholderTextColor={theme.colors.textSecondary}
                            onChangeText={(text) => changeField('name', text)}
                            onBlur={() => {
                                if (form.name.length === 0) return
                                if (form.name.length >= 2)
                                    setInputStyles({ ...inputStyles, name: goodInput })
                                else
                                    setInputStyles({ ...inputStyles, name: badInput })
                            }}
                        />
                        {inputStyles.name === badInput && <Text style={styles.errorText}>Name must be at least 2 characters</Text>}

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
                            secureTextEntry
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

                        <TextInput
                            style={[inputStyles.confirmPassword, { color: theme.colors.text, borderColor: inputStyles.confirmPassword === goodInput ? theme.colors.profit : inputStyles.confirmPassword === badInput ? theme.colors.loss : theme.colors.border }]}
                            placeholder="Confirm Password"
                            placeholderTextColor={theme.colors.textSecondary}
                            secureTextEntry
                            onChangeText={(text) => changeField('confirmPassword', text)}
                            onBlur={() => {
                                if (form.confirmPassword.length === 0) return
                                if (form.confirmPassword === form.password)
                                    setInputStyles({ ...inputStyles, confirmPassword: goodInput })
                                else
                                    setInputStyles({ ...inputStyles, confirmPassword: badInput })
                            }}
                        />
                        {inputStyles.confirmPassword === badInput && <Text style={styles.errorText}>Passwords do not match</Text>}

                        <Pressable
                            style={[styles.button, { backgroundColor: theme.colors.primary }]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.buttonText}>Register</Text>
                            }
                        </Pressable>

                        <Pressable onPress={() => navigation.navigate('Login')}>
                            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                                Already have an account? Login
                            </Text>
                        </Pressable>

                    </ScrollView>
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
    },
    inner: {
        paddingHorizontal: 30,
        paddingVertical: 40,
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
    }
})

const regularInput = StyleSheet.flatten([styles.input])
const goodInput = StyleSheet.flatten([styles.input, styles.good])
const badInput = StyleSheet.flatten([styles.input, styles.bad])

export default RegisterScreen
