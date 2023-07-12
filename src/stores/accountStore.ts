import * as ExpoSecureStore from 'expo-secure-store'
import * as Crypto from 'expo-crypto'
import { create } from 'zustand'
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware'

export interface Account {
  accountID: string
  serverURL: string
  username: string
  token?: string
}

const secureStoreOptions = {
  keychainAccessible: ExpoSecureStore.WHEN_UNLOCKED
}

const zustandSecureStore: StateStorage = {
  setItem: (name, value) =>
    ExpoSecureStore.setItemAsync(name, value, secureStoreOptions),
  getItem: (name) => ExpoSecureStore.getItemAsync(name, secureStoreOptions),
  removeItem: (name) =>
    ExpoSecureStore.deleteItemAsync(name, secureStoreOptions)
}

export interface AccountStoreState {
  accounts: Account[]
  activeAccount: string | null
}

export interface AccountStoreActions {
  addAccount: (account: Omit<Account, 'accountID'>) => string
  removeAccount: (accountID: string) => void
  setActiveAccount: (accountID: string) => void
  getActiveAccount: () => Account | null
  hasAnyAccounts: () => boolean
  clear: () => void
}

const defaultState: AccountStoreState = {
  accounts: [],
  activeAccount: null
}

type AccountStore = AccountStoreState & AccountStoreActions

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      addAccount: (account: Account) => {
        account.accountID = Crypto.randomUUID()
        set((state) => ({
          accounts: [...state.accounts, account]
        }))
        return account.accountID
      },
      removeAccount: (accountID: string) => {
        set((state) => ({
          accounts: state.accounts.filter(
            (account) => account.accountID !== accountID
          )
        }))
      },
      setActiveAccount: (accountID: string) => {
        set((state) => ({
          activeAccount: accountID
        }))
      },
      getActiveAccount: () => {
        return (
          get().accounts.find((x) => x.accountID === get().activeAccount) ||
          null
        )
      },
      hasAnyAccounts: () => {
        return get().accounts.length > 0
      },
      clear: () => {
        set(defaultState)
      }
    }),
    {
      name: 'account-store',
      storage: createJSONStorage(() => zustandSecureStore)
    }
  )
)
