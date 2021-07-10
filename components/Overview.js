import React from 'react'
import { gql, useQuery } from '@apollo/client'
import UpdateQty from './UpdateQty'
import Loading from './Loading'

const OVERVIEW = gql`
    query {
        products {
            id
            Name
            Description
            parts {
                id
                Name
                Description
                Quantity
            }
        }
    }
`

function Overview () {

    const {loading, error, data} = useQuery(OVERVIEW)

    if (loading) return <Loading />
    if (error) return <p> Error :(</p>

     return data.products.map(({id, Name, Description, parts}) => (
        <div key={id}>
        <h1>{Name}</h1>
        <p>{Description}</p>
        {parts.map(({id, Name, Description, Quantity}) => (
            <div key={Name}>
                <h3>Name: {Name}</h3>
                <p>Desc: {Description}</p>
                <p>Q: {Quantity}</p>
                <p>Enter new Quantity:</p>
                <UpdateQty id={id}/>
            </div>
        ))}
        <br/>
        </div>
    ))
}

export default Overview