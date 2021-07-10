import { useMutation, useQuery } from '@apollo/client'
import React, {useEffect, useRef, useState} from 'react'
import { UPDATE_PART, GET_PARTS } from '../queries/parts'
import Loading from './Loading'
import styles from './UpdateProduct.module.css'
import useDidMountEffect from '../useDidMountEffect'
import { store } from 'react-notifications-component'

function UpdatePart(props) {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [quantity, setQuantity] = useState('')
    const [usePercentage, setUsePercentage] = useState(false)
    const [percentage, setPercentage] = useState()
    const [placeholderName, setPlaceholderName] = useState('')
    const [placeholderDescription, setPlaceholderDescription] = useState('')
    const [placeholderQuantity, setPlaceholderQuantity] = useState('')
    const [placeholderUsePercentage, setPlaceholderUsePercentage] = useState()
    const [placeholderPercentage, setPlaceholderPercentage] = useState('')
    const [partId, setPartId] = useState()
    const dropdown = useRef()

    useEffect(() => {
        console.log(props)
    },[])

    const {data, error, loading} = useQuery(GET_PARTS)

    const updateName = () => {
        if(name !== '') {
            return name
        } else {
            return placeholderName
        }
    }

    const updateDescription = () => {
        if(description !== '') {
            return description
        } else {
            return placeholderDescription
        }
    }

    const updateQuantity = () => {
        if(quantity !== '') {
            return quantity
        } else {
            return placeholderQuantity
        }
    }

    const updateUsePercentage = () => {
        return usePercentage
    }

    const updatePercentage = () => {
        if (percentage !== '') {
            return parseInt(percentage)
        } else {
            return parseInt(placeholderPercentage)
        }
    }

    const [updatePart] = useMutation(UPDATE_PART, {
        onCompleted(data) {
            const newData = Object.values(data)
            const refresh = newData.map(name => name.part)
            const refined = refresh.map(item => item.partName)
            store.addNotification({
                title: "Success!",
                message: `${refined} is updated!`,
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
        // onError() {
        //     store.addNotification({
        //         title: "Failed!",
        //         message: "Product is not updated!",
        //         type: "danger",
        //         insert: "top",
        //         container: "top-right",
        //         animationIn: ["animate__animated", "animate__fadeIn"],
        //         animationOut: ["animate__animated", "animate__fadeOut"],
        //         dismiss: {
        //             duration: 2000,
        //             onScreen: false
        //         }
        //     });
        // },
        variables: {
            input: {
                where: {
                    id: parseInt(partId)
                },
                data: {
                    partName: updateName(),
                    partDescription: updateDescription(),
                    partQuantity: updateQuantity(),
                    usePercentage: Boolean(updateUsePercentage()),
                    partPercentage: updatePercentage()
                }
            }
        }
    })

    // const handleChange = (e) => {
    //     const currentId = e.target.value
    //     setPartId(currentId)
    // }

    useEffect(() => {
        console.log('props partid',props.partId)
        setPartId(props.partId)
    },[])

    useDidMountEffect( () => {
        data?.parts.map(({id, partName, partDescription, partQuantity, usePercentage, partPercentage}) => {
            if(partId === id) {
                setPlaceholderName(partName)
                setPlaceholderDescription(partDescription)
                setPlaceholderQuantity(partQuantity)
                setUsePercentage(usePercentage)
                setPlaceholderPercentage(partPercentage)
            }
            // else if(partId === 'Please select a part') {
            //     setPlaceholderName('')
            //     setPlaceholderDescription('')
            //     setPlaceholderQuantity()
            //     setPlaceholderUsePercentage(false)
            // }
            return (
                placeholderName,
                placeholderDescription,
                placeholderQuantity,
                placeholderUsePercentage,
                placeholderPercentage
            )
        })
    }, [data?.parts, partId])

    const clearValues = () => {
        setName('')
        setDescription('')
        setQuantity('')
        setUsePercentage()
        setPlaceholderName('')
        setPlaceholderDescription('')
        setPlaceholderQuantity('')
        setPlaceholderUsePercentage()
        setPlaceholderPercentage('')
        // dropdown.current.value = ''
    }

    if(loading) return <Loading />
    if(error) return `Oops! An Error ${error} occurred`

    return(
        <>
            <h1 className={styles.heading}>Update Part</h1>
            {/*<select ref={dropdown} className={styles.selectField} name="parts" onChange={(e) => {handleChange(e)}}>*/}
            {/*    <option value={''}>Please select a part</option>*/}
            {/*    {data.parts.map(({id, partName}) => (*/}
            {/*        <option key={id} value={id}>{partName}</option>*/}
            {/*    ))}*/}
            {/*</select><br/>*/}
            <form onSubmit={(e) => {e.preventDefault(); updatePart(); clearValues(); props.editor()}}>
                <div className={styles.inputFields}>
                    <span className={styles.inputLabel}>Name:</span> <input name="name" placeholder={placeholderName} value={name} onChange={(e) => setName(e.target.value)} /><br/>
                    <span className={styles.inputLabel}>Description:</span> <input name="description" placeholder={placeholderDescription} value={description} onChange={(e) => setName(e.target.value)} /><br/>
                    <span className={styles.inputLabel}>Quantity:</span> <input name="quantity" placeholder={placeholderQuantity} value={quantity} onChange={(e) => setQuantity(e.target.value)} /><br/>
                    <span className={styles.inputLabel}>Use Percentage:</span><input name="usePercentage" type="checkbox" checked={usePercentage} onChange={(e) => setUsePercentage(e.currentTarget.checked)} /><br/>
                    <span className={`${styles.inputLabel} ${!usePercentage ? `${styles.hideShow}` : null}`}>Percentage:</span><input className={!usePercentage ? `${styles.hideShow}` : null} name="percentage" placeholder={placeholderPercentage} value={percentage} onChange={(e) => setPercentage(e.target.value)} /> <br/>
                </div>
                <button className={styles.btnPrimaryRe} type="submit">Update</button>
            </form>
        </>
    )
}

export default UpdatePart