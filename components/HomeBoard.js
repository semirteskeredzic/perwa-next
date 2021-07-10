import React, {useContext} from 'react'
import styles from './HomeBoard.module.css'
import AppContext from "../context/AppContext";

function HomeBoard() {
    const { user, setUser } = useContext(AppContext);

    return (
        <div className={styles.mainDiv}>
            <p>Welcome to the Homeboard {user.username}!</p>
        </div>
    )
}

export default HomeBoard