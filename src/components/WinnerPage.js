import React from 'react'
import {Link} from 'react-router-dom'
import { useLocation } from "react-router-dom";

// import { db } from '../server/firebase';
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// import useWindowSize from 'react-use/lib/useWindowSize'
// import Confetti from 'react-confetti'

const WinnerPage = ()=>{

    // delete all cookieClickerGames documents
    // const deletegames = async()=>{
    //     const querySnapshot = await getDocs(collection(db, "cookieClickerGames"));
    //     querySnapshot.forEach( async (docu)=>{
    //         await deleteDoc(doc(db, "cookieClickerGames", docu.id))
    //     })
    // }
    // deletegames()

    const location = useLocation();
    const [winner,player2, player2Points] = location.state
    // console.log(winner,player2, player2Points)

    // setTimeout(() => {
    //     navigate('/')
    // }, 3000);
    // console.log('winnerpage loading')
    return (
        <>  
            <div className="winner-title">
                <h1 className="title-word title-word-1">{winner} is the winner, got 5 stars !!!</h1>
                <h3 className="title-word title-word-2">Not bad {player2}, you got {player2Points} points !</h3>
            </div>

 
            
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
            <div className='winner-button'>
                <Link to="/"><button >Go back to lobby</button></Link>
            </div>
        </>
    )
}

export default WinnerPage