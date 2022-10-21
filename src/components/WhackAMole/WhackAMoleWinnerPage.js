import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { useLocation } from "react-router-dom";
import { db } from '../../server/firebase';
import { doc, getDoc } from "firebase/firestore"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const WhackAMoleWinnerPage = ()=>{
    
    const star = <FontAwesomeIcon className='winner-star' icon="star" flip />
    const [ winner, setWinner ] = useState("")
    const [ losers, setLosers ] = useState([])

    const location = useLocation();
    const gameId = location.state

    useEffect(() => {
        const getGameInfo = async() => {
            const currentGameRef = doc(db, "whackAMoleGames", gameId)
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
            <div className='empty-space'></div>
            <div className="winner-title mole-winner-title">
                <h2 className="title-word title-word-1">{winner.toUpperCase()} IS THE WINNER, GAINED 5 STARS {star}!</h2>
                <div className="title-word-2">
                    {losers.map(loser => {
                        return(
                            <h3 key= {loser.uid}>{loser.displayName.toUpperCase()} GOT {loser.points} POINTS!</h3>
                        )
                    })}
                </div>
            </div>
            <div className='empty-space'></div>

            {/* <div className='empty-space'></div>
            <div className="winner-title mole-winner-title">
                <h2 className="title-word title-word-1">WINNER IS THE WIINER, GOT 5 STARS !!!</h2>
                <div className="title-word-2">
                    <h3 className='losers' key='1'>aaa got 1 points!</h3>
                    <h3 className='losers' key='2'>bbb got 1 points!</h3>
                    <h3 className='losers' key='3'>ccc got 1 points!</h3>
                </div>
            </div>
            <div className='empty-space'></div> */}
            

            <div className='winner-button'>
                <Link to="/"><button >Go back to lobby</button></Link>
            </div>
        </>
    )
}

export default WhackAMoleWinnerPage