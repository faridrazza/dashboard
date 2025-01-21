import axios from 'axios'
import { Video } from '../types'

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  throw new Error('API base URL not configured')
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const videoService = {
  async create(data: { videoLink: string; script: string; videoId: string }) {
    const response = await api.post('/api/videos/add-video', data)
    return response.data
  },

  async getAll() {
    const response = await api.get('/api/videos/get-all-videos')
    return response.data.videos
  },

  async delete(id: string) {
    const response = await api.delete(`/api/videos/delete-video/${id}`)
    return response.data
  },

  async getVideoById(id: string): Promise<Video> {
    const response = await api.get(`/api/videos/get-video/${id}`)
    return response.data
  },

  addVideo: async (video: Omit<Video, 'id'>): Promise<Video> => {
    const response = await api.post('/api/videos', video)
    return response.data
  },
} 