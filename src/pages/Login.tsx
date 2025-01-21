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
  useToast,
  Text,
  InputGroup,
  InputLeftElement,
  Icon,
  Container,
} from '@chakra-ui/react'
import { FiMail, FiLock } from 'react-icons/fi'
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
    <Box 
      minH="100vh" 
      bg="gray.50" 
      py={20}
      px={4}
    >
      <Container maxW="lg">
        <VStack spacing={8} mx="auto">
          <VStack spacing={6} textAlign="center">
            <Heading 
              size="2xl" 
              bgGradient="linear(to-r, blue.400, blue.600)"
              bgClip="text"
            >
              Admin Login
            </Heading>
            <Text color="gray.500" fontSize="lg">
              Sign in to access your dashboard
            </Text>
          </VStack>

          <Box
            w="full"
            maxW="md"
            bg="white"
            rounded="xl"
            boxShadow="2xl"
            p={{ base: 6, md: 8 }}
            borderWidth={1}
            borderColor="gray.100"
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel color="gray.700">Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiMail} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      size="lg"
                      borderRadius="md"
                      borderColor="gray.300"
                      _hover={{
                        borderColor: 'blue.400',
                      }}
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px blue.400',
                      }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.700">Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiLock} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      size="lg"
                      borderRadius="md"
                      borderColor="gray.300"
                      _hover={{
                        borderColor: 'blue.400',
                      }}
                      _focus={{
                        borderColor: 'blue.400',
                        boxShadow: '0 0 0 1px blue.400',
                      }}
                    />
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  isLoading={loading}
                  loadingText="Signing in..."
                  fontSize="md"
                  py={6}
                  mt={4}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Sign In
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
} 