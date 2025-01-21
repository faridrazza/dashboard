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
  Text,
  Badge,
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
    <Box 
      position="relative" 
      width={{ base: "120px", md: "160px" }}
      height={{ base: "68px", md: "90px" }}
      overflow="hidden" 
      borderRadius="md"
      border="1px"
      borderColor="gray.200"
    >
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

  return (
    <DashboardLayout>
      <VStack spacing={4} align="stretch">
        <Box p={4} borderWidth={1} borderRadius="lg" bg="white" boxShadow="sm">
          <Text fontSize="xl" fontWeight="bold" mb={4}>Add New Video</Text>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
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
                  rows={4}
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
                isLoading={addVideoMutation.isPending}
              >
                Add Video
              </Button>
            </VStack>
          </form>
        </Box>

        <Box borderWidth={1} borderRadius="lg" bg="white" boxShadow="sm">
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th width="15%">Video ID</Th>
                  <Th width="25%">Video Preview</Th>
                  <Th width="45%">Script</Th>
                  <Th width="15%">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td colSpan={4} textAlign="center" py={4}>
                      Loading videos...
                    </Td>
                  </Tr>
                ) : videos?.length === 0 ? (
                  <Tr>
                    <Td colSpan={4} textAlign="center" py={4}>
                      No videos found
                    </Td>
                  </Tr>
                ) : (
                  videos?.map((video: Video) => (
                    <Tr key={video.id}>
                      <Td>
                        <Badge colorScheme="blue">{video.videoId}</Badge>
                      </Td>
                      <Td>
                        <VideoPreview videoLink={video.videoLink} />
                      </Td>
                      <Td>
                        <Text noOfLines={2}>{video.script}</Text>
                      </Td>
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
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </VStack>
    </DashboardLayout>
  )
} 