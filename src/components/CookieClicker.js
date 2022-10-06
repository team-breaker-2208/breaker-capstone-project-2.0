import React, { useContext,useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
// import { onAuthStateChanged } from "firebase/auth";
import { ref } from "firebase/storage";
import { doc, setDoc, getDoc, collection, getDocs,updateDoc } from "firebase/firestore"; 
import { db, storage } from '../server/firebase';
import {onDisconnect} from "firebase/database";

export const CookieClicker = () => {

    const {currentUser} = useContext(AuthContext)
    const [player, setPlayer] = useState({});
    const [score,setScore]=useState(0);

    let playersCollectionRef = collection(db,"player");
    

    useEffect(()=>{
        
            const addPlayer = async()=>{
                if(currentUser.displayName){
                    await setDoc(doc(db, "player", currentUser.uid),{
                        uid: currentUser.uid,
                        displayName:currentUser.displayName,
                        points:0
                    })
                }

                // setPlayerId(currentUser.uid);
            };
            addPlayer();

        //to get all players in "player" collection
        const getUsers = async()=>{
            // const data = await getDocs(playersCollectionRef);

            if(currentUser.displayName){
                let currentPlayerRef = doc(db,"player",currentUser.uid);
                let currentPlayerSnap = await getDoc(currentPlayerRef);
                if (currentPlayerSnap.exists()) {
                        setPlayer(currentPlayerSnap.data());
                    } else {
                    // doc.data() will be undefined in this case
                    // console.log("No such document!");
                    }
                }
            }

            getUsers(); 
        
    },[currentUser])

 

    // const dummyUsers = [
    // {displayName:"Tom",
    // points:0,
    // id:1
    // },
    // {displayName:"Jerry",
    // points:0,
    // id:2
    // }];


    const handleClick=async(player)=>{
        const playerRef = doc(db,'player',player.uid);

        const res = await updateDoc(playerRef,{points:player.points+=1});
        console.log("points: ",player.points);
        setScore(player.points);
        
    }

  return (
    <>
        <h1 >Cookie Clicker!</h1>
        <div className="cookies-container">
        <div className="cookie-container" >
                        <h2>You {player.displayName}  </h2>
                        <span className="cookieImage">
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbDgy71hH1KUez-MRwk195KG_dx2I9-bULNg&usqp=CAU"
                            alt="Cookie" 
                            onClick={()=>handleClick(player)}
                        />
                        </span>
                        <h4>Score: {score}</h4>
                    </div>
            {/* {dummyUsers.map((user)=>{
                return(
                    <div className="cookie-container" key={user.id}>
                        <h2>{user.displayName} </h2>
                        <span className="cookieImage">
                        <img 
                            // src="https://www.pngkey.com/png/detail/368-3686114_cookie-lucky-block-german-cute-cartoon-chocolate-chip.png" 
                            // src="https://www.fintechfutures.com/files/2018/12/Tough-cookie.jpg"
                            // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7n1EekB7b4vZ8g2HeaJvNPGoaZf_7m7vVYCRSlW2mSE38DrOxbXf8MSPyDDd60Yq3-ZU&usqp=CAU"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbDgy71hH1KUez-MRwk195KG_dx2I9-bULNg&usqp=CAU"
                            alt="Cookie" 
                            onClick={(event)=>handleClick(event,user)}
                        />
                        </span>
                    </div>
                )
            })} */}
        </div>

    </>
  )
}
