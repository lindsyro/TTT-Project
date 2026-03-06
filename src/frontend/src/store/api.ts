import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/',
})

api.interceptors.request.use((config) => {
  const userId = sessionStorage.getItem('userId')

  if (userId && config.headers) {
    config.headers['x-user-id'] = userId
  }

  return config
})

export default api
