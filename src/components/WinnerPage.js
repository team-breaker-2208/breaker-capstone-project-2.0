import React from 'react'
import { useLocation } from "react-router-dom";
import {Link} from 'react-router-dom'
// import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

const WinnerPage = ()=>{
    const location = useLocation();
    // const { width, height } = useWindowSize()
    // const navigate = useNavigate()
    const [winner,player2, player2Points] = location.state
    // const [winner,losersArr] = location.state
    // console.log('losersArr:', losersArr)

    // setTimeout(() => {
    //     navigate('/')
    // }, 3000);

    return (
        <>  
            <Confetti width={100} height={100}/>
            {/* <Confetti drawShape={ctx => {
                ctx.beginPath()
                for(let i = 0; i < 22; i++) {
                    const angle = 0.35 * i
                    const x = (0.2 + (1.5 * angle)) * Math.cos(angle)
                    const y = (0.2 + (1.5 * angle)) * Math.sin(angle)
                    ctx.lineTo(x, y)
                }
                ctx.stroke()
                ctx.closePath()
            }} /> */}
            <img src='https://storybodyguard.files.wordpress.com/2011/02/winner-illustration1.jpg' alt='Winner Page'/>
            <h1>{winner} is the winner and got 5 stars!!!</h1>
            <h3>Not bad {player2}, you got {player2Points} points!</h3>
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