import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const WhackAMoleSingle = ()=>{

    const [idx, setIdx] = useState(0)
    const [score, setScore] = useState(0)
    const arr = ['','','','','','','','','']

    useEffect(()=>{
        setInterval(() => {
            let num = Math.floor(Math.random() * 9);
            setIdx(num)
        }, 650)
    },[])

    const handleClick= (e)=>{    
        let mole = e.target
        if(mole.classList.contains('mole')) {
                setScore(score + 1);
                mole.classList.remove("mole")
                mole.classList.add("hit")
        }
        if(mole){
            console.log('mole element', mole)
            mole.classList.remove("mole")
            mole.classList.add("hit")
        }
    }

    const handleRefresh = () => {
        window.location.reload()
    }

    return(
        score !== 15  ? 
        <> 
            <h1>WHACK A MOLE!</h1>
            <h1 id="score">{score}</h1>
            <div id="whack-a-mole">
                {arr.map((elm,index)=>{
                    if (index===idx) {
                        return (<div key={index} onClick={handleClick} className="mole hole"></div>)
                    } else {
                        return (<div key={index} className="hole"></div>)
                    }
                })}
            </div>
                <Link to="/"><button >Return to Game Select</button></Link>
        </> : 
        <div className="winnerSingle">
            <h1>MAX POINTS REACHED!</h1>
            <button onClick={handleRefresh} >Play Again</button>
            <Link to="/"><button >Return to Game Select</button></Link>
        </div>
        
    )
}

export default WhackAMoleSingle