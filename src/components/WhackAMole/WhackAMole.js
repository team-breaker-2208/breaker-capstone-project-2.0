import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom'

const WhackAMole = ()=>{
    const navigate = useNavigate()
    const [idx, setIdx] = useState(0)
    const [score, setScore] = useState(0)
    const arr = ['','','','','','','','','']

    useEffect(()=>{
        setInterval(() => {
            let num = Math.floor(Math.random() * 9);
            setIdx(num)
        }, 1000)
    },[])

    const handleClick = ()=>{
        setScore(score+1)
    }

    if (score===3) {
        navigate('/winnerPage')
    }

    return(
        <> 
            <h1 id="score">{score}</h1>
            <div id="whack-a-mole">
                {arr.map((elm,index)=>{
                    if (index===idx) {
                        return (<div key={index} onClick={handleClick} className="mole hole"></div>)
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