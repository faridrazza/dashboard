import { useState } from 'react'
import {
  Box,
  Button,
  Input,
  VStack,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  FormControl,
  FormLabel,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Badge,
  Flex
} from '@chakra-ui/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { videoService } from '../services/api'
import DashboardLayout from '../components/DashboardLayout'
import { Video } from '../types'

function VideoPreview({ videoLink }: { videoLink: string }) {
  const videoId = videoLink.includes('youtube.com') 
    ? new URL(videoLink).searchParams.get('v')
    : videoLink.split('/').pop()

  return (
    <Box position="relative" paddingBottom="56.25%" height="0" overflow="hidden" borderRadius="md">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </Box>
  )
}

export default function Dashboard() {
  const [videoLink, setVideoLink] = useState('')
  const [script, setScript] = useState('')
  const [videoId, setVideoId] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const queryClient = useQueryClient()

  // Fetch videos
  const { data: videos, isLoading } = useQuery({
    queryKey: ['videos'],
    queryFn: videoService.getAll,
  })

  // Add video mutation
  const addVideoMutation = useMutation({
    mutationFn: (data: { videoLink: string; script: string; videoId: string }) => 
      videoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      toast({
        title: 'Success',
        description: 'Video added successfully',
        status: 'success',
        duration: 3000,
      })
      // Reset form
      setVideoLink('')
      setScript('')
      setVideoId('')
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    },
  })

  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: videoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      toast({
        title: 'Success',
        description: 'Video deleted successfully',
        status: 'success',
        duration: 3000,
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addVideoMutation.mutate({
      videoLink,
      script,
      videoId,
    })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      deleteVideoMutation.mutate(id)
    }
  }

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video)
    onOpen()
  }

  return (
    <DashboardLayout>
      <VStack spacing={8} align="stretch">
        <Box p={6} borderWidth={1} borderRadius="xl" bg="white" boxShadow="sm">
          <Text fontSize="xl" fontWeight="bold" mb={4}>Add New Video</Text>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Video Link</FormLabel>
                <Input
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="Enter video URL"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Script</FormLabel>
                <Textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Enter video script"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Video ID</FormLabel>
                <Input
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                  placeholder="Enter video ID"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                disabled={addVideoMutation.isPending}
                width="full"
              >
                Add Video
              </Button>
            </VStack>
          </form>
        </Box>

        <Box overflowX="auto" bg="white" borderRadius="xl" boxShadow="sm">
          <TableContainer>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Video ID</Th>
                  <Th>Video Preview</Th>
                  <Th>Script</Th>
                  <Th>Created At</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={5}>
                      <Flex justify="center" py={4}>
                        <Text>Loading videos...</Text>
                      </Flex>
                    </Td>
                  </Tr>
                ) : videos?.length === 0 ? (
                  <Tr>
                    <Td colSpan={5}>
                      <Flex justify="center" py={4}>
                        <Text color="gray.500">No videos found</Text>
                      </Flex>
                    </Td>
                  </Tr>
                ) : videos?.map((video: Video) => (
                  <Tr key={video.id}>
                    <Td>
                      <Badge colorScheme="blue">{video.videoId}</Badge>
                    </Td>
                    <Td>
                      <Button
                        variant="link"
                        colorScheme="blue"
                        onClick={() => handleVideoClick(video)}
                      >
                        Preview Video
                      </Button>
                    </Td>
                    <Td maxW="300px" isTruncated>{video.script}</Td>
                    <Td>{new Date(video.createdAt!).toLocaleDateString()}</Td>
                    <Td>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(video.id)}
                        isLoading={deleteVideoMutation.isPending}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Video Preview</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedVideo && (
                <VStack spacing={4}>
                  <VideoPreview videoLink={selectedVideo.videoLink} />
                  <Text fontWeight="bold">Script:</Text>
                  <Text>{selectedVideo.script}</Text>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </DashboardLayout>
  )
} 