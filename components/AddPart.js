import { useMutation } from '@apollo/client'
import React, {useState} from 'react'
import {ADD_PART, GET_PARTS} from '../queries/parts'
import { store } from 'react-notifications-component'

function AddPart() {

    const [name,setName] = useState()
    const [description, setDescription] = useState()
    const [quantity, setQuantity] = useState()
    const [usePercentage, setUsePercentage] = useState(false)

    const [createPart] = useMutation(ADD_PART, {
        onCompleted(data) {
            const newData = Object.values(data)
            const refresh = newData.map(name => name.part)
            const refined = refresh.map(item => item.partName)
            store.addNotification({
                title: "Success!",
                message: `Part ${refined} is added`,
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
                message: `Part was not added`,
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
                    partName: name,
                    partDescription: description,
                    partQuantity: quantity,
                    usePercentage: usePercentage
                }
            }
        },
        refetchQueries: [
            { query: GET_PARTS }
        ]
    })

    const clearValues = () => {
        setName('')
        setDescription('')
        setQuantity('')
        setUsePercentage(false)
    }

    const percentageBoolean = (e) => {
        if(e.target.value === false) {
            setUsePercentage(false)
        } else {
            setUsePercentage(true)
        }
    }

    return (
        <div>
            <h1>Add Part</h1>
            <form onSubmit={(e) => {e.preventDefault(); createPart(); clearValues() }}>
                Name: <input name="name" label="Name" value={name} onChange={(e) => setName(e.target.value)}/><br /><br />
                Description: <input name="description" value={description} onChange={(e) => setDescription(e.target.value)}/><br /><br />
                Quantity: <input name="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))}/><br /><br />
                Percentage: <input type="checkbox" value={usePercentage} name="usePercentage" onChange={(e) => {percentageBoolean(e)}} /><br /><br />
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default AddPart