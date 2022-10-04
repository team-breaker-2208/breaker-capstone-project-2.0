import React, { useContext } from 'react'
import {signOut} from 'firebase/auth'
import { auth } from '../server/firebase'
import { AuthContext } from "../context/AuthContext";

export default function Home() {
    // const {currentUser} = useContext(AuthContext)
    // console.log(currentUser)

  return (
    <div>
        <h1>Welcome to Home</h1>
        {/* <span>{currentUser.displayName}</span> */}
        <button onClick={()=>signOut(auth)}>Logout</button>
    </div>
  )
}
