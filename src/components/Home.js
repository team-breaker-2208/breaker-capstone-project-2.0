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

    //dummyData
    // const dummyData=[
    //     {displayName:"Mike",
    //     uid:1,
    //     stars:0
    //     },
    //     {displayName:"Jake",
    //     uid:2,
    //     stars:5
    //     },
    //     {displayName:"Lily",
    //     uid:3,
    //     stars:10
    //     },
    //     {displayName:"Lily",
    //     uid:3,
    //     stars:10
    //     },
    //     {displayName:"Lily",
    //     uid:3,
    //     stars:10
    //     },
    // ]

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

//   const handleNavigateAway = async () => {
//     await deleteDoc(doc(db, 'MainLobbyPlayer', mainLobbyPlayerId))
// }

// window.onunload = function(){
//     handleNavigateAway();
//     return 'Are you sure you want to leave?';
//   };
    
  const gameTwo = []

  return (
    <div className='mainLobby-container'>
        <h1 className='test'>Weclome to the Games Center</h1>
        {/* <span>{currentUser.displayName}</span> */}
        {loading ?<div>Loading...</div> : 
        <div>
        <div className='gamesContainer'>
            <div className="eachGame">
                <div className="gameTitle">
                    <h2>Cookie Clicker Game</h2>
                    <h4>Players: {cookiePlayers.length} / 2</h4>
                </div>
                <div className='cookieClicker-mainLobby-container'>
                </div>
                {cookiePlayers.length < 2 ? 
                <Link to="/CookieLobby">
                <button onClick={handleClick} className='join-button'>Join Game</button>
                </Link>: 
                <span>Cookie Clicker Lobby is full</span>}  
            </div>
            <div className="eachGame">
                <div className="gameTitle">
                    <h2>Game 2</h2>
                    <h4>Players: 0 / 2</h4>
                </div>
                <div className='gameTwo-mainLobby-container'>
                </div>
                    {gameTwo.length < 2 ? 
                    <Link to="/CookieLobby">
                    <button className='join-button'>Join Game</button>
                    </Link>: 
                <span>Cookie Clicker Lobby is full</span>}
            </div>
        </div>
        <h2>Current Players In Lobby:</h2>
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

            {/* {dummyData.map((singlePlayer)=>{
                return(
                    <div key={singlePlayer.uid} className="main-lobby-player">
                        <h3>{singlePlayer.displayName}</h3>
                        <h4>{singlePlayer.stars} Stars</h4>
                    </div>
                )
            })} */}

        </div>
        <button className='logout-button' onClick={()=> handleLogout()}>Logout</button>
    </div>}
    </div>       
  )
}
