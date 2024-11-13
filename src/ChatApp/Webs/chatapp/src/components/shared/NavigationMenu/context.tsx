import { createContext, useContext } from 'react'
import { MenuItem } from './types'

type NavigationMenuContextProps = {
  selectedItemsHistory: MenuItem[]
  currentSelectedItem?: MenuItem
  handleSelectItem: (item: MenuItem) => void
  handleGoBack: () => void
}

const NavigationMenuContext = createContext<NavigationMenuContextProps>({
  selectedItemsHistory: [],
  currentSelectedItem: undefined,
  handleSelectItem: () => {},
  handleGoBack: () => {}
})

export const NavigationMenuProvider = NavigationMenuContext.Provider

export const useNavigationMenu = () => {
  const context = useContext(NavigationMenuContext)
  return context
}
