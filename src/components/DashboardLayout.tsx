import { Box, Flex, Button, Heading, useToast } from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error: any) {
      toast({
        title: 'Error signing out',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        padding="4"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        position="sticky"
        top="0"
        zIndex="sticky"
        boxShadow="sm"
      >
        <Flex w="100%" maxW="1280px" mx="auto" px={4} align="center" justify="space-between">
          <Heading size="lg" color="blue.600">Admin Dashboard</Heading>
          <Button
            onClick={handleSignOut}
            colorScheme="blue"
            variant="outline"
            size="md"
          >
            Sign Out
          </Button>
        </Flex>
      </Flex>
      <Box maxW="1280px" mx="auto" p={4} w="100%">
        {children}
      </Box>
    </Box>
  )
} 