import React from 'react'
import { useQuery, gql } from '@apollo/client';

const GET_STOCKEVENTS = gql`
  query {
    stockevents {
        id
      type
      quantity
    }
  }
`

function Stockevents () {

    const {loading, error, data} = useQuery(GET_STOCKEVENTS)

    if (loading) return <p> Loading ...</p>
    if (error) return <p> Error :(</p>

    return data.products.map(({id, type, quantity}) => (
    <div key={id}>
        <h1>{type}</h1>
        <p>{quantity}</p>
        <br/>
    </div>
    ))
}

export default Stockevents