import React, { useContext,useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore"; 
import { query, onSnapshot } from "firebase/firestore";
import { db } from '../../server/firebase';
import { useNavigate} from "react-router-dom";
import img1 from '../../images/slideGame/1.jpg'
import img2 from '../../images/slideGame/2.jpg'
import img3 from '../../images/slideGame/3.jpg'
import img4 from '../../images/slideGame/4.jpg'
import img5 from '../../images/slideGame/5.jpg'
import img6 from '../../images/slideGame/6.jpg'
import img7 from '../../images/slideGame/7.jpg'
import img8 from '../../images/slideGame/8.jpg'
import img9 from '../../images/slideGame/9.jpg'

const SlideGame = ({setShowNav})=>{    
    const {currentUser} = useContext(AuthContext)
    const [player, setPlayer] = useState({});
    const [gameId, setGameId] = useState("")
    const [gameOver, setGameOver] = useState(false)
    const navigate = useNavigate()
    const [count, setCount] = useState(0)


    useEffect(()=>{

        //to get all players in "player" collection
        const getSingleUser = async()=>{
            
            if(currentUser.displayName){
                let currentPlayerRef = doc(db,"slideGamePlayers",currentUser.uid);
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
            const gamesCollectionRef = collection(db,"slideGames")
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
    
    const handleClick = (e)=>{
        const playerRef = doc(db,'slideGamePlayers',player.uid);

        let list = e.target.parentNode.childNodes

        let emptyPic = document.getElementById('0-2')
        let emptyPicIndex = [...list].indexOf(emptyPic)
        let emptyR = parseInt(emptyPicIndex/3)
        let emptyC = parseInt(emptyPicIndex%3)
      
        let target = e.target
        let targetIndex = [...list].indexOf(e.target)
        let targetR = parseInt(targetIndex/3)
        let targetC = parseInt(targetIndex%3)

        let sameRowAdjacent = (emptyR === targetR && Math.abs(emptyC - targetC) === 1)
        let sameColumnAdjacent = (emptyC === targetC && Math.abs(emptyR - targetR) ===1)
        if (sameRowAdjacent || sameColumnAdjacent) {
            let tempId = emptyPic.id
            let tempSrc = emptyPic.src
            let tempAlt = emptyPic.alt
    
            emptyPic.id = target.id
            emptyPic.src = target.src
            emptyPic.alt = target.alt
            // emptyPic.onclick = handleClick, this works!!!
            // console.log('emptyPic.onclick.toString()', emptyPic.onclick.toString())
    
            target.id = tempId
            target.src = tempSrc
            target.alt = tempAlt      

            setCount(count+1);      
        }

        const endGame = ()=>{
            let board = document.getElementById('board')
            if (board) {
                // console.log(board.childNodes)
                let list = board.childNodes
                // console.log(list)
                let Gamefinished = true;
                [...list].forEach((elem, idx)=>{
                    if (idx !== (Number(elem.alt[3])-1)) {
                        Gamefinished = false
                    }
                })
                if (Gamefinished) {
   
                    const handelWin = async ()=>{
                        await updateDoc(playerRef, {win:true})
                    }
                    handelWin()
                }
            }
        }
        endGame()

    }

    //firebase realtime listening
    useEffect(()=>{

        const q = query(collection(db, "slideGamePlayers"));
        // where("gid", "==", gameId)

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            // console.log('firebase realtime listening')
            let playersArr = querySnapshot.docs
            let winStatusArr = playersArr.map(doc=>doc.data().win)

            if (winStatusArr.includes(true)) {
                let index = winStatusArr.indexOf(true)
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
                    await updateDoc(userRef,{star:(user.data().star+10)})
                }
                if (player.displayName === winner) {                   
                    updateUserStar()
                }

                const updateGame = async ()=>{
                    await setDoc(doc(db, "slideGames", gameId), {
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
                    await deleteDoc(doc(db, 'slideGamePlayers', uid ))
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
        navigate('/slideGameWinner', {state:gameId})
    }

    return (
       <div>
            <h1>SLIDE GAME</h1>
            <div id="board">
                <img id="0-0" onClick={handleClick} src={img1} alt='img1'/>
                <img id="1-1" onClick={handleClick} src={img5} alt='img5'/>
                <img id="0-2" onClick={handleClick} src={img3} alt='img3'/>
                <img id="1-0" onClick={handleClick} src={img4} alt='img4'/>
                <img id="2-1" onClick={handleClick} src={img8} alt='img8'/>
                <img id="0-1" onClick={handleClick} src={img2} alt='img2'/>
                <img id="2-0" onClick={handleClick} src={img7} alt='img7'/>
                <img id="2-2" onClick={handleClick} src={img9} alt='img9'/>
                <img id="1-2" onClick={handleClick} src={img6} alt='img6'/>
            </div>
            <h1>TURNS: <span id="turns">{count}</span></h1>

       </div> 
    )
}

export default SlideGame