import React, { useState } from 'react'
import img1 from '../../images/slideGame/1.jpg'
import img2 from '../../images/slideGame/2.jpg'
import img3 from '../../images/slideGame/3.jpg'
import img4 from '../../images/slideGame/4.jpg'
import img5 from '../../images/slideGame/5.jpg'
import img6 from '../../images/slideGame/6.jpg'
import img7 from '../../images/slideGame/7.jpg'
import img8 from '../../images/slideGame/8.jpg'
import img9 from '../../images/slideGame/9.jpg'
import { Link } from "react-router-dom";

const SlideGameSingle = ()=>{
    const [count, setCount] = useState(0)
    const [winMsg, setWinMsg] = useState('')
    const [gameWin, setGamewin] = useState(false)
    
    const handleClick = (e)=>{
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
                let list = board.childNodes;
                let gamefinished = true;
                [...list].forEach((elem, idx)=>{
                    if (idx !== (Number(elem.alt[3])-1)) {
                        gamefinished = false
                    }
                })
                if (gamefinished) {
                    setWinMsg('YOU WIN !')
                    setGamewin(true)
                }
            }
        }
        endGame()
    }

    const handleRefresh = () => {
        window.location.reload()
    }

    return (
        !gameWin ?
            <div>
                    <h1>SLIDE GAME</h1>
                    {/* <div id="board">
                        <img id="0-0" onClick={handleClick} src={img1} alt='img1'/>
                        <img id="0-2" onClick={handleClick} src={img3} alt='img3'/>
                        <img id="0-1" onClick={handleClick} src={img2} alt='img2'/>
                        <img id="1-0" onClick={handleClick} src={img4} alt='img4'/>
                        <img id="1-1" onClick={handleClick} src={img5} alt='img5'/>
                        <img id="1-2" onClick={handleClick} src={img6} alt='img6'/>
                        <img id="2-0" onClick={handleClick} src={img7} alt='img7'/>
                        <img id="2-1" onClick={handleClick} src={img8} alt='img8'/>
                        <img id="2-2" onClick={handleClick} src={img9} alt='img9'/>
                    </div> */}
                    <div id="board">
                        <img id="1-0" onClick={handleClick} src={img4} alt='img4'/>
                        <img id="0-1" onClick={handleClick} src={img2} alt='img7'/>
                        <img id="2-1" onClick={handleClick} src={img8} alt='img5'/>
                        <img id="1-1" onClick={handleClick} src={img5} alt='img1'/>
                        <img id="0-0" onClick={handleClick} src={img1} alt='img2'/>
                        <img id="1-2" onClick={handleClick} src={img6} alt='img3'/>
                        <img id="2-0" onClick={handleClick} src={img7} alt='img8'/>
                        <img id="2-2" onClick={handleClick} src={img9} alt='img9'/>
                        <img id="0-2" onClick={handleClick} src={img3} alt='img1'/>
                    </div>
                    <h1>TURNS: <span id="turns">{count}</span></h1>
                    <Link to="/"><button >Return to Game Select</button></Link>
                    
            </div> :
                <div>
                    <h1> {winMsg}</h1>
                    <button onClick={handleRefresh} >Play Again</button>
                    <Link to="/"><button >Return to Game Select</button></Link>
                </div>
    )
}

export default SlideGameSingle