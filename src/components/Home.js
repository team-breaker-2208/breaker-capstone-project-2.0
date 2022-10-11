import React, { useContext, useState, useEffect } from 'react'
import {signOut} from 'firebase/auth'
import { auth } from '../server/firebase'
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom'
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc } from "firebase/firestore"; 
import { query, where, onSnapshot } from "firebase/firestore";
import { db } from '../server/firebase';



export default function Home() {
    const {currentUser} = useContext(AuthContext)
    const [user, setUser] = useState({})
    const [cookiePlayers, setCookiePlayers] = useState([]);
    // console.log(currentUser)
    const navigate = useNavigate()

    useEffect(()=> {
        
        setUser(currentUser)
        // console.log(user)
        
    },[currentUser, user])
    
    if(!currentUser) {
        navigate("/login")
    }

    //watching number of players in CookieClicker
    useEffect(()=>{
      const qPlayers = query(collection(db, "CookieClickerPlayer"));
      const unsubscribe = onSnapshot(qPlayers, (querySnapshot) => {
          let playersArr = querySnapshot.docs;
          setCookiePlayers(playersArr);
      });
      
      return()=>{
          unsubscribe();
      }
  },[])
    


  return (
    <div>
        <h1>Welcome to Home</h1>
        {/* <span>{currentUser.displayName}</span> */}
        {cookiePlayers.length < 2 ? <Link to="/CookieLobby">Go to Cookie Clicker</Link>: <span>Cookie Clicker Lobby is full</span>}
        <button onClick={()=>signOut(auth)}>Logout</button>
    </div>
  )
}
