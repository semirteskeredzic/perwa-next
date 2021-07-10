import React, { useState } from 'react'
import {gql, useMutation} from '@apollo/client'

const REGISTER = gql `
    mutation registeruser($input: UsersPermissionsRegisterInput!) {
        register(input: $input) 
        {
            jwt
            user{
                username
                email
            }
        }
}
`

function Register() {
    const[username,setUsername] = useState()
    const[password,setPassword] = useState()
    const[email,setEmail] = useState()

    const resetInput = () => {
        setUsername('')
        setPassword('')
        setEmail('')
    }

    const [userRegister] = useMutation(REGISTER, {
        variables: 
            {
                input: {
                    username: username,
                    email: email,
                    password: password
                }
            },
        update: (proxy, {data: {register}}) => {
            console.log(JSON.stringify(register))
        },
        onCompleted: resetInput
    })

    return (
        <div>
            <h1>Register page</h1>
            <form onSubmit={e => { e.preventDefault(); userRegister(); }}>
                <input name="username" onChange={(e) => {setUsername(e.target.value)}}/><br/>
                <input name="email" onChange={(e) => {setEmail(e.target.value)}}/><br/>
                <input name="password" onChange={(e) => {setPassword(e.target.value)}} /><br/>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Register