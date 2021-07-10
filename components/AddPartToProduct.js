import { useQuery, useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { GET_PARTS } from '../queries/parts'
import {  GET_PRODUCTS, ADD_PART_TO_PRODUCT } from '../queries/products'
import Loading from './Loading'
import useDidMountEffect from '../useDidMountEffect'
import styles from './AddPartToProduct.module.css'

function AddPartToProduct() {

    const [selectedProductId, setSelectedProductId] = useState()
    const [selectedPartId, setSelectedPartId] = useState()
    const [selectedPartsArray, setSelectedPartsArray] = useState([])
    const [initialPartsOfSelectedProduct, setInitialPartsOfSelectedProduct] = useState([])
    const [checkedPart, setCheckedPart] = useState(false)
    const [showParts, setShowParts] = useState(false)

    const {data: parts, loading: partsLoading, error: partsError} = useQuery(GET_PARTS)
    const {data: products, loading: productsLoading, error: productsError} = useQuery(GET_PRODUCTS)   

    const handleProductChange = (e) => {
        const currentProductId = e.target.value
        setSelectedProductId(currentProductId)
    }

    const uncheckCheckboxes = () => {

    }

    const handleRemovePart = () => {
        
    }

    useDidMountEffect(() => {
        console.log('selectedid', selectedProductId)
        setInitialPartsOfSelectedProduct([])
        setShowParts(false)
        products.products.map((product) => {
            if(product.id === selectedProductId) {
                product.parts.map(({id}) => {
                    setInitialPartsOfSelectedProduct(prevState => [...prevState, id])
                })
            }
        })
        if (selectedProductId === 'Please select a product') {
            setShowParts(false)
        } else {
            setTimeout(() => {
                setShowParts(true)
            },10)
        }
    },[selectedProductId])

    useDidMountEffect(() => {
        setSelectedPartsArray(initialPartsOfSelectedProduct)
    },[initialPartsOfSelectedProduct])

    useDidMountEffect(() => {
        if(checkedPart) {
            console.log('what')
            setSelectedPartsArray(prevState => [...prevState, selectedPartId])
            console.log('SelectedPartsArrayMount', selectedPartsArray)
        } else {
            console.log('if')
            const filteredArray = selectedPartsArray.filter(part => part !== selectedPartId)
            console.log('arr',filteredArray)
        }
    },[checkedPart])

    const handlePartChange = (e) => {
        const currentPartId = e.target.value
        const currentCheck = e.target.checked
        setCheckedPart(currentCheck)
        console.log('SelectedPartsArrayChange', selectedPartsArray)
        setSelectedPartId(currentPartId)
    }

    const [addPartToProduct] = useMutation(ADD_PART_TO_PRODUCT, {
        variables: {
            input: {
                where: {
                    id: parseInt(selectedProductId)
                },
                data: {
                    parts: parseInt(selectedPartsArray)
                }
            }
        }
    })

    if (partsLoading || productsLoading) return <Loading />
    if (partsError || productsError) return 'Oops, something went wrong'

    return (
        <div>
            <h1>Add Parts to Products</h1>
            <select name="products" onChange={(e) => {handleProductChange(e)}}>
                <option value={null}>Please select a product</option>
                {products.products.map(({id, productName}) => (
                    <option key={id} value={id}>{productName}</option>
                ))}
            </select><br />
            {showParts ? 
            <form onSubmit={(e) => {e.preventDefault(); addPartToProduct(); setSelectedPartId([])}}>      
                <legend>Select parts</legend>
                <ul className={styles.ulList} onChange={(e) => {handlePartChange(e)}}>
                    {parts.parts.map(({id, partName }) => (
                        <li className={styles.listingElement} key={id}>
                            <input 
                                type="checkbox" 
                                value={id}
                                disabled={initialPartsOfSelectedProduct.includes(id) ? "disabled" : ""}
                                /> <span className={styles.removePartName}>{partName}</span>
                                {initialPartsOfSelectedProduct.includes(id) ? <span className={styles.removePartText} onClick={handleRemovePart()}>Remove</span> : null}
                        </li>
                    ))}
                </ul> 
                <br/>      
                <button type="submit">Add Selected</button>          
            </form> : null}
        </div>
    )
}

export default AddPartToProduct