import React, { useContext,useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore"; 
import { query, onSnapshot } from "firebase/firestore";
import { db } from '../../server/firebase';
import { useNavigate} from "react-router-dom";


const WhackAMole = ({setShowNav})=>{
    const {currentUser} = useContext(AuthContext)
    const [player, setPlayer] = useState({});
    // const [points, setPoints] = useState([])
    const [gameId, setGameId] = useState("")
    const [gameOver, setGameOver] = useState(false)
    const navigate = useNavigate()
    const [idx, setIdx] = useState(0)
    const [score, setScore] = useState(0)
    const arr = ['','','','','','','','','']

    useEffect(()=>{

        //to get all players in "player" collection
        const getSingleUser = async()=>{
            
            if(currentUser.displayName){
                let currentPlayerRef = doc(db,"whackAMolePlayers",currentUser.uid);
                let currentPlayerSnap = await getDoc(currentPlayerRef);
                if (currentPlayerSnap.exists()) {
                        setPlayer(currentPlayerSnap.data());
                }
            }
        }

        getSingleUser(); 
        
    },[currentUser, gameId])

    useEffect(()=>{
        const getGame = async()=>{
            let currentGame = false
            const gamesCollectionRef = collection(db,"whackAMoleGames")
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


    useEffect(()=>{
        setInterval(() => {
            let num = Math.floor(Math.random() * 9);
            setIdx(num)
        }, 650)
    },[])

    // const handleClick = ()=>{
    //     setScore(score+1)
    // }

    const handleClick= (e, player)=>{
        const playerRef = doc(db,'whackAMolePlayers',player.uid);
        let mole = e.target

        if(mole.classList.contains('mole')) {
            const handleScore = async()=>{
                await updateDoc(playerRef,{points:player.points+=1});
                // console.log("points: ",player.points);
                setScore(player.points);
            }  
            handleScore()
        }

        if(mole){
            mole.classList.remove("mole")
            mole.classList.add("hit")
        }
    }

    //firebase realtime listening
    useEffect(()=>{

        const q = query(collection(db, "whackAMolePlayers"));
        // where("gid", "==", gameId)

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            // console.log('firebase realtime listening')
            let playersArr = querySnapshot.docs
            let points = playersArr.map(doc=>doc.data().points)

            if (points.includes(5)) {
                let index = points.indexOf(5)
                let winner = playersArr[index].data().displayName
                // let player2 = playersArr.filter(doc=>doc.data().displayName!==winner)[0].data().displayName
                // let player2Points = playersArr.filter(doc=>doc.data().displayName!==winner)[0].data().points
                let losersRef = playersArr.filter(doc=>doc.data().displayName!==winner)
                console.log("losersRef is: ", losersRef)
                
                let losers = losersRef.map(loser => loser.data())

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
                    await setDoc(doc(db, "whackAMoleGames", gameId), {
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
                    await deleteDoc(doc(db, 'whackAMolePlayers', uid ))
                })
                
            }   
            console.log("unsubscribe FIRED!")      
        }); 
        return () => {
            unsubscribe()
            console.log("game update useEffect FIRED!")
        }

    },[gameId, player.displayName])

    if(gameOver){
        // navigate('/winnerPage')
        setShowNav(true)
        navigate('/whackAMoleWinnerPage', {state:gameId})
    }

    // if (score===3) {
    //     navigate('/winnerPage')
    // }

    return(
        <> 
            <h1>WHACK A MOLE!</h1>
            <h1 id="score">{score}</h1>
            <div id="whack-a-mole">
                {arr.map((elm,index)=>{
                    if (index===idx) {
                        return (<div key={index} onClick={(e)=>handleClick(e, player)} className="mole hole"></div>)
                    } else {
                        return (<div key={index} className="hole"></div>)
                    }
                })}

                {/* <div className="mole hole"></div>
                <div className="hole"></div>
                <div className="hole"></div>
                <div className="hole"></div>
                <div className="hole"></div>
                <div className="hole"></div>
                <div className="hole"></div>
                <div className="hole"></div>
                <div className="hole"></div> */}
            </div>
        </>
    )
}

export default WhackAMole