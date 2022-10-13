import React, { useContext,useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
// import { onAuthStateChanged } from "firebase/auth";
// import { ref } from "firebase/storage";
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, addDoc, deleteDoc } from "firebase/firestore"; 
import { query, where, onSnapshot } from "firebase/firestore";
import { db } from '../server/firebase';
// import {onDisconnect} from "firebase/database";
import { Link , useNavigate} from "react-router-dom";
// import Timer from "./Timer";

export const CookieClicker = () => {

    const {currentUser} = useContext(AuthContext)
    const [player, setPlayer] = useState({});
    const [score,setScore]=useState(0);
    // const [players, setPlayers] = useState([])
    const [points, setPoints] = useState([])
    const [gameId, setGameId] = useState("")
    // const [gameOver, setGameOver] = useState(false) 
    const navigate = useNavigate()

    
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

                // setPlayerId(currentUser.uid);
        };
        addPlayer();

        //to get all players in "player" collection
        const getUsers = async()=>{
            
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

        getUsers(); 
        
    },[currentUser, gameId])
    
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
                    // console.log('Cookie Clicker Game ID: ', gameRef.id)
                    setGameId(gameRef.id)
                    currentGame = true
                };
                // console.log('addGame function runs!')

                // return ()=>{
                //     addGame();
                // }
                // if (player.displayName) {
                //     addGame();
                // }
                addGame();
            }; 
            // console.log('currentGame:', currentGame)
        }
        // console.log('game add/get useEffect runs!')
        return () => {
            getGame()
        }
    }, [])
    // }, [player])

    // console.log(gameId)
    
    useEffect(()=>{
  
            const addPlayer = async()=>{
                if(currentUser.displayName){
                    await setDoc(doc(db, "CookieClickerPlayer", currentUser.uid),{
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

            getUsers(); 

        
    },[currentUser])

    const handleClick=async(player)=>{
        const playerRef = doc(db,'CookieClickerPlayer',player.uid);

        await updateDoc(playerRef,{points:player.points+=1});
        console.log("points: ",player.points);
        setScore(player.points);

        let playersCollectionRef = collection(db,"CookieClickerPlayer")
        const data = await getDocs(playersCollectionRef);
        // setPlayers(data.docs.map((player) => ({ ...player.data().points})))
        // setPlayers(data.docs.map((player) => { 
        //     return player.data()
        // }))

        setPoints(data.docs.map((player) => { 
            return player.data().points
        }))
        
        // if(points.indexOf(3) >= 0){
        //     await setDoc(doc(db, "cookieClickerGames", gameId), {
        //         gid: gameId,
        //         players,
        //         gameStatus: false,
        //         winner: "Aaron",
        //         losers: []
        //       });
        // }
    }

    //firebase realtime listening
    useEffect(()=>{

        const q = query(collection(db, "CookieClickerPlayer"), where("gid", "==", gameId));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            // console.log('firebase realtime listening')
            let playersArr = querySnapshot.docs
            let points = playersArr.map(doc=>doc.data().points)
   
            if (points.includes(3)) {
                let index = points.indexOf(3)
                let winner = playersArr[index].data().displayName
                let player2 = playersArr.filter(doc=>doc.data().displayName!==winner)[0].data().displayName
                let player2Points = playersArr.filter(doc=>doc.data().displayName!==winner)[0].data().points
                // let losersArr = playersArr.filter(doc=>doc.data().displayName!==winner)
                // console.log(losersArr)
                // console.log(losersArr.data())

                //increment that user's star property by 5! (which is winner)
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
                            player2:{name: player2, points: player2Points}
                        });
                }
                
                updateGame()
                    
                // console.log('game done', winner)

                //delete all pleyers in firebase!
                let uidArr = [...playersArr.map(doc=>doc.data().uid)]
                uidArr.forEach(async(uid)=>{
                    await deleteDoc(doc(db, 'CookieClickerPlayer', uid ))
                })
                
                setTimeout(() => {
                    
                    navigate('/winnerPage', {state:[winner,player2,player2Points]})
                    // navigate('/winnerPage', {state:[winner, losersArr]})

                }, 1000);
  
                // alert(`Game done! Winner is ${winner}, points is 3. ${player2} points is ${player2Points}!`)

                
            }         
        }); 
        return () => unsubscribe()
    // },[])
    },[gameId, navigate, player.displayName])   

    // console.log('CookieClicker.js component renders!')
    
  return (
    points.indexOf(10) === -1 || !player.points ? 
        <>
        {/* <Timer/> */}
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
        <Link to="/">Back to home</Link>
    </>: <div>
            <h1>Max points reached!</h1>
            <Link to="/">Back to home</Link>
         </div>

  )
}
