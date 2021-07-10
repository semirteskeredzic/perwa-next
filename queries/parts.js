import { gql } from '@apollo/client'

export const GET_PARTS = gql `
    query ($limit: Int, $start: Int) {
        parts (limit: $limit , start: $start) {
            id
            partName
            partDescription
            partQuantity
            usePercentage
            partPercentage
            created_at
            updated_at
            products {
                id
                productName
            }
        }
    }
`

export const DELETE_PART = gql `
    mutation deletePart($input: deletePartInput) {
        deletePart(input: $input) {
            part {
                id
                partName
            }
        }
    }
`

export const ADD_PART = gql`
    mutation createPart($input: createPartInput) {
        createPart(input: $input) {
            part {
                id
                partName
                partDescription
                partQuantity
                usePercentage
            }
        }
    }
`

export const UPDATE_PART = gql `
    mutation updatePart($input: updatePartInput) {
        updatePart(input: $input) {
            part {
                id
                partName
                partDescription
                partQuantity
                partPercentage
            }
        }
    }
`

export const COUNT_PARTS_OF_PRODUCTS = gql`
    query {
        partsConnection {
            groupBy: values {
                products {
                    id
                }
            }
        }
    }
`

export const COUNT_PARTS = gql`
    query {
        partsCount
    }
`