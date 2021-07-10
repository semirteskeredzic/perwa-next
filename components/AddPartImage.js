import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const UPLOAD_PART_IMAGE = gql`
    mutation($file: Upload!) {
        upload(file: $file) {
            id
            name
        }
    } 
`

function AddPartImage() {

    const [image, setImage] = useState()

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    
    //     client.mutate({
    //         mutation: UPLOAD_PART_IMAGE,
    //         variables: {
    //             file: image
    //         }
    //     }).then(res => {
    //         console.log(res);
    //     }).catch(err => {
    //         console.error(err);
    //     })
    // }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('image', image)
        addImage().then(res => {console.log('res', res)}).catch(err => {console.log('err',err)})
    }

    const [addImage] = useMutation(UPLOAD_PART_IMAGE, {
        variables: {
            file: image,
        }
    })

    return (
        <div>
            <form onSubmit={(event) => {handleSubmit(event)}}>
                <input type="file" name="files" alt="image" onChange={(e) => {setImage(e.target.files[0])}} />
                <button type="submit">Save</button>
            </form>
        </div>
    )
}

export default AddPartImage