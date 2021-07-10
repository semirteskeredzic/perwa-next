import { useMutation } from '@apollo/client'
import React, {useState} from 'react'
import {DEFINE_PRODUCT, GET_PRODUCTS} from '../queries/products'
import { store } from 'react-notifications-component'

function DefineProduct() {

    const [name,setName] = useState()
    const [description, setDescription] = useState()

    const [defineProduct] = useMutation(DEFINE_PRODUCT, {
        onCompleted(data) {
            const newData = Object.values(data)
            const refresh = newData.map(name => name.product)
            const refined = refresh.map(item => item.productName)
            store.addNotification({
                title: "Success!",
                message: `Product ${refined} is defined!`,
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
                message: "Product is not defined!",
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
                data: {
                    productName: name,
                    productDescription: description,
                }
            }
        },
        refetchQueries: [
            { query: GET_PRODUCTS }
        ]
    })

    const clearValues = () => {
        setName('')
        setDescription('')
    }

    return (
        <div>
            <h1>Define Product</h1>
            <form onSubmit={(e) => {e.preventDefault(); defineProduct(); clearValues();}}>
                Name: <input name="name" label="Name" value={name} onChange={(e) => setName(e.target.value)}/><br /><br />
                Description: <input name="description" value={description} onChange={(e) => setDescription(e.target.value)}/><br /><br />
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default DefineProduct