import React, {useState, useEffect} from "react";

const WhackAMole = ()=>{
    const [idx, setIdx] = useState(0)
    const arr = ['','','','','','','','','']
    useEffect(()=>{
        // setInterval(() => {
            let num = Math.floor(Math.random() * 9);
            setIdx(num)
        // }, 3000)
    },[])

    return(
        <> 
            <h1 id="score">0</h1>
            <div id="whack-a-mole">
                {arr.map((elm,index)=>{
                    if (index===idx) {
                        return (<div key={index} className="mole hole"></div>)
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