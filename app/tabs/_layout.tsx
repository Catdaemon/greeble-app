import { Tabs } from 'expo-router'
import { shallow } from 'zustand/shallow'
import Icon from '../../src/components/Icon'
import { useAccountStore } from '../../src/stores/accountStore'

const routeIcons = {
  feed: 'Home',
  search: 'Search',
  settings: 'Cog',
  account: 'UserCircle',
  messages: 'Mail'
}

export default function Layout() {
  const [hasAnyAccounts, activeAccount, accounts] = useAccountStore(
    (state) => [state.hasAnyAccounts, state.activeAccount, state.accounts],
    shallow
  )

  const activeAccountName =
    (hasAnyAccounts()
      ? accounts?.find((x) => x.accountID === activeAccount)
      : null
    )?.username ?? 'Account'

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        // tabBarStyle: {
        //   display: hasAnyAccounts() ? 'flex' : 'none'
        // },
        tabBarIcon: ({ focused, size }) => {
          if (Object.hasOwn(routeIcons, route.name)) {
            const iconName = routeIcons[route.name]

            return (
              <Icon
                name={iconName}
                color={focused ? '$primaryColor' : '$textColor'}
              />
            )
          }
          return <Icon name="Table" />
        }
      })}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed'
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search'
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: activeAccountName
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages'
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings'
        }}
      />
    </Tabs>
  )
}
