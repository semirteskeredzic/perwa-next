import React, { useEffect, useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const UPDATE_PART_QTY = gql`
    mutation updatePart($input: updatePartInput){
        updatePart(input: $input){
                part {
                    id
                    Name
                    Quantity
                }
        }
}
`

function UpdateQty(props) {

        const [partQty, setPartQty] = useState()

    const resetInput = () => {
        setPartQty('')
    }

    const [updatePart] = useMutation(UPDATE_PART_QTY, {
        variables: 
            {
                input: {
                    where: {
                        id: props.id
                    },
                    data: {
                        Quantity: partQty
                    }
                }
            },
        update: (proxy, {data: {updatePart}}) => {
            console.log(JSON.stringify(updatePart))
        },
        onCompleted: resetInput
    })

    

    return (
        <form onSubmit={e => {e.preventDefault(); updatePart();}}>
            <input name="newQuantity" value={partQty} onChange={(e) => {setPartQty(parseInt(e.target.value))}}/>
            <button>Submit</button>
        </form>
    )
}

export default UpdateQty