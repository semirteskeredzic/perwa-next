import React, { useState } from 'react'
import {gql, useMutation} from '@apollo/client'

const LOGIN = gql `
    mutation loginuser($input: UsersPermissionsLoginInput!) {
        login(input: $input) 
        {
            user{
                username
                email
                role {
                    type
                }
            }
        }
}
`

function Login() {

    const[username,setUsername] = useState()
    const[password,setPassword] = useState()

    const resetInput = () => {
        setUsername('')
        setPassword('')
    }

    const [userLogin] = useMutation(LOGIN, {
        variables: 
            {
                input: {
                    identifier: username,
                    password: password
                }
            },
        update: (proxy, {data: {login}}) => {
            console.log(JSON.stringify(login))
        },
        onCompleted: resetInput
    })

    return (
        <div>
            <h1>Login page</h1>
            <form onSubmit={e => { e.preventDefault(); userLogin(); }}>
                <input name="username" onChange={(e) => {setUsername(e.target.value)}}/><br/>
                <input name="password" onChange={(e) => {setPassword(e.target.value)}} /><br/>
                <button type="submit">Submit</button>
            </form>
            <p>LOL</p>
        </div>
    )
}

export default Login