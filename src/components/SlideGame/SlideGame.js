import React from 'react'


const SlideGame = ()=>{
    return (
       <div>
            <h1>PUZZLE SLIDER!</h1>
            <div className="board">
                <div className="puzzle_block">1</div>
                    <div className="puzzle_block">2</div>
                    <div className="puzzle_block">3</div>
                    <div className="puzzle_block">4</div>
                    <div className="puzzle_block">5</div>
                    <div className="puzzle_block">6</div>
                    <div className="puzzle_block">7</div>
                    <div className="puzzle_block">8</div>
                </div>
            <h2>TURNS: <span id="turns">0</span></h2>
       </div> 
    )
}

export default SlideGame