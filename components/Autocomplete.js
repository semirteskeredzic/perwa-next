import React, {useContext, useState} from 'react'
import styles from './Autocomplete.module.css'
import {SearchContext} from "../store/SearchStore";
import {useObserver} from "mobx-react-lite";
import SearchResults from "./SearchResults";
import useComponentVisible from "./useComponentVisible";


function Autocomplete(props) {
    const store = useContext(SearchContext)

    const parts = props.parts
    const products = props.products

    const [activeSuggestion, setActiveSuggestion] = useState(0)
    const [filteredPartSuggestions, setFilteredPartSuggestions] = useState([])
    const [filteredProductSuggestions, setFilteredProductSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [userInput, setUserInput] = useState('')

    const onChange = e => {
        let partSuggestions = parts.parts.map(part => part.partName)
        let productSuggestions = products.products.map(product => product.productName)
        const userInput = e.currentTarget.value

        setFilteredPartSuggestions(partSuggestions.filter(
            suggestion =>
                suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        ))
        setFilteredProductSuggestions(productSuggestions.filter(
            suggestion =>
                suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        ))
        setShowSuggestions(true)
        setUserInput(e.currentTarget.value)
    }

    const onClick = e => {
        setShowSuggestions(false)
        setUserInput(e.currentTarget.innerText)
    }

    const onKeyDown = e => {
        if(e.keyCode === 13) {
            setShowSuggestions(false)
            handleSearch(e)
            // setUserInput(filteredPartSuggestions[activeSuggestion] || filteredProductSuggestions[activeSuggestion])
            // setUserInput(prevState => {return {...prevState, filteredProductSuggestions[activeSuggestion]}})
        }
        else if(e.keyCode === 38) {
            if(activeSuggestion === 0) {
                return
            }
            setActiveSuggestion(activeSuggestion - 1)
        }
        else if(e.keyCode === 40) {
            if(activeSuggestion - 1 === filteredPartSuggestions.length || activeSuggestion - 1 === filteredProductSuggestions.length) {
                return
            }
            setActiveSuggestion(activeSuggestion + 1)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        store.clearSearchResults()
        const searchedParts = parts.parts.filter((query) => query.partName.toLowerCase().includes(userInput))
        const searchedProducts = products.products.filter((query) => query.productName.toLowerCase().includes(userInput))
        let searchedResults
        if (searchedParts.length !== 0 && searchedProducts.length === 0) {
            searchedResults = [...searchedParts]
        } else if (searchedParts.length !== 0 && searchedProducts.length !== 0) {
            searchedResults = [...searchedParts, ...searchedProducts]
        } else if (searchedParts.length === 0 && searchedProducts.length !== 0 ) {
            searchedResults = [...searchedProducts]
        }
        store.addSearchResults(searchedResults)
    }

    let suggestionsListComponent
    // const { ref, isComponentVisible } = useComponentVisible(visibility)

    if(showSuggestions && userInput) {
        if(filteredPartSuggestions.length || filteredProductSuggestions.length) {
            suggestionsListComponent = (
                <table className="search-table">
                    <tbody className={styles.suggestions}>
                    <tr className="button-row"><td className={styles.xBtn} colSpan="2"><button className={styles.btnX} onClick={()=>{setShowSuggestions(false)}}>X</button></td></tr>
                    {filteredPartSuggestions.map((suggestion, index) => {
                        let className
                        if(index === activeSuggestion) {
                            className = "suggestion-active"
                        }
                        return(
                            <tr key={index}>
                                <td className={styles.tdClass} onClick={onClick}>
                                    {suggestion}
                                </td>
                                <td className={styles.searchLocation}>
                                    In Parts
                                </td>
                            </tr>
                        )
                    })}
                    {filteredProductSuggestions.map((suggestion, index) => {
                        let className
                        if(index === activeSuggestion) {
                            className = "suggestion-active"
                        }
                        return (
                            <tr key={index}>
                                <td className={styles.tdClass} onClick={onClick}>
                                    {suggestion}
                                </td>
                                <td className={styles.searchLocation}>
                                    In Products
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            )
        } else {
            suggestionsListComponent = (
                <div className={styles.suggestions}>
                    <em>No suggestions</em>
                </div>
            )
        }
    }

    return useObserver(() => (
        <div className={styles.searchContainer}>
            <input
                type="text"
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={userInput}
                className={styles.inputField}
            />
            <button className={styles.btnPrimaryRe} type="submit" onClick={handleSearch}>Search</button>
            {suggestionsListComponent}
            {store?.searchResults && store?.searchResults?.length ? <div> <SearchResults/> </div> : null}
        </div>
    ))
}

export default Autocomplete
