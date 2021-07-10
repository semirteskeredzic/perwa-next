import React, { createContext } from 'react'
import { useLocalObservable } from 'mobx-react-lite'

export const SearchContext = createContext()

export const SearchProvider = ({ children }) => {
    const store = useLocalObservable(() => ({
        searchResults: [],

        addSearchResults(data) {
            store.searchResults = data
        },

        clearSearchResults() {
            store.searchResults = []
        }
    }))

    return (
        <SearchContext.Provider value={store}>{children}</SearchContext.Provider>
    )
}

