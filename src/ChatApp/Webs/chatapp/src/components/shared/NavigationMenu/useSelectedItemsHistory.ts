import { useState, useEffect } from "react"
import type { MenuItem } from "./types"

export const useSelectedItemsHistory = () => {
  const [selectedItemsHistory, setSelectedItemsHistory] = useState<Array<MenuItem>>([])

  const currentSelectedItem = selectedItemsHistory[selectedItemsHistory.length - 1]

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItemsHistory((prev) => [...prev, item])
  }

  const handleGoBack = () => {
    setSelectedItemsHistory((prev) => {
      const newHistory = [...prev]
      newHistory.pop()
      return newHistory
    })
  }

  return {
    selectedItemsHistory,
    currentSelectedItem,
    handleSelectItem,
    handleGoBack
  }
}