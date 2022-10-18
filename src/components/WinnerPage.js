import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { useLocation } from "react-router-dom";
import { db } from '../server/firebase';
import { doc, getDoc } from "firebase/firestore"; 

// import { db } from '../server/firebase';
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// import useWindowSize from 'react-use/lib/useWindowSize'
// import Confetti from 'react-confetti'

const WinnerPage = ()=>{

    const [ winner, setWinner ] = useState("")
    const [ losers, setLosers ] = useState([])
    // delete all cookieClickerGames documents
    // const deletegames = async()=>{
    //     const querySnapshot = await getDocs(collection(db, "cookieClickerGames"));
    //     querySnapshot.forEach( async (docu)=>{
    //         await deleteDoc(doc(db, "cookieClickerGames", docu.id))
    //     })
    // }
    // deletegames()


    const location = useLocation();
    const gameId = location.state
    // console.log("Game ID is: ", gameId)

    useEffect(() => {
        const getGameInfo = async() => {
            const currentGameRef = doc(db, "cookieClickerGames", gameId)
            const currentGameSnap = await getDoc(currentGameRef)
            if (currentGameSnap.exists()) {
                setLosers(currentGameSnap.data().losers)
                setWinner(currentGameSnap.data().winner)
                console.log("losers are: ", losers)
                console.log("winner is: ", winner)
            }
        }

        

        getGameInfo()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    

    return (
        <>  
            <div className="winner-title">
                <h1 className="title-word title-word-1">{winner} is the winner, got 5 stars !!!</h1>
                <div className="title-word-2">
                    {losers.map(loser => {
                        return(
                            <h3 key= {loser.uid}>{loser.displayName} got {loser.points} points!</h3>
                        )
                    })}
                </div>
            </div>
            {/* <div className="winner-title">
                <h1 className="title-word title-word-1">winner is the winner, got 5 stars !!!</h1>
                <div className="title-word-2">
                    <h3 className='losers' key='1'>aaa got 1 points!</h3>
                    <h3 className='losers' key='2'>bbb got 1 points!</h3>
                    <h3 className='losers' key='3'>ccc got 1 points!</h3>
                </div>
            </div> */}
            
            {/* <img src='https://storybodyguard.files.wordpress.com/2011/02/winner-illustration1.jpg' alt='Winner Page'/>
            <h1>{winner} is the winner and got 5 stars!!!</h1>
            <h3>Not bad {player2}, you got {player2Points} points!</h3> */}

            <div className='winner-button'>
                <Link to="/"><button >Go back to lobby</button></Link>
            </div>
        </>
    )
}

export default WinnerPage