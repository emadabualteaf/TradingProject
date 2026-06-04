import { useRouter } from 'expo-router'
import RegisterScreen from '../src/screens/Auth/RegisterScreen'

export default function Register() {
    const router = useRouter()
    const navigation = {
        navigate: (name) => {
            if (name === 'Login') router.back()
        }
    }
    return <RegisterScreen navigation={navigation} />
}
