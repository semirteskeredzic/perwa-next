// import { signIn, signOut, useSession } from 'next-auth/client'
// import Loading from "../components/Loading";
import AppContext from "../context/AppContext";
import React, { useContext } from 'react'
import TestDashboard from "../components/TestDashboard";
import Login from './login'
import HomeBoard from "../components/HomeBoard";


export default function Home() {
    // const [ session, loading ] = useSession()
    const { user, setUser } = useContext(AppContext);

    return (
        <div className="indexClass">
            {user ? <HomeBoard /> : <Login />}
        </div>
    )
}
