import React, { useContext, useState, useEffect } from 'react'
import {signOut} from 'firebase/auth'
import { auth } from '../server/firebase'
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom'
import { collection } from "firebase/firestore"; 
import { query, onSnapshot, setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from '../server/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function Home() {
    const {currentUser} = useContext(AuthContext)
    const [user, setUser] = useState({})
    const [cookiePlayers, setCookiePlayers] = useState([]);
    const [molePlayers, setMolePlayers] =useState([])
    const [memoryPlayers, setMemoryPlayers] =useState([])
    const [mainLobbyPlayers, setMainLobbyPlayers] = useState([]);
    const [mainLobbyPlayer, setMainLobbyPlayer] = useState({})
    const [mainLobbyPlayerId, setMainLobbyPlayerId] = useState("")
    const [loading, setLoading] = useState(false)

    const star = <FontAwesomeIcon icon="star" flip />
    // console.log(currentUser)
    const navigate = useNavigate()

    // dummyData
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

    //adding players to Main lobby
    useEffect(()=>{
  
      const addPlayer = async()=>{
        
        if(currentUser.displayName){
          let currentPlayerRef = doc(db,"users",currentUser.uid);
          let currentPlayerSnap = await getDoc(currentPlayerRef);
          const stars = currentPlayerSnap.data().star
          const avatar = currentPlayerSnap.data().avatar
          setMainLobbyPlayerId(currentPlayerSnap.data().uid);
          setMainLobbyPlayer(currentPlayerSnap.data())
          console.log(avatar)
          
          await setDoc(doc(db, "MainLobbyPlayer", currentUser.uid),{
                      uid: currentUser.uid,
                      displayName:currentUser.displayName,
                      stars: stars,
                      avatar: avatar
                  })
              }
      };

      setLoading(true)
      addPlayer();
      setLoading(false)
    

  },[currentUser])

    //watching number of players in CookieClicker Lobby
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

    //watching number of players in WhackAMole Lobby
    useEffect(()=>{
        const qPlayers = query(collection(db, "whackAMolePlayers"));
        const unsubscribe = onSnapshot(qPlayers, (querySnapshot) => {
            let playersArr = querySnapshot.docs;
            setMolePlayers(playersArr);
        });
        
        return()=>{
            unsubscribe();
        }
    },[])

    //watching number of players in Memory Lobby
    useEffect(()=>{
        const qPlayers = query(collection(db, "memoryPlayers"));
        const unsubscribe = onSnapshot(qPlayers, (querySnapshot) => {
            let playersArr = querySnapshot.docs;
            setMemoryPlayers(playersArr);
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
    

  return (
    <div className='mainLobby-container'>
        <h1 className='test'>WELCOME TO BREAKER GAMES!</h1>
        {/* <span>{currentUser.displayName}</span> */}
        {loading ?<div>Loading...</div> : 
        <div className='mainLobby-loaded'>
        <div className='gamesContainer'>
            <div className="eachGame">
                <div className="gameTitle">
                    <h2>Cookie Clicker Game</h2>
                    <h4>Players: {cookiePlayers.length} / 4</h4>
                </div>
                <div className='cookieClicker-mainLobby-container'>
                </div>
                {cookiePlayers.length < 4 ? 
                <Link to="/CookieLobby">
                <button onClick={handleClick} className='join-button'>Join Game</button>
                </Link>: 
                <span>Cookie Clicker Lobby is full</span>}  
            </div>
            <div className="eachGame">
                <div className="gameTitle">
                    <h2>Whack A Mole Game</h2>
                    <h4>Players: {molePlayers.length} / 2</h4>
                </div>
                <div className='gameTwo-mainLobby-container'>
                </div>
                    {molePlayers.length < 2 ? 
                    <Link to="/whackAMoleLobby">
                    <button className='join-button'>Join Game</button>
                    </Link>: 
                <span>Whack A Mole Lobby is full</span>}
            </div>
            <div className="eachGame">
                <div className="gameTitle">
                    <h2>Memory Game</h2>
                    <h4>Players: {memoryPlayers.length} / 2</h4>
                </div>
                <div className='gameThree-mainLobby-container'>
                </div>
                    {molePlayers.length < 2 ? 
                    <Link to="/memoryLobby">
                    <button className='join-button'>Join Game</button>
                    </Link>: 
                <span>Memory Lobby is full</span>}
            </div>
        </div>
        <h2>Current Players In Lobby:</h2>
        <div className='mainLobby-players-container'>
            {mainLobbyPlayers.map((singlePlayer) => {
                  if(singlePlayer.data().displayName === mainLobbyPlayer.displayName){
                    return(
                      <div key={singlePlayer.data().uid} className="main-lobby-player">
                        <div className='avatar'><FontAwesomeIcon icon={singlePlayer.data().avatar} bounce /></div>
                        <h3 >{singlePlayer.data().displayName}</h3>
                        <h4 className='stars'>{singlePlayer.data().stars} Stars {star}</h4>
                      </div>
                    )
                  }
        
                    return (
                      <div key={singlePlayer.data().uid} className="single-lobby-player">
                        <div className='avatar'><FontAwesomeIcon icon={singlePlayer.data().avatar} bounce /></div>
                        <h3 >{singlePlayer.data().displayName}</h3>
                        <h4 className='stars'>{singlePlayer.data().stars} Stars {star}</h4>
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
