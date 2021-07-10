import { useMutation, useQuery } from '@apollo/client'
import React, {useRef, useState} from 'react'
import { UPDATE_PRODUCT, GET_PRODUCTS } from '../queries/products'
import Loading from './Loading'
import styles from './UpdateProduct.module.css'
import useDidMountEffect from '../useDidMountEffect'
import { store } from 'react-notifications-component'
import { parse } from 'graphql'

function UpdateProduct() {

    const [name,setName] = useState('')
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState('')
    const [productId, setProductId] = useState()
    const [placeholderName, setPlaceholderName] = useState()
    const [placeholderDescription, setPlaceholderDescription] = useState()
    const [placeholderQuantity, setPlaceholderQuantity] = useState()
    const dropdown = useRef()

    const {data, error, loading} = useQuery(GET_PRODUCTS)

    const handleChange = (e) => {
        const currentId = e.target.value
        setProductId(currentId)
    }

    useDidMountEffect(() => {
        data.products.map(({id, productName, productDescription, productQuantity}) => {
            if(productId === id) {
                setPlaceholderName(productName)
                setPlaceholderDescription(productDescription)
                setPlaceholderQuantity(productQuantity)
            } else if(productId === 'Please select a product') {
                setPlaceholderName('')
                setPlaceholderDescription('')
                setPlaceholderQuantity()
            }
            return (
                placeholderName,
                placeholderDescription,
                placeholderQuantity
            )
        })
    },[productId])

    const updateName = () => {
        if(name !== '') {
            return name
        } else {
            return placeholderName
        }
    }

    const updateDescription = () => {
        if(description !== '') {
            return description
        } else {
            return placeholderDescription
        }
    }

    const updateQuantity = () => {
        if(quantity !== '') {
            return quantity
        } else {
            return placeholderQuantity
        }
    }

    const [updateProduct] = useMutation(UPDATE_PRODUCT, {
        onCompleted(data) {
            const newData = Object.values(data)
            const refresh = newData.map(name => name.product)
            const refined = refresh.map(item => item.productName)
            store.addNotification({
                title: "Success!",
                message: `${refined} is updated!`,
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
                message: "Product is not updated!",
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
        variables: {
            input: {
                where: {
                    id: parseInt(productId)
                },
                data: {
                    productName: updateName(),
                    productDescription: updateDescription(),
                    productQuantity: updateQuantity()
                }
            }
        }
    })

    if (loading ) return <Loading />
    if (error ) return <p> Oops! Something went wrong!</p>

    const clearValues = () => {
        setName('')
        setDescription('')
        setQuantity('')
        setPlaceholderName('')
        setPlaceholderDescription('')
        setPlaceholderQuantity('')
        dropdown.current.value = ''
    }

    return (
        <div>
            <h1>Update Product</h1>
            <select ref={dropdown} className={styles.selectField} name="products" onChange={(e) => {handleChange(e)}}>
                <option value={''}>Please select a product</option>
                {data.products.map(({id, productName}) => (
                    <option key={id} value={id}>{productName}</option>
                ))}
            </select><br />
            <form onSubmit={(e) => {e.preventDefault(); updateProduct(); clearValues();}}>
                Name: <input name="name" label="Name" placeholder={placeholderName} value={name} onChange={(e) => setName(e.target.value)}/><br /><br />
                Description: <input name="description" placeholder={placeholderDescription} value={description} onChange={(e) => setDescription(e.target.value)}/><br /><br />
                Quantity: <input name="quantity" placeholder={placeholderQuantity} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}/><br /><br />
                <button type="submit">Update</button>
            </form>
        </div>
    )
}

export default UpdateProduct