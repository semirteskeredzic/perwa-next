import React, {useContext} from 'react'
import styles from './HomeBoard.module.css'
import AppContext from "../context/AppContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons/faWarehouse";

function HomeBoard() {
    const { user, setUser } = useContext(AppContext);

    return (
        <div className={styles.mainDiv}>
            <FontAwesomeIcon className={styles.homeBoard} icon={faWarehouse} />
            <div className={styles.welcomeText}>Welcome to the Homeboard {user.username}!</div>
        </div>
    )
}

export default HomeBoard