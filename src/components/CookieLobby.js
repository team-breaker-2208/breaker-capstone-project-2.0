import React, { useContext,useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
// import { onAuthStateChanged } from "firebase/auth";
// import { ref } from "firebase/storage";
import { doc, setDoc, getDoc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore"; 
import { query, onSnapshot } from "firebase/firestore";
import { db } from '../server/firebase';
// import {onDisconnect} from "firebase/database";
import { Link , useNavigate} from "react-router-dom";

const CookieLobby = () => {

    const {currentUser} = useContext(AuthContext)
    const [player, setPlayer] = useState({});
    const [players, setPlayers] = useState([])
    const [gameId, setGameId] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    //getting or creating the current Game
    useEffect(()=>{
        const getGame = async()=>{
            let currentGame = false
            const gamesCollectionRef = collection(db,"cookieClickerGames")
            const data = await getDocs(gamesCollectionRef)
            data.docs.map((game) => { 
                const gameStatus = game.data().gameStatus
                if(gameStatus){
                    console.log("GID in getGame", game.data().gid)
                    setGameId(game.data().gid)
                    currentGame = true
                }
                return currentGame
            })
            // console.log('get games runs!')

            if(currentGame === false ){
                const addGame = async()=>{
                    const gameRef = await addDoc(collection(db, "cookieClickerGames"),{
                        gameStatus: true
                    })
                    await setDoc(doc(db, "cookieClickerGames", gameRef.id), {
                        gameStatus: true,
                        gid: gameRef.id
                    })
                    setGameId(gameRef.id)
                    currentGame = true
                };
                console.log('addGame function runs!')

                addGame();
            }; 
        }
        getGame()
        return () => {
            console.log("get/add game useEffect was fired!")
        }
    }, [])  

 
    
    //adding players to CookieClicker lobby
    useEffect(()=>{
  
        const addPlayer = async()=>{
                if(currentUser.displayName){
                    await setDoc(doc(db, "CookieClickerPlayer", currentUser.uid),{
                        uid: currentUser.uid,
                        displayName:currentUser.displayName,
                        points:0,
                        // gid: gameId
                    })
                }
        };
        addPlayer();

        //to get all players in "Cookie player" collection
        const getSinglePlayer = async()=>{
            
            if(currentUser.displayName){
                let currentPlayerRef = doc(db,"CookieClickerPlayer",currentUser.uid);
                let currentPlayerSnap = await getDoc(currentPlayerRef);
                if (currentPlayerSnap.exists()) {
                        setPlayer(currentPlayerSnap.data());
                } else {
                    // doc.data() will be undefined in this case
                    // console.log("No such document!");
                }
            }
        }
        setLoading(true);

        // setTimeout(()=>{
        //     console.log("loading complete")
        getSinglePlayer(); 
        setLoading(false);
        // }, 5000);
        
        // console.log("now loading")
    },[currentUser, gameId])
    
      

    useEffect(()=>{
        const qPlayers = query(collection(db, "CookieClickerPlayer"));
        const unsubscribe = onSnapshot(qPlayers, (querySnapshot) => {
            let playersArr = querySnapshot.docs;
            setPlayers(playersArr);
        });
        
        return()=>{
            unsubscribe();
        }
    },[])

    console.log("GID: ", gameId);

    const handleNavigateAway = async () => {
        await deleteDoc(doc(db, 'CookieClickerPlayer', player.uid))
    }

    window.onunload = function(){
        handleNavigateAway();
        return 'Are you sure you want to leave?';
      };

    const handleClick = async(player)=>{
        await deleteDoc(doc(db, 'CookieClickerPlayer', player.uid))
    }

    if (players.length === 4){
        setTimeout(()=>{
            navigate("/cookieClicker");

        }, "6000")
        return(
            <div className="cookieClicker-loading-screen">
                <h1 className="word ready">READY!</h1>  
                <h1 className="word set">SET!!</h1>
                <h1 className="word go">GO!!!</h1>
            </div>
        )
    }

  return (
    <div className="lobbyContainer">
        <h1 className="welcome">WELCOME TO COOKIE CLICKER LOBBY!</h1>
        {loading ?<div>Loading...</div> : <div className="PlayersContainer">
        <h2 className="infoDiv">LOBBY STATUS:{players.length}/4 PLAYERS</h2>
            {players.map((singlePlayer) => {
                return (
                    <h3 className="players" key={singlePlayer.data().uid}>{singlePlayer.data().displayName.toUpperCase()}</h3>
                )
            })}
        
        <div className="infoDiv">WAITING ON {4 - players.length} MORE</div> 
        </div>}

        
        <Link to="/"><button onClick={()=>handleClick(player)}>Return to Game Select</button></Link>
    </div>
  )
}

export default CookieLobby;