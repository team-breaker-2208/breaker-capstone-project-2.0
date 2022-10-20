import React from 'react'
import logo from '../../images/slideGame/logo.png'


const SlideGame = ()=>{
    return (
       <div>
            <img id="title" src={logo} alt='logo'/>
            <div id="board"></div>
            <h1>Turns: <span id="turns">0</span></h1>
       </div> 
    )
}

export default SlideGame