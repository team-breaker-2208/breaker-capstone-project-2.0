import React, { useContext,useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
// import { onAuthStateChanged } from "firebase/auth";
// import { ref } from "firebase/storage";
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, addDoc } from "firebase/firestore"; 
import { db } from '../server/firebase';
// import {onDisconnect} from "firebase/database";
import { Link } from "react-router-dom";

export const CookieClicker = () => {

    const {currentUser} = useContext(AuthContext)
    const [player, setPlayer] = useState({});
    const [score,setScore]=useState(0);
    const [players, setPlayers] = useState([])
    const [points, setPoints] = useState([])
    const [gameId, setGameId] = useState("")
    // const [gameOver, setGameOver] = useState(false) 

    useEffect(()=>{
  
        
        const getGame = async()=>{
            let currentGame = false
            
            const gamesCollectionRef = await collection(db,"cookieClickerGames")
            const data = await getDocs(gamesCollectionRef)
            console.log(data.docs.map((game) => { 
                const gameStatus = game.data().gameStatus

                if(gameStatus){
                    setGameId(game.data().gid)
                    currentGame = true
                }
                return currentGame
            }))
            
            if(currentGame === false ){
                const addGame = async()=>{
                    const gameRef = await addDoc(collection(db, "cookieClickerGames"),{
                        gameStatus: true
                    })
    
                    await setDoc(doc(db, "cookieClickerGames", gameRef.id), {
                        gameStatus: true,
                        gid: gameRef.id
                    })
                    console.log("Cookie Clicker Game ID: ",gameRef.id)
                    setGameId(gameRef.id)
                    currentGame = true
                };
                addGame();
            }; 
    
        }
        getGame()
        

    }, [])

    console.log(gameId)
    
    useEffect(()=>{
  
            const addPlayer = async()=>{
                if(currentUser.displayName){
                    await setDoc(doc(db, "player", currentUser.uid),{
                        uid: currentUser.uid,
                        displayName:currentUser.displayName,
                        points:0
                    })
                }

                // setPlayerId(currentUser.uid);
            };
            addPlayer();

        //to get all players in "player" collection
        const getUsers = async()=>{
            
            if(currentUser.displayName){
                let currentPlayerRef = doc(db,"player",currentUser.uid);
                let currentPlayerSnap = await getDoc(currentPlayerRef);
                if (currentPlayerSnap.exists()) {
                        setPlayer(currentPlayerSnap.data());
                    } else {
                    // doc.data() will be undefined in this case
                    // console.log("No such document!");
                    }
                }
            }

            getUsers(); 

        
    },[currentUser])

   
 


    

    // const dummyUsers = [
    // {displayName:"Tom",
    // points:0,
    // id:1
    // },
    // {displayName:"Jerry",
    // points:0,
    // id:2
    // }];


    const handleClick=async(player)=>{
        const playerRef = doc(db,'player',player.uid);

        await updateDoc(playerRef,{points:player.points+=1});
        console.log("points: ",player.points);
        setScore(player.points);

        let playersCollectionRef = collection(db,"player")
        const data = await getDocs(playersCollectionRef);
        // setPlayers(data.docs.map((player) => ({ ...player.data().points})))
        setPlayers(data.docs.map((player) => { 
            return player.data()
        }))

        setPoints(data.docs.map((player) => { 
            return player.data().points
        }))
        // await setDoc(doc(db, "cookieClickerGames", gameId), {
        //     gid: gameId,
        //     players,
        //     gameStatus: false,
        //     winner: "Aaron",
        //     losers: []
        //   });

        
    }



  return (
    points.indexOf(10) === -1 || !player.points ? 
        <>
        <h1>Cookie Clicker!</h1>
        <div className="cookies-container">
        <div className="cookie-container" >
                        <h2>You {player.displayName}  </h2>
                        <span className="cookieImage">
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbDgy71hH1KUez-MRwk195KG_dx2I9-bULNg&usqp=CAU"
                            alt="Cookie" 
                            onClick={()=>handleClick(player)}
                        />
                        </span>
                        <h4>Score: {score}</h4>
                    </div>
            {/* {dummyUsers.map((user)=>{
                return(
                    <div className="cookie-container" key={user.id}>
                        <h2>{user.displayName} </h2>
                        <span className="cookieImage">
                        <img 
                            // src="https://www.pngkey.com/png/detail/368-3686114_cookie-lucky-block-german-cute-cartoon-chocolate-chip.png" 
                            // src="https://www.fintechfutures.com/files/2018/12/Tough-cookie.jpg"
                            // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7n1EekB7b4vZ8g2HeaJvNPGoaZf_7m7vVYCRSlW2mSE38DrOxbXf8MSPyDDd60Yq3-ZU&usqp=CAU"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbDgy71hH1KUez-MRwk195KG_dx2I9-bULNg&usqp=CAU"
                            alt="Cookie" 
                            onClick={(event)=>handleClick(event,user)}
                        />
                        </span>
                    </div>
                )
            })} */}
        </div>
    </>: <div>
            <h1>Max points reached!</h1>
            <Link to="/">Back to home</Link>
         </div>

  )
}
