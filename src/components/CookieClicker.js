import React, { useContext,useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
// import { onAuthStateChanged } from "firebase/auth";
import { ref } from "firebase/storage";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore"; 
import { db, storage } from '../server/firebase';
import {onDisconnect} from "firebase/database";

export const CookieClicker = () => {

    const {currentUser} = useContext(AuthContext)
    const [player, setPlayer] = useState({})
    const [playerId,setPlayerId] = useState("");

    let playersCollectionRef = collection(db,"player");
    

    useEffect(()=>{
        const addPlayer = async()=>{
            const player = await setDoc(doc(db, "player", currentUser.uid),{
                uid: currentUser.uid,
                displayName:currentUser.displayName,
                points:0
            })
            setPlayer(player);
            setPlayerId(currentUser.uid);
        };
        addPlayer();

        //to get all players in "player" collection
        const getUsers = async()=>{
            const data = await getDocs(playersCollectionRef);
            console.log("users",data);
            let currentPlayerRef = doc(db,"player",playerId);
            let currentPlayerSnap = await getDoc(currentPlayerRef);
            console.log("currentPlayer",currentPlayerSnap);
        }
        getUsers();

    
        // let playerRef = ref(storage,`player/${currentUser.uid}`);

        // console.log("playerRef",playerRef);
        // onDisconnect(playerRef).remove().catch((err) => {
        //     if (err) {
        //       console.error("could not establish onDisconnect event", err);
        //     }
        //   });
    },[player,playerId,currentUser])


    // addPlayer();
    // let playerRef = storage.ref("player");

    // let playerRef = ref(storage,`player/${playerId}`);
    // console.log(playerRef);
    // onDisconnect(playerRef).remove().catch((err) => {
    //     if (err) {
    //       console.error("could not establish onDisconnect event", err);
    //     }
    //   });



    // let playerId;
    // let playerRef;

    // onAuthStateChanged((user) => {

    //     console.log(user)
        
    //     if(user) {
        
        // playerId = currentUser.id;
        // playerRef = ref(`players/${playerId}`);
        
    //     } else {
        
    //     console.log( "no player" )
    //     }
    // })

    // useEffect(()=> {
    //     let userWithPoint={...currentUser,points:0};
    //     setPlayer(userWithPoint);
    // },[currentUser]) 
    
    
    //how to get other users in this room
    const dummyUsers = [
    {displayName:"Tom",
    points:0,
    id:1
    },
    {displayName:"Jerry",
    points:0,
    id:2
    }];


    const handleClick=(event,user)=>{
        user.points++;
        console.log(user.displayName +" points: " + user.points);
        
    }

  return (
    <>
        <h1>Cookie Clicker!</h1>
        <div className="cookies-container">
        <div className="cookie-container" >
                        <h2>You  </h2>
                        <span className="cookieImage">
                        <img 
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbDgy71hH1KUez-MRwk195KG_dx2I9-bULNg&usqp=CAU"
                            alt="Cookie" 
                            onClick={(event)=>handleClick(event,player)}
                        />
                        </span>
                    </div>
            {dummyUsers.map((user)=>{
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
            })}
        </div>

    </>
  )
}
