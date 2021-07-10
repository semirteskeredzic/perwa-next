import React, { useState, useEffect } from 'react'
import {DELETE_PART, GET_PARTS, COUNT_PARTS } from '../queries/parts'
import {NetworkStatus, useQuery, useMutation } from '@apollo/client'
import { store } from 'react-notifications-component'
import Loading from './Loading'
import styles from './Parts.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faFax, faSyncAlt, faTrash, faXRay,} from "@fortawesome/free-solid-svg-icons";
import UpdatePart from "./UpdatePart";
import {faPen} from "@fortawesome/free-solid-svg-icons/faPen";


function Parts() {

    const [partLimit, setPartLimit] = useState()
    const [partStart, setPartStart] = useState()
    const [numOfPages, setNumOfPages] = useState()
    const [pages, setPages] = useState([])
    const [currentPage, setCurrentPage] = useState()
    const [clickedPage, setClickedPage] = useState()
    const [editor, setEditor] = useState(false)
    const [editPart, setEditPart] = useState()
    const [areYouSureModal, setAreYouSureModal] = useState(false)
    const [currentElementForDelete, setCurrentElementForDelete] = useState()
    const [currentIdForDelete, setCurrentIdForDelete] = useState()

    // Setting default limits for number of items per page
    const [pageLimits, setPageLimits] = useState([5, 8, 10, 12])

    // Initial query to get all parts
    const {loading, error, data, refetch, networkStatus} = useQuery(GET_PARTS,
        {

            notifyOnNetworkStatusChange: true,
            variables: {
                limit: partLimit,
                start: partStart
            }
        })

    // Query to fetch total count of parts
    const {loading: countLoading, error: countError, data: numberOfParts} = useQuery(COUNT_PARTS)

    // Delete mutation for specific part along with notifications for success and failure
    const [partDelete] = useMutation(DELETE_PART, {
        onCompleted(data) {
            const newData = Object.values(data)
            const refresh = newData.map(name => name.part)
            const refined = refresh.map(item => item.partName)
            store.addNotification({
                title: "Success!",
                message: `${refined} is deleted!`,
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
                message: "Part is not deleted!",
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
        refetchQueries: [
            {query: GET_PARTS}
        ]
    })

    // On mounting the component Start, Limit, and current Page is defined with default values
    useEffect(() => {
        setPartStart(0)
        setPartLimit(5)
        setCurrentPage(1)
        setClickedPage(1)
        console.log(data?.parts)
    }, [])

    // When Initial Query for total number of parts is executed and the data for number of
    // parts is available the calculatePages method is called to calculate number of pages
    useEffect(() => {
        if (numberOfParts) {
            calculatePages()
        }
    }, [numberOfParts])

    useEffect(() => {
        if (numberOfParts) {
            calculatePages()
        }
    }, [partLimit])

    useEffect(() => {
        if (clickedPage === 1) {
            setPartStart(0)
            setCurrentPage(clickedPage)
        } else {
            let startValue = ((clickedPage - 1) * partLimit)
            setPartStart(startValue)
            setCurrentPage(clickedPage)
        }
    }, [clickedPage])

    // Conditions that handle re-fetching network status, Loading status, and Error status
    if (networkStatus === NetworkStatus.refetch) return <Loading/>
    if (loading && countLoading) return <Loading/>
    if (error && countError) return <p> Error Occurred: `${error}`</p>

    //Are you sure method upon clicking to delete item
    const tryDeletePart = (e, id) => {
        setAreYouSureModal(true)
        setCurrentElementForDelete(e)
        setCurrentIdForDelete(id)
    }

    // Method that takes the id of the part to be deleted and forwards it to the query argument
    const deletePart = (e, id) => {
        e.preventDefault()
        e.stopPropagation()
        partDelete({
            variables: {
                input: {
                    where: {
                        id: id
                    }
                }
            }
        })
    }

    // Method that takes total number of parts and divides it with the defined limit. Rounding up
    // provides total number of pages. For loop pushes one page number for each page out of total
    // number of pages and sets it up to Pages array.
    const calculatePages = () => {
        setPages([])
        let rawNumOfPages = numberOfParts.partsCount / partLimit
        let roundedNumOfPages = Math.ceil(rawNumOfPages)
        setNumOfPages(roundedNumOfPages)
        for (let page = 1; page <= roundedNumOfPages; page++) {
            setPages(prevState => [...prevState, page])
        }
    }

    // Method that sets current limit parameter for the get parts query
    // and calls method to calculate pages based on the selected limit.
    const handlePartLimit = (e) => {
        setPartLimit(parseInt(e.target.value))
        calculatePages()
        setClickedPage(1)
    }

    // This method sets clicked page to the page that has been clicked
    const selectPage = (e) => {
        setClickedPage(parseInt(e.currentTarget.value))
    }

    // This method serves as next page i.e. it adds one to the current page
    const selectNext = () => {
        setClickedPage(parseInt(currentPage + 1))
    }

    // This method serves as previous page i.e. it subtracts one from the current page
    const selectPrev = () => {
        setClickedPage(parseInt(currentPage - 1))
    }

    const openEdit = (id) => {
        setEditPart(id)
        setEditor(!editor)
    }

    const closeEdit = () => {
        setEditor(false)
    }

    return (
        <>
            <h1 className={styles.headingOne}>Parts List</h1>
            <table className={styles.tableContainer}>
                <thead>
                <tr>
                    <th className={styles.thHead}>ID</th>
                    <th className={styles.thHead}>Part Name</th>
                    <th className={styles.thHead}>Part Description</th>
                    <th className={styles.thHead}>Part Quantity</th>
                    <th className={styles.thHead}>Part Percentage</th>
                    <th className={styles.thHead}></th>
                    <th className={styles.thHead}></th>
                </tr>
                </thead>
                {data?.parts && data?.parts.length !== 0 ?
                    <tbody>
                    {data?.parts.map(({id, partName, partDescription, partQuantity, usePercentage, partPercentage}) => (
                        <tr className={styles.tableRow} key={id}>
                            <td className={styles.tdClass}>{id}</td>
                            <td className={styles.tdClass}>{partName}</td>
                            <td className={styles.tdClass}>{partDescription ? partDescription : <span className={styles.disabled}>No Description</span>}</td>
                            <td className={styles.tdClass}>{partQuantity}</td>
                            {usePercentage ? <td className={styles.tdClass}>{partPercentage}%</td> :
                                <td className={styles.tdClass}><span className={styles.disabled}>-</span></td>}
                            <td className={styles.editBtn} onClick={() => openEdit(id)}>
                                <i className={styles.btnIco}>
                                    <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                                </i>
                            </td>
                            <td className={styles.deleteBtn} onClick={(e) => tryDeletePart(e, id)}>
                                <i className={styles.btnIco}>
                                    <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                </i>
                            </td>
                        </tr>
                    ))}



                    </tbody> : <tbody>
                    <tr>
                        <td colSpan={5}>No parts to show!</td>
                    </tr>
                    </tbody>}
            </table>
            <div className={styles.tableFooter}>
                <div className={styles.itemsContainer}>
                    <span>Items per page:  </span>
                    <select className={styles.limitBox} onChange={(e) => handlePartLimit(e)}>
                        {pageLimits && pageLimits.map((limit, i) => (
                            <option value={limit} key={i}>{limit}</option>
                        ))}
                    </select>
                </div>
                <button className={styles.btnPrimaryRe} onClick={() => refetch()}>
                    <FontAwesomeIcon icon={faSyncAlt}></FontAwesomeIcon>
                </button>
            </div>
            <div className={styles.paginationContainer}>
                {currentPage !== 1 ? <button className={styles.nextPrevBtns} onClick={() => {
                    selectPrev()
                }}>Prev</button> : null}
                {pages &&
                pages.map(page => {
                    return (
                        <button key={page} value={page}
                                className={`${clickedPage === page ? (`${styles.active}`) : (`${styles.paginationBox}`)}`}
                                onClick={(e) => {
                                    selectPage(e)
                                }}>
                            {page}
                        </button>)
                })
                }
                {currentPage !== numOfPages ? <button className={styles.nextPrevBtns} onClick={() => {
                    selectNext()
                }}>Next</button> : null}
                {editor ? <div className={styles.editModal}>
                    <div className={styles.modalContent}>
                        <UpdatePart partId={editPart} editor={closeEdit}/>
                        <button className={styles.closeModal} onClick={() => setEditor(false)}>X</button>
                    </div>
                </div> : null}
            </div>
            {areYouSureModal ?
                <div className={styles.editModal}>
                    <div className={styles.modalContent}>
                    <p className={styles.areYouSureText}>Are you sure you want to delete this part?</p>
                    <button className={styles.btnSecondaryRe} onClick={() => setAreYouSureModal(false)}>No</button>
                    <button className={styles.btnPrimaryRe} onClick={() => {deletePart(currentElementForDelete, currentIdForDelete); setAreYouSureModal(false);}} >Yes</button>
                    </div>
                </div> : null}

        </>
    )
}

export default Parts
