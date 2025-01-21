import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  useToast
} from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await signIn(email, password)
      navigate('/dashboard')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box w="full" maxW="md" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack gap={4}>
          <Heading>Admin Login</Heading>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack gap={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                disabled={loading}
              >
                Sign In
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  )
} 