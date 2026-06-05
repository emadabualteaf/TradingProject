import { useRouter, Redirect } from 'expo-router'
import { useAuth } from '../src/context/AuthContext'
import LoginScreen from '../src/screens/Auth/LoginScreen'

export default function Login() {
    const router = useRouter()
    const { user } = useAuth()

    if (user) return <Redirect href="/(tabs)/home" />

    const navigation = {
        navigate: (name) => {
            if (name === 'Register') router.push('/register')
        }
    }
    return <LoginScreen navigation={navigation} />
}
