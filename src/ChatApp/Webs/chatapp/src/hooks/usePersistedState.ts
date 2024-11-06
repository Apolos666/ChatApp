import { useState, useEffect } from "react"
import { PersistedStateKey } from '@/data/persisted-keys'
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/local-storage'

export function usePersistedState<T>(key: PersistedStateKey, initialValue: T) {
  const [persistedValue, setPersistedValue] = useState(() => {
    const item = getLocalStorageItem(key)
    return (item as T) || initialValue
  })

  useEffect(() => {
    setLocalStorageItem(key, persistedValue)
  }, [persistedValue, key])

  return [persistedValue, setPersistedValue] as const
}