import React, {useContext, useState} from "react";
import Link from "next/link";
import {Button} from "reactstrap";
import {useRouter} from "next/router";
import AppContext from "../context/AppContext";
import styles from './Sidebar.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCubes, faEject, faPersonBooth, faUser} from "@fortawesome/free-solid-svg-icons";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import Logo from '../assets/perwaLogoNew.png';
import {logout} from "../lib/auth";

function Sidebar() {
    const router = useRouter();
    const appContext = useContext(AppContext);
    const { user, setUser } = useContext(AppContext);

    const handleLogout = () => {
        logout();
        setUser(null);
    }

    const [openParts, setOpenParts] = useState(false)
    const [openProducts, setOpenProducts] = useState(false)

    const handleOpenParts = () => {
        setOpenParts(!openParts)
    }

    console.log('router', router.pathname)

    return (
        <div className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <img className={styles.logo} src={Logo} />
            </div>
            <hr />
            <div className={styles.navigationSection}>
                <div className={styles.primarySection}>
                    <Button  className={styles.btn}>
                        <ul className={styles.ulStyle}>
                            <li className={styles.liParentStyle} onClick={() => handleOpenParts()}>
                                <i className={styles.btnIco}>
                                    <FontAwesomeIcon icon={faCubes}></FontAwesomeIcon>
                                </i>
                                <span className={styles.btnTxt}>Parts</span>
                            </li>
                            {openParts || router.pathname == '/parts' || router.pathname == '/add-part' || router.pathname == '/update-part' ?  (
                                <>
                                    <Button className={styles.btn} href="/parts">
                                        <li className={styles.listItemStyle}>
                                                <span>Parts List</span>
                                        </li>
                                    </Button>
                                    <Button className={styles.btn} href="/add-part">
                                        <li className={styles.listItemStyle}>
                                                <span>Add part</span>
                                        </li>
                                    </Button>
                                    <Button className={styles.btn} href="/update-part">
                                        <li className={styles.listItemStyle}>
                                                <span>Update part</span>
                                        </li>
                                    </Button>
                                </>
                            ) : null}
                        </ul>
                    </Button>
                    <Button href="/products" className={styles.btn}>
                        <li className={styles.liParentStyle}>
                        <i className={styles.btnIco}>
                            <FontAwesomeIcon icon={faBox}></FontAwesomeIcon>
                        </i>
                        <span className={styles.btnTxt}>Products</span>
                        </li>
                    </Button>
                </div>
                <hr/>
                <div className={styles.secondarySection}>
                    <Button className={styles.btn}>
                        <li className={styles.liParentStyle}>
                        <i className={styles.btnIco}>
                            <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                        </i>
                        <span className={styles.btnTxt}>{user.username}</span>
                        </li>
                    </Button>
                    <Button className={styles.btn} onClick={() => handleLogout()}>
                        <li className={styles.liParentStyle}>
                        <i className={styles.btnIco}>
                            <FontAwesomeIcon icon={faEject}></FontAwesomeIcon>
                        </i>
                        <span className={styles.btnTxt}>Logout</span>
                        </li>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
