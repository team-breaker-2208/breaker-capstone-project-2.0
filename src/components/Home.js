import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from 'react-router-dom'
import { collection } from "firebase/firestore"; 
import { query, onSnapshot, setDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from '../server/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChatRoom from './ChatRoom';



export default function Home() {
    const {currentUser} = useContext(AuthContext)
    const [user, setUser] = useState({})
    const [cookiePlayers, setCookiePlayers] = useState([]);
    const [molePlayers, setMolePlayers] =useState([])
    const [memoryPlayers, setMemoryPlayers] =useState([])
    const [slideGamePlayers, setSlideGamePlayers] =useState([])
    const [mainLobbyPlayers, setMainLobbyPlayers] = useState([]);
    const [mainLobbyPlayer, setMainLobbyPlayer] = useState({})
    const [mainLobbyPlayerId, setMainLobbyPlayerId] = useState("")
    const [loading, setLoading] = useState(false)

    const star = <FontAwesomeIcon icon="star" flip />
    // console.log(currentUser)
    const navigate = useNavigate()

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
          const displayName = currentPlayerSnap.data().displayName
          console.log(avatar)
          
          await setDoc(doc(db, "MainLobbyPlayer", currentUser.uid),{
                      uid: currentUser.uid,
                      displayName: displayName,
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

        //watching number of players in Slide Game Lobby
        useEffect(()=>{
            const qPlayers = query(collection(db, "slideGamePlayers"));
            const unsubscribe = onSnapshot(qPlayers, (querySnapshot) => {
                let playersArr = querySnapshot.docs;
                setSlideGamePlayers(playersArr);
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
        {/* <h2 className='welcome-user'>WELCOME {mainLobbyPlayer.displayName.toUpperCase()} !</h2> */}
        {/* <span>{currentUser.displayName}</span> */}
        {loading ?<div>Loading...</div> : 
        <div className='mainLobby-loaded'>
            <h2>MULTIPLAYER GAMES:</h2>
        <div className='gamesContainer'>
            <div className="eachGame">
                <div className="gameTitle">
                    <h2>COOKIE CLICKER</h2>
                </div>
                <div className='cookieClicker-mainLobby-container'></div>
                <h4>PLAYERS: {cookiePlayers.length} / 2</h4>
                {cookiePlayers.length < 2 ? 
                <Link to="/CookieLobby">
                <button onClick={handleClick} className='join-button'>Join Game</button>
                </Link>: 
                <span>COOKIE CLICKER LOBBY IS FULL</span>}  
            </div>
            <div className="eachGame">
                <div className="gameTitle">
                    <h2>WHACK A MOLE</h2>
                </div>
                <div className='gameTwo-mainLobby-container'></div>
                    <h4>PLAYERS: {molePlayers.length} / 2</h4>
                    {molePlayers.length < 2 ? 
                    <Link to="/whackAMoleLobby">
                    <button className='join-button'>Join Game</button>
                    </Link>: 
                <span>WHACK A MOLE LOBBY IS FULL</span>}
            </div>
            <div className="eachGame">
                <div className="gameTitle">
                    <h2>MEMORY</h2>
                </div>
                <div className='gameThree-mainLobby-container'></div>
                <h4>PLAYERS: {memoryPlayers.length} / 2</h4>
                    {memoryPlayers.length < 2 ? 
                    <Link to="/memoryLobby">
                    <button className='join-button'>Join Game</button>
                    </Link>: 
                <span>MEMORY LOBBY IS FULL</span>}
            </div>
            <div className="eachGame">
                <div className="gameTitle">
                    <h2>SLIDE GAME</h2>
                </div>
                <div className='gameFour-mainLobby-container'></div>
                <h4>PLAYERS: {slideGamePlayers.length} / 2</h4>
                    {slideGamePlayers.length < 2 ? 
                    <Link to="/slideGameLobby">
                    <button className='join-button'>Join Game</button>
                    </Link>: 
                <span>SLIDE GAME LOBBY IS FULL</span>}
            </div>
        </div>
        <h2>SINGLE PLAYER GAMES:</h2>
        <div className='gamesContainer'>
            <div className="eachGame">
                <div className="gameTitle">
                    <h2>COOKIE CLICKER</h2>
                </div>
                <div className='cookieClicker-mainLobby-container'></div> 
                <Link to="/cookieClickerSingle">
                <button onClick={handleClick} className='join-button'>Join Game</button>
                </Link>
            </div>
            <div className="eachGame">
                <div className="gameTitle">
                    <h2>WHACK A MOLE</h2>
                </div>
                <div className='gameTwo-mainLobby-container'></div>
                <Link to="/whackAMoleSingle">
                <button onClick={handleClick} className='join-button'>Join Game</button>
                </Link>: 
            </div>
            <div className="eachGame">
                <div className="gameTitle">
                    <h2>MEMORY</h2>
                </div>
                <div className='gameThree-mainLobby-container'></div> 
                <Link to="/memorySingle">
                <button onClick={handleClick} className='join-button'>Join Game</button>
                </Link>
            </div>
            <div className="eachGame">
                <div className="gameTitle">
                    <h2>SLIDE GAME</h2>
                </div>
                <div className='gameFour-mainLobby-container'></div> 
                <Link to="/slideGameSingle">
                <button onClick={handleClick} className='join-button'>Join Game</button>
                </Link>
            </div>
        </div>

        <ChatRoom />               

        <h2>CURRENT PLAYERS IN LOBBY:</h2>
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
    </div>}
    </div>       
  )
}
