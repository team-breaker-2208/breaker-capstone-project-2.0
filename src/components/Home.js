import React, { useContext, useState, useEffect } from 'react'
import {signOut} from 'firebase/auth'
import { auth } from '../server/firebase'
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom'


export default function Home() {
    const {currentUser} = useContext(AuthContext)
    const [user, setUser] = useState({})
    // console.log(currentUser)
    const navigate = useNavigate()

    useEffect(()=> {
        
        setUser(currentUser)
        console.log(user)
        
    },[currentUser, user])
    
    if(!currentUser) {
        navigate("/login")
    }


  return (
    <div>
        <h1>Welcome to Home</h1>
        {/* <span>{currentUser.displayName}</span> */}
        <Link to="/cookieClicker">Go to Cookie Clicker</Link>
        <button onClick={()=>signOut(auth)}>Logout</button>
    </div>
  )
}
