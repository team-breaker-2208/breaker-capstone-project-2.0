import React from 'react'
// import { useLocation } from "react-router-dom";
import {Link} from 'react-router-dom'
// import useWindowSize from 'react-use/lib/useWindowSize'
// import Confetti from 'react-confetti'

const WinnerPage = ()=>{
    // const location = useLocation();
    // const [winner,player2, player2Points] = location.state

    // const [winner,losersArr] = location.state
    // console.log('losersArr:', losersArr)

    // setTimeout(() => {
    //     navigate('/')
    // }, 3000);
    // console.log('winnerpage loading')
    return (
        <>  
            <div className="winner-title">
                <h1 className="title-word title-word-1">Winner is the winner, got 5 stars!!!</h1>
                <h3 className="title-word title-word-2">Not bad player2, you got 2 points!</h3>
            </div>

            {/* <div className="cookieClicker-loading-screen">
                <span className="ready">Ready!</span>
                <span className="set">Set!!</span>
                <span className="go">GO!!!</span>
            </div> */}
            
            {/* <img src='https://storybodyguard.files.wordpress.com/2011/02/winner-illustration1.jpg' alt='Winner Page'/>
            <h1>{winner} is the winner and got 5 stars!!!</h1>
            <h3>Not bad {player2}, you got {player2Points} points!</h3> */}
            {/* <h3>
               {losersArr.map((loser)=>{
                return (
                    <div key={loser.uid}>
                        <h2>{loser.data().displayName}</h2>
                        <h2>{loser.data().points}</h2>
                    </div>
                )
               })}
            </h3> */}
            <Link to="/"><button>Go back to lobby</button></Link>
        </>
    )
}

export default WinnerPage