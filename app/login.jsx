import { useRouter } from 'expo-router'
import LoginScreen from '../src/screens/Auth/LoginScreen'

export default function Login() {
    const router = useRouter()
    const navigation = {
        navigate: (name) => {
            if (name === 'Register') router.push('/register')
        }
    }
    return <LoginScreen navigation={navigation} />
}
