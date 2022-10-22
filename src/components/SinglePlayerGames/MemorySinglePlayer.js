import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import img1 from "../Memory/images/img1.png"
import img2 from "../Memory/images/img2.png"
import img3 from "../Memory/images/img3.png"
import img4 from "../Memory/images/img4.png"
import img5 from "../Memory/images/img5.png"
import img6 from "../Memory/images/img6.png"
import img7 from "../Memory/images/img7.png"
import img8 from "../Memory/images/img8.png"

const MemorySinglePlayer = () => {
    const question = <FontAwesomeIcon icon="circle-question" />

    let matchedCard = 0
    let cardOne, cardTwo;
    let disableDeck = false

    

    useEffect(()=> {
        function preShuffle() {
            if(matchedCard === 0){
                const cards = document.querySelectorAll(".card")
                let arr = [img1, img2, img3, img4, img5, img6, img7, img8, img1, img2, img3, img4, img5, img6, img7, img8]
                arr.sort(() => Math.random() > 0.5 ? 1 : -1)
                console.log("shuffling")
                cards.forEach((card, i) => {
                    let imgTag = card.querySelector(".back-view img")
                    imgTag.src = arr[i]
                });
            }
        }

        preShuffle()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    function shuffleCard() {
        const cards = document.querySelectorAll(".card")
        matchedCard = 0;
        disableDeck = false;
        cardOne = cardTwo = ""
        let arr = [img1, img2, img3, img4, img5, img6, img7, img8, img1, img2, img3, img4, img5, img6, img7, img8]
        arr.sort(() => Math.random() > 0.5 ? 1 : -1)
        cards.forEach((card, i) => {
            card.classList.remove("flip")
            card.classList.remove("complete")
            let imgTag = card.querySelector(".back-view img")
            console.log(imgTag)
            imgTag.src = arr[i]
        });
    }
    

    const flipCard = (e) => {
        let clickedCard = e.target
        if(clickedCard !== cardOne && !disableDeck && !clickedCard.classList.contains("complete")){
            clickedCard.classList.add("flip")
            if(!cardOne){
                return cardOne = clickedCard
            }
            cardTwo = clickedCard
            disableDeck = true;
            let cardOneImg = cardOne.querySelector("img").src
            let cardTwoImg = cardTwo.querySelector("img").src
            matchCards(cardOneImg, cardTwoImg)
        }
       
    }

    const matchCards = (img1, img2) => {
        if(img1 === img2){
            matchedCard++
            console.log('matchedCard', matchedCard)
            if(matchedCard === 8) {
                setTimeout(() => {
                    return shuffleCard();
                }, 1000);
            }

            if(!cardOne.classList.contains("complete") && !cardTwo.classList.contains("complete")){
   
                cardOne.classList.add("complete")
                cardTwo.classList.add("complete")
                cardOne = cardTwo = ""
                return disableDeck = false;
            }
        }

        setTimeout(()=> {
            cardOne.classList.add("shake")
            cardTwo.classList.add("shake")
        }, 500)

        setTimeout(()=> {
            cardOne.classList.remove("shake", "flip")
            cardTwo.classList.remove("shake", "flip")
            cardOne = cardTwo = ""
            disableDeck = false;
        }, 1200)
    }

   

  return (
    <div className='memoryWrapper'>
        <h1>MEMORY!</h1>
       
    <div className='memory-wrapper'>
        <ul className='cards' onClick={(e)=>{flipCard(e)}}>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img1} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img2} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img3} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img4} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img5} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img6} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img7} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img8} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img1} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img2} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img3} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img4} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img5} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img6} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img7} alt="card-img" />
                </div>
            </li>
            <li className='card'>
                <div className='view front-view'>
                    <span className='material-icons'>{question}</span>
                </div>
                <div className='view back-view'>
                    <img src={img8} alt="card-img" />
                </div>
            </li>
        </ul>
    </div>
    <Link to="/"><button >Return to Game Select</button></Link>
    </div>
  )
}

export default MemorySinglePlayer