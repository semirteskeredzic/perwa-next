import React, { useState, useEffect } from 'react'
import {DELETE_PRODUCT, GET_PRODUCTS, COUNT_PRODUCTS} from '../queries/products'
import {NetworkStatus, useMutation, useQuery} from '@apollo/client'
import { store } from 'react-notifications-component'
import Loading from './Loading'
import styles from './Products.module.css'

function Products() {

    const [productLimit, setProductLimit] = useState()
    const [productStart, setProductStart] = useState()
    const [numOfPages, setNumOfPages] = useState()
    const [pages, setPages] = useState([])
    const [currentPage, setCurrentPage] = useState()
    const [clickedPage, setClickedPage] = useState()

    // Default limits for number of items per page
    const [pageLimits, setPageLimits] = useState([5,8,10,12])

    const {data, error, loading, refetch, networkStatus} = useQuery(GET_PRODUCTS, {
        notifyOnNetworkStatusChange: true,
        variables: {
            limit: productLimit,
            start: productStart
        }
    })

    const {loading: countLoading, error: countError, data: numberOfProducts} = useQuery(COUNT_PRODUCTS)

    const [productDelete] = useMutation(DELETE_PRODUCT, {
        onCompleted(data) {
            const newData = Object.values(data)
            const refresh = newData.map(name => name.product)
            const refined = refresh.map(item => item.productName)
            store.addNotification({
                title: "Success!",
                message: `${refined} is deleted!`,
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 2000,
                    onScreen: false
                }
            });
        },
        onError() {
            store.addNotification({
                title: "Failed!",
                message: "Product is not deleted!",
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 2000,
                    onScreen: false
                }
            });
        },
        refetchQueries: [
            { query: GET_PRODUCTS}
        ]
    })

    // On component mount default Start, Limit, and current page are defined with default values
    useEffect(() => {
        setProductStart(0)
        setProductLimit(5)
        setCurrentPage(1)
        setClickedPage(1)
    },[])

    // When we get total number of products through Query we are calling method to calculate pages
    useEffect(() => {
        if(numberOfProducts) {
            calculatePages()
        }
    },[numberOfProducts])

    useEffect(() => {
        if(numberOfProducts) {
            calculatePages()
        }
    },[productLimit])

    useEffect(() => {
        if(clickedPage === 1) {
            setProductStart(0)
            setCurrentPage(clickedPage)
        } else {
            let startValue = ((clickedPage - 1) * productLimit)
            setProductStart(startValue)
            setCurrentPage(clickedPage)
        }
    },[clickedPage])

    if (networkStatus === NetworkStatus.refetch) return <Loading/>
    if (loading && countLoading) return <Loading />
    if (error) return <p> Error Occurred: `${error}`</p>
    if (countError) return <p> Error Occurred: `${countError}`</p>

    const deleteProduct = (e,id) => {
        e.preventDefault()
        e.stopPropagation()
        productDelete({
            variables: {
                input: {
                    where: {
                        id: id
                    }
                }
            }
        })
    }

    // Method that takes total number of products and divides it with defined limit.
    // Rounding up provides total number ofa pages. For loop pushes one page number
    // for each page out of total number of pages and sets it up inside Pages array
    const calculatePages = () => {
        setPages([])
        let rawNumOfPages = numberOfProducts.productsCount / productLimit
        let roundedNumOfPages = Math.ceil(rawNumOfPages)
        setNumOfPages(roundedNumOfPages)
        for(let page = 1; page <= roundedNumOfPages; page++) {
            setPages(prevState => [...prevState, page])
        }
    }

    // Method that sets current limit parameter for the get products query
    // and calls method to calculate pages based on the selected limit
    const handleProductLimit = (e) => {
        setProductLimit(parseInt(e.target.value))
        calculatePages()
        setClickedPage(1)
    }

    // This method sets clicked page to the page that has been clicked
    const selectPage = (e) => {
        setClickedPage(parseInt(e.currentTarget.value))
    }

    // This method serves as next page i.e. it adds one to the current page
    const selectNext = () => {
        setClickedPage(parseInt(currentPage + 1))
    }

    // This method serves as previous page i.e. it subtracts one from the current page
    const selectPrev = () => {
        setClickedPage(parseInt(currentPage - 1))
    }

     return (
         <>
        <h1 className={styles.headingOne}>Products List</h1>
             <button onClick={() => refetch()}>Refresh</button>
        <table className={styles.tableContainer}>
        <thead>
        <tr>
            <th className={styles.thClass}>ID</th>
            <th className={styles.thClass}>Product Name</th>
            <th className={styles.thClass}>Product Description</th>
            <th className={styles.thClass}>Product Quantity</th>
            <th className={styles.thClass}>Number of Parts</th>
        </tr>
        </thead>
        {data?.products && data?.products.length !== 0 ?
        <tbody>
        {data?.products.map(({id, productName, productDescription, productQuantity, parts}) => (
            <tr key={id}>
                <td className={styles.tdClass}>{id}</td>
                <td className={styles.tdClass}>{productName}</td>
                <td className={styles.tdClass}>{productDescription}</td>
                <td className={styles.tdClass}>{productQuantity}</td>
                <td className={styles.tdClass}>{parts.length}</td>
                <td onClick={(e) => deleteProduct(e,id) }>X</td>
            </tr>
        ))}
        </tbody> : <tbody><tr><td colSpan={6}>No products to show!</td></tr></tbody>}
        </table>
             <select onChange={(e) => handleProductLimit(e)}>
                 {pageLimits && pageLimits.map((limit, i) => (
                     <option value={limit} key={i}>{limit}</option>
                 ))}
             </select>
             <div className={styles.paginationProductsContainer}>
                 {currentPage !== 1 ? <button onClick={() => {selectPrev()}}>Prev</button> : null}
                 {pages &&
                 pages.map(page => {
                     return <button key={page} value={page} className={`${clickedPage === page ? 'active' : `styles.paginationBox`}`} onClick={(e) => {selectPage(e)}}>{page}</button>
                 })
                 }
                 {currentPage !== numOfPages ? <button onClick={() => {selectNext()}}>Next</button> : null}
             </div>
    </>
     )
}

export default Products