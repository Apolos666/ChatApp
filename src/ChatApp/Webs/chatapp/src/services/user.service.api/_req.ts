import axios from 'axios'
import { PersistedStateKey } from '@/data/persisted-keys'
import { getLocalStorageItem } from '@/utils/local-storage'

const publicInstance = axios.create({
  baseURL: 'http://localhost:8080/api/',
})

const privateInstance = axios.create({
  baseURL: 'http://localhost:8080/api/'
})

privateInstance.interceptors.request.use(
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

export const privateReq = privateInstance
export const publicReq = publicInstance

export const httpGetPrivate = privateReq.get
export const httpPostPrivate = privateReq.post
export const httpPutPrivate = privateReq.put
export const httpDelPrivate = privateReq.delete

export const httpGetPublic = publicReq.get
export const httpPostPublic = publicReq.post
export const httpPutPublic = publicReq.put
export const httpDelPublic = publicReq.delete
