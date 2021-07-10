import React, {useContext} from 'react'
import {SearchContext} from "../store/SearchStore";
import {useObserver} from "mobx-react-lite";
import styles from './SearchResults.module.css'

function SearchResults() {
    const store = useContext(SearchContext)

    const handleClear = () => {
        store.clearSearchResults()
    }

    const results = store.searchResults
    // console.log('results',results)

    return useObserver(() => (

        <>
            <h1>Search Results</h1>
            <div className={styles.resultField}>
                {results?.map((result) =>
                    (result.__typename === 'Part' ?
                    <div className={styles.resultCard} key={result.id}>
                        <p>Name: {result.partName}</p>
                        <p>Quantity: {result.partQuantity}</p>
                        {result.products.length !== 0 ? <p>Part of product(s): {result.products.map((product) => product.productName)}</p>  : null}
                        <p>Type: {result.__typename}</p>
                    </div>
                        :
                    <div className={styles.resultCard} key={result.id}>
                        <p>Name: {result.productName}</p>
                        <p>Quantity: {result.productQuantity}</p>
                        <p>Type: {result.__typename}</p>
                    </div>)
                )}
            </div>
            <button onClick={handleClear}>Clear Results</button>
        </>
    ))
}

export default SearchResults
