import React from 'react'
import { useLocation, useNavigate } from "react-router-dom";

const WinnerPage = ()=>{
    const location = useLocation();
    const navigate = useNavigate()
    const [winner,player2, player2Points] = location.state
    // console.log('test:', test)
    setTimeout(() => {
        navigate('/')
    }, 3000);

    return (
        <>  
            <img src='https://storybodyguard.files.wordpress.com/2011/02/winner-illustration1.jpg'/>
            <h1>{winner} is the winner and got 5 stars!!!</h1>
            <h3>Not bad {player2}, you got {player2Points} points!</h3>
        </>
    )
}

export default WinnerPage