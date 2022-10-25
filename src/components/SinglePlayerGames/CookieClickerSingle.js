import React, { useState } from "react";
import { Link } from "react-router-dom";
import fullCookie from "../../images/fullCookie.png"
import Munch1 from "../../images/Munch1.png"
import Munch2 from "../../images/Munch2.png"
import Munch3 from "../../images/Munch3.png"

const CookieClickerSingle = () => {

    const [score,setScore]=useState(0);

    const cookeImages = [
        fullCookie,
        Munch1,
        Munch2,
        Munch3
     ]

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

     const handleClick=()=>{

        setScore(score+1)
    }

    const handleRefresh = () => {
        window.location.reload()
    }


  return (
    score !== 32  ? 
        <>
        <h1>COOKIE CLICKER!</h1>
        <div className="cookies-container">
            <div className="cookie-container" >
                <h2>Click as fast as you can Player!</h2>
                <span className="cookieImage">
                <img 
                    src={cookeImages[cookieScore()]}
                    alt="Cookie" 
                    onClick={handleClick}
                />
                </span>
                <h3>Score: {score}</h3>
            <Link to="/"><button >Return to Game Select</button></Link>
            </div>
        </div>
    </>: <div className="winnerSingle">
            <h1>MAX POINTS REACHED!</h1>
            <button onClick={handleRefresh} >Play Again</button>
            <Link to="/"><button >Return to Game Select</button></Link>
         </div>
  )
}

export default CookieClickerSingle