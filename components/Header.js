import React from 'react'
import Autocomplete from "./Autocomplete";
import {useQuery} from "@apollo/client";
import {GET_PARTS} from "../queries/parts";
import {GET_PRODUCTS} from "../queries/products";
import Loading from "./Loading";
import styles from './Header.module.css'

function Header() {

    const {loading: partsLoading, error: partsError, data: parts} = useQuery(GET_PARTS)
    const {loading: productsLoading, error: productsError, data: products } = useQuery(GET_PRODUCTS)
    if (partsLoading || productsLoading) return (<Loading />)
    if (partsError || productsError) return (<p> Error :(</p>)

    return (
        <div className={styles.headerBar}>
           <div className={styles.sidebarPlug}/>
	   <Autocomplete parts={parts} products={products} />
        </div>
    )
}

export default Header
