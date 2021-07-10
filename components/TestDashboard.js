import React from 'react'
import styles from './TestDashboard.module.css'
import AddPart from './AddPart'
import AddPartImage from './AddPartImage'
import AddPartToProduct from './AddPartToProduct'
import DefineProduct from './DefineProduct'
import Parts from './Parts'
import Products from './Products'
import UpdateProduct from './UpdateProduct'
import Autocomplete from "./Autocomplete";
import {useQuery} from "@apollo/client";
import {GET_PARTS} from "../queries/parts";
import {GET_PRODUCTS} from "../queries/products";
import Loading from "./Loading";
import UpdatePart from "./UpdatePart";

function TestDashboard() {

    const {loading: partsLoading, error: partsError, data: parts} = useQuery(GET_PARTS)
    const {loading: productsLoading, error: productsError, data: products } = useQuery(GET_PRODUCTS)
    if (partsLoading || productsLoading) return (<Loading />)
    if (partsError || productsError) return (<p> Error :(</p>)

    return (
        <div className={styles.mainContainer}>
            <div className={styles.mainTableContainer}>
                <Autocomplete parts={parts} products={products} />
            </div>
            <div className={`${styles.mainTableContainer} ${styles.partsTable}`}>
                <Parts />
            </div>
            <div className={styles.mainBoxesContainer}>
                <div className={styles.box}>
                    <AddPart />
                </div>
                <div className={styles.box}>
                    <UpdatePart />
                </div>
                <div className={styles.box}>
                    <AddPartImage />
                </div>
            </div>
            <div className={styles.mainTableContainer}>
                <Products />
            </div>
            <div className={styles.mainBoxesContainer}>
                <div className={styles.box}>
                    <DefineProduct />
                </div>
                <div className={styles.box}>
                    <UpdateProduct />
                </div>
                <div className={styles.box}>
                    <AddPartToProduct />
                </div>
            </div>
        </div>
    )
}

export default TestDashboard