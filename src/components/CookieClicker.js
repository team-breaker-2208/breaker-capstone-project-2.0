import React, { useContext,useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore"; 
import { query, onSnapshot } from "firebase/firestore";
import { db } from '../server/firebase';
import { useNavigate} from "react-router-dom";
import fullCookie from "../images/fullCookie.png"
import Munch1 from "../images/Munch1.png"
import Munch2 from "../images/Munch2.png"
import Munch3 from "../images/Munch3.png"


export const CookieClicker = ({setShowNav}) => {

    const {currentUser} = useContext(AuthContext)
    const [player, setPlayer] = useState({});
    const [score,setScore]=useState(0);
    // const [players, setPlayers] = useState([])
    const [points, setPoints] = useState([])
    const [gameId, setGameId] = useState("")
    const [gameOver, setGameOver] = useState(false) 
    const navigate = useNavigate()
    
    const cookeImages = [
       fullCookie,
       Munch1,
       Munch2,
       Munch3
    ]
    
    useEffect(()=>{

        //to get all players in "player" collection
        const getSingleUser = async()=>{
            
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

        getSingleUser(); 
        
    },[currentUser, gameId])
    
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
        }
        getGame()
        return () => {
            console.log('game add/get useEffect FIRED!')
        }
    }, [])
    // }, [player])

    // console.log(gameId)
    

    const handleClick=async(player)=>{
        const playerRef = doc(db,'CookieClickerPlayer',player.uid);

        await updateDoc(playerRef,{points:player.points+=1});
        console.log("points: ",player.points);
        setScore(player.points);

        let playersCollectionRef = collection(db,"CookieClickerPlayer")
        const data = await getDocs(playersCollectionRef);

        setPoints(data.docs.map((player) => { 
            return player.data().points
        }))
        
    }

    //firebase realtime listening
    useEffect(()=>{

        const q = query(collection(db, "CookieClickerPlayer"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
           
            let playersArr = querySnapshot.docs
            let points = playersArr.map(doc=>doc.data().points)
   
            if (points.includes(32)) {
                let index = points.indexOf(32)
                let winner = playersArr[index].data().displayName
                let losersRef = playersArr.filter(doc=>doc.data().displayName!==winner)
                console.log("losersRef is: ", losersRef)
                
                let losers = losersRef.map(loser => loser.data())
        
                const updateUserStar = async ()=>{
                    const userRef = doc(db,'users', playersArr[index].data().uid);
                    let user = await getDoc(userRef);
                    await updateDoc(userRef,{star:(user.data().star+5)})
                }
                if (player.displayName === winner) {                   
                    updateUserStar()
                }

   
                const updateGame = async ()=>{
                    await setDoc(doc(db, "cookieClickerGames", gameId), {
                            gid: gameId,
                            gameStatus: false,
                            winner,
                            losers
                        });
                        console.log("updateGame FIRED!")
                        setGameOver(true)
                }
                
                if(losersRef.length === 3){
                    updateGame()

                }

                //delete all pleyers in firebase!
                let uidArr = [...playersArr.map(doc=>doc.data().uid)]
                uidArr.forEach(async(uid)=>{
                    await deleteDoc(doc(db, 'CookieClickerPlayer', uid ))
                })

                
            }   
            console.log("unsubscribe FIRED!")      
        }); 
        return () => {
            unsubscribe()
            console.log("game update useEffect FIRED!")
        }
    // },[])
    },[gameId, player.displayName])  
    
    console.log("GID in cookieClicker: ", gameId)

    if(gameOver){
        // navigate('/winnerPage')
        setShowNav(true)
        navigate('/winnerPage', {state:gameId})
    }

    const cookieScore = () =>{
        if(score < 8){
            return 0
        }
        if(score >= 8 && score <= 16){
            return 1
        }
        if(score >= 17 && score <= 24){
            return 2
        }
        return 3
    }
    
  return (
    points.indexOf(40) === -1 || !player.points ? 
        <>
        <h1>COOKIE CLICKER!</h1>
        <div className="cookies-container">
            <div className="cookie-container" >
                <h2>Click as fast as you can {player.displayName}!</h2>
                <span className="cookieImage">
                <img 
                    src={cookeImages[cookieScore()]}
                    alt="Cookie" 
                    onClick={()=>handleClick(player)}
                />
                </span>
                <h3>Score: {score}</h3>
            </div>
        </div>
    </>: <div>
            <h1>Max points reached!</h1>
         </div>

  )
}
