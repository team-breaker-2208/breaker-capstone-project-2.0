import React, { useContext,useState, useEffect } from 'react'
import { AuthContext } from "../../context/AuthContext";
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore"; 
import { query, onSnapshot } from "firebase/firestore";
import { db } from '../../server/firebase';
import { useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import img1 from "./images/img1.png"
import img2 from "./images/img2.png"
import img3 from "./images/img3.png"
import img4 from "./images/img4.png"
import img5 from "./images/img5.png"
import img6 from "./images/img6.png"
import img7 from "./images/img7.png"
import img8 from "./images/img8.png"


const Memory = ({setShowNav}) => {
    const {currentUser} = useContext(AuthContext)
    const [player, setPlayer] = useState({});
    const [gameId, setGameId] = useState("")
    const [gameOver, setGameOver] = useState(false)
    const navigate = useNavigate()
    const [score, setScore] = useState(0)
    const question = <FontAwesomeIcon icon="circle-question" />

    useEffect(()=>{

        //to get all players in "player" collection
        const getSingleUser = async()=>{
            
            if(currentUser.displayName){
                let currentPlayerRef = doc(db,"memoryPlayers",currentUser.uid);
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
            const gamesCollectionRef = collection(db,"memoryGames")
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


    let matchedCard = 0
    let cardOne, cardTwo;
    let disableDeck = false

    const flipCard = (e) => {
        let clickedCard = e.target
        if(clickedCard !== cardOne && !disableDeck){
            clickedCard.classList.add("flip")
            if(!cardOne){
                return cardOne = clickedCard
            }
            cardTwo = clickedCard
            disableDeck = true;
            let cardOneImg = cardOne.querySelector("img").src
            let cardTwoImg = cardTwo.querySelector("img").src
            matchCards(cardOneImg, cardTwoImg)
        }
       
    }

    const matchCards = async(img1, img2) => {
        if(img1 === img2){
            matchedCard++
            console.log(matchedCard)
            const playerRef = doc(db,'memoryPlayers',player.uid);

            await updateDoc(playerRef,{points:player.points+=1});
            console.log("points: ",player.points);
            setScore(player.points);

            cardOne.onClick = null
            cardTwo.onClick = null
            cardOne = cardTwo = ""
            return disableDeck = false;
        }

        setTimeout(()=> {
            cardOne.classList.add("shake")
            cardTwo.classList.add("shake")
        }, 400)

        setTimeout(()=> {
            cardOne.classList.remove("shake", "flip")
            cardTwo.classList.remove("shake", "flip")
            cardOne = cardTwo = ""
            disableDeck = false;
        }, 1200)
    }

    //firebase realtime listening
    useEffect(()=>{

        const q = query(collection(db, "memoryPlayers"));
        // where("gid", "==", gameId)

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            // console.log('firebase realtime listening')
            let playersArr = querySnapshot.docs
            let points = playersArr.map(doc=>doc.data().points)

            if (points.includes(8)) {
                let index = points.indexOf(8)
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
                    await setDoc(doc(db, "memoryGames", gameId), {
                            gid: gameId,
                            gameStatus: false,
                            winner,
                            losers
                        });
                        console.log("updateGame FIRED!")
                        setGameOver(true)
                }
                
                if(losersRef.length === 1){
                    updateGame()
                }

                //delete all pleyers in firebase!
                let uidArr = [...playersArr.map(doc=>doc.data().uid)]
                uidArr.forEach(async(uid)=>{
                    await deleteDoc(doc(db, 'memoryPlayers', uid ))
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
        navigate('/memoryWinnerPage', {state:gameId})
    }

  return (
    <div className='memoryWrapper'>
        <h1>MEMORY!</h1>
        <h2 id="score">Total Pairs Matched: {score}</h2>
    <div className='memory-wrapper'>
        <ul className='cards' onClick={(e)=>{flipCard(e)}}>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img1} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img2} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img3} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img4} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img5} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img6} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img7} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img8} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img1} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img2} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img3} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img4} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img5} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img6} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img7} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img8} alt="card-img" />
                </div>
            </li>
        </ul>
    </div>
    </div>
  )
}

export default Memory