import React, { useContext, useState, useEffect } from 'react'
import {signOut} from 'firebase/auth'
import { auth } from '../server/firebase'
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom'
import { collection } from "firebase/firestore"; 
import { query, onSnapshot, setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from '../server/firebase';



export default function Home() {
    const {currentUser} = useContext(AuthContext)
    const [user, setUser] = useState({})
    const [cookiePlayers, setCookiePlayers] = useState([]);
    const [mainLobbyPlayers, setMainLobbyPlayers] = useState([]);
    const [mainLobbyPlayer, setMainLobbyPlayer] = useState({})
    const [mainLobbyPlayerId, setMainLobbyPlayerId] = useState("")
    const [loading, setLoading] = useState(false)
    // console.log(currentUser)
    const navigate = useNavigate()

    useEffect(()=> {
        
        setUser(currentUser)
        // console.log(user)
        
    },[currentUser, user])
    
    if(!currentUser) {
        navigate("/login")
    }

    //adding players to CookieClicker lobby
    useEffect(()=>{
  
      const addPlayer = async()=>{
        
        
        
        if(currentUser.displayName){
          let currentPlayerRef = doc(db,"users",currentUser.uid);
          let currentPlayerSnap = await getDoc(currentPlayerRef);
          const stars = currentPlayerSnap.data().star
          setMainLobbyPlayerId(currentPlayerSnap.data().uid);
          setMainLobbyPlayer(currentPlayerSnap.data())
          
          await setDoc(doc(db, "MainLobbyPlayer", currentUser.uid),{
                      uid: currentUser.uid,
                      displayName:currentUser.displayName,
                      stars: stars
                  })
              }
      };

      setLoading(true)
      addPlayer();
      setLoading(false)
    

  },[currentUser])

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
    
    //watching number of players in Main Lobby
    useEffect(()=>{
      const qPlayers = query(collection(db, "MainLobbyPlayer"));
      const unsubscribe = onSnapshot(qPlayers, (querySnapshot) => {
          let playersArr = querySnapshot.docs;
          setMainLobbyPlayers(playersArr);
      });
      
      return()=>{
          unsubscribe();
      }
  },[])

  const handleClick = async() => {
    await deleteDoc(doc(db, 'MainLobbyPlayer', mainLobbyPlayerId))
  }

  const handleLogout = async() =>{
    signOut(auth);
    console.log("main player Id", mainLobbyPlayerId)
      await deleteDoc(doc(db, 'MainLobbyPlayer', mainLobbyPlayerId))
  }

  const handleNavigateAway = async () => {
    await deleteDoc(doc(db, 'MainLobbyPlayer', mainLobbyPlayerId))
}

window.onunload = function(){
    handleNavigateAway();
    return 'Are you sure you want to leave?';
  };
    
  const gameTwo = []

  return (
    <div className='mainLobby-container'>
        <h1 className='test'>Weclome to the Games Center</h1>
        {/* <span>{currentUser.displayName}</span> */}
        {loading ?<div>Loading...</div> : 
        <div>
        <div className='gamesContainer'>
          <div className='cookieClicker-mainLobby-container'>
            <h2>Cookie Clicker Game</h2>
            <h4>{cookiePlayers.length}/3</h4>
              {cookiePlayers.length < 3 ? 
                <Link to="/CookieLobby">
                  <button onClick={handleClick} className='join-button'>Join Game</button>
                </Link>: 
              <span>Cookie Clicker Lobby is full</span>}
          </div>
          <div className='gameTwo-mainLobby-container'>
            <h2>Game 2</h2>
            <h4>0/2</h4>
              {gameTwo.length < 2 ? 
                <Link to="/CookieLobby">
                  <button className='join-button'>Join Game</button>
                </Link>: 
              <span>Cookie Clicker Lobby is full</span>}
          </div>
        </div>
        <div className='mainLobby-players-container'>
            {mainLobbyPlayers.map((singlePlayer) => {
                  if(singlePlayer.data().displayName === mainLobbyPlayer.displayName){
                    return(
                      <div key={singlePlayer.data().uid} className="main-lobby-player">
                        <h3 >{singlePlayer.data().displayName}</h3>
                        <h4 >{singlePlayer.data().stars} Stars</h4>
                      </div>
                    )
                  }
        
                    return (
                      <div key={singlePlayer.data().uid} className="single-lobby-player">
                        <h3 >{singlePlayer.data().displayName}</h3>
                        <h4 >{singlePlayer.data().stars} Stars</h4>
                      </div>
                    )
            })}
        </div>
        <button className='logout-button' onClick={()=> handleLogout()}>Logout</button>
    </div>}
    </div>
  )
}
