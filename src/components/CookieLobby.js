import React, { useContext,useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
// import { onAuthStateChanged } from "firebase/auth";
// import { ref } from "firebase/storage";
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc } from "firebase/firestore"; 
import { query, where, onSnapshot } from "firebase/firestore";
import { db } from '../server/firebase';
// import {onDisconnect} from "firebase/database";
import { Link , useNavigate} from "react-router-dom";

const CookieLobby = () => {

    const {currentUser} = useContext(AuthContext)
    const [player, setPlayer] = useState({});
    const [players, setPlayers] = useState([])
    const [gameId, setGameId] = useState("")
    // const [gameOver, setGameOver] = useState(false) 
    const navigate = useNavigate()

    
    //adding players to CookieClicker lobby
    useEffect(()=>{
  
        const addPlayer = async()=>{
                if(currentUser.displayName){
                    await setDoc(doc(db, "CookieClickerPlayer", currentUser.uid),{
                        uid: currentUser.uid,
                        displayName:currentUser.displayName,
                        points:0,
                        gid: gameId
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

        getSinglePlayer(); 
        
    },[currentUser, gameId])
    
    //getting or creating the current Game
    useEffect(()=>{
        const getGame = async()=>{
            let currentGame = false
            const gamesCollectionRef = collection(db,"cookieClickerGames")
            const data = await getDocs(gamesCollectionRef)
            data.docs.map((game) => { 
                const gameStatus = game.data().gameStatus
                if(gameStatus){
                    setGameId(game.data().gid)
                    currentGame = true
                }
                return currentGame
            })
            console.log('get games runs!')

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
        return () => {
            getGame()
        }
    }, [])    

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

    console.log("players for Cookie: ",players);

    const handleNavigateAway = async () => {
        await deleteDoc(doc(db, 'CookieClickerPlayer', player.uid))
    }

    window.onbeforeunload = function(){
        handleNavigateAway();
        return 'Are you sure you want to leave?';
      };

    const handleClick = async(player)=>{
        await deleteDoc(doc(db, 'CookieClickerPlayer', player.uid))
    }

  return (
    <div className="lobbyContainer">
        <div>Welcome to Cookie Clicker!</div>
        <h2>Lobby Status:{players.length}/2 Players</h2>
            <div className="PlayersContainer">
                {/* map over and display players */}
            </div>
            <div>Number in lobby: {players.length}</div>
            <div>Waiting on {2 - players.length} more</div>
            <Link to="/"><button onClick={()=>handleClick(player)}>Leave Lobby</button></Link>
    </div>
  )
}

export default CookieLobby;