import axios from 'axios'
import { PersistedStateKey } from '@/data/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'

// const adminInstance = axios.create({
//   baseURL: 'http://localhost:8011/proxy/api/',
// })

const adminInstance = axios.create({
  baseURL: 'http://127.0.0.1:8085/api',
})

adminInstance.interceptors.request.use(
  (config) => {
    const token = getLocalStorageItem(PersistedStateKey.Token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  }, 
  (error) => {
    return Promise.reject(error)  
  }
)

export const req = adminInstance
export const httpGet = (url: string) => req.get(url)
export const httpPost = (url: string, data?: any) => req.post(url, data)
export const httpPut = (url: string, data?: any) => req.put(url, data)
export const httpDel = (url: string) => req.delete(url)