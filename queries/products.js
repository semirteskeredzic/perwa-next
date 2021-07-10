import { gql } from '@apollo/client'

export const GET_PRODUCTS = gql`
    query ($limit: Int, $start: Int) {
        products (limit: $limit, start: $start) {
            id
            productName
            productDescription
            productQuantity
            parts {
                id
                partName
                partQuantity
            }
        }
    }
`

export const DEFINE_PRODUCT = gql`
    mutation createProduct($input: createProductInput) {
        createProduct(input: $input) {
            product {
                id
                productName
                productDescription
            }
        }
    }
`

export const UPDATE_PRODUCT = gql`
    mutation updateProduct($input: updateProductInput) {
        updateProduct(input: $input) {
            product {
                id
                productName
                productDescription
                productQuantity
            }
        }
    }
`

export const DELETE_PRODUCT = gql `
    mutation deleteProduct($input: deleteProductInput) {
        deleteProduct(input: $input) {
            product {
                id
                productName
                productDescription
                productQuantity
            }
        }
    }
`

export const ADD_PART_TO_PRODUCT = gql`
    mutation updateProduct($input: updateProductInput) {
        updateProduct(input: $input) {
            product {
                id
                parts {
                    id
                    partName
                }
            }
        }
    }
`

export const COUNT_PRODUCTS = gql`
    query {
        productsCount
    }
`