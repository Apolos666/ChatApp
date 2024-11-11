import axios from 'axios'
import { PersistedStateKey } from '@/data/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'

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
export const httpGet = req.get
export const httpPost = req.post
export const httpPut = req.put
export const httpDel = req.delete