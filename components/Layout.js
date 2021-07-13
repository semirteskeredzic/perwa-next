import React, { useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Nav, NavItem } from "reactstrap";
import { logout } from "../lib/auth";
import AppContext from "../context/AppContext";
import styles from './Layout.module.css'
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = (props) => {
    const title = "Your Personal Warehouse";
    const { user, setUser } = useContext(AppContext);
    console.log('app context',AppContext);

    const handleLogout = () => {
        logout();
        setUser(null);
    }

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <link
                    rel="stylesheet"
                    href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                    crossOrigin="anonymous"
                />
                <script src="https://js.stripe.com/v3" />
            </Head>
            <header className={`${!user ? `${styles.hidden}`: "shown"}`}>
                <style jsx>
                    {`
            a {
              color: white;
            }
            h5 {
              color: white;
              padding-top: 11px;
            }
          `}
                </style>
                {!user ? <Nav className={styles.navbar}>
                    <NavItem className={styles.navItem}>
                        <Link href="/">
                            <a className="navbar-brand">Home</a>
                        </Link>
                    </NavItem>
                    <NavItem className={styles.navItem}>
                        <Link href="/register">
                            <a className="nav-link">Register</a>
                        </Link>
                        <Link href="/login">
                            <a className="nav-link">Log in</a>
                        </Link>
                    </NavItem>
                </Nav> : null}
            </header>
            <body className={styles.mainBodyContainer}>
                {user ? (
                    <div className={styles.mainContainer}>
                        <Sidebar/>
                        <Header />
                        <Container className={styles.main}>{props.children}</Container>
                    </div>
                    ): (
                    <Container>{props.children}</Container>)}
            </body>
        </>
    );
};

export default Layout;
