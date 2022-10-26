import React, {useEffect, useState, useContext, useRef} from 'react';
import { collection } from "firebase/firestore"; 
import { query, onSnapshot, addDoc, orderBy, limit, serverTimestamp, doc, getDoc  } from "firebase/firestore";
import { db } from '../server/firebase';
import { AuthContext } from "../context/AuthContext";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const moment = require('moment');

export default function ChatRoom() {

    const {currentUser} = useContext(AuthContext);
    
    const dummy = useRef();

    const [messages,setMessages] = useState([]);
    const [formMessage,setFormMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    const sendMessage = async(e) => {
        e.preventDefault();

        if(!formMessage) return;

        if(currentUser.displayName){
            let currentPlayerRef = doc(db,"users",currentUser.uid);
            let currentPlayerSnap = await getDoc(currentPlayerRef);
            const avatar = currentPlayerSnap.data().avatar
            await addDoc(collection(db, "messages"),{
                userId:currentUser.uid,
                text:formMessage,
                createdAt: serverTimestamp(),
                displayName:currentUser.displayName,
                avatar:avatar
            });
        }

        setFormMessage("");
        dummy.current.scrollIntoView({behavior:"smooth"});
    }

      //watching messages in chatRoom
    useEffect(()=>{
        let messageRef = query(collection(db,"messages"),orderBy("createdAt","desc"),limit(20));
        
        //get the message array from db
        const unsubscribe = onSnapshot(messageRef, (querySnapshot) => {
            let messageArr = querySnapshot.docs;
            messageArr.reverse();
            setMessages(messageArr);
        });

        return unsubscribe;
    },[])

    //update messages
    useEffect(()=> {
        setMessages(messages)   
    },[messages])

    //component of single message
    function ChatMessage(props){

        const {userId, text, displayName,createdAt, avatar} = props.message.data();
        const className = userId === currentUser.uid? "message-sent":"message-received";

        let date;
        if(createdAt){
            date = moment(createdAt.toDate()).fromNow();  
        }
        return(
            <div className="oneMessage">
                <div key = {props.message} className={`message ${className}`}>
                    <h3><FontAwesomeIcon icon={avatar} /> {displayName}</h3>
                    <p className="text">{text}</p>
                    <p className="time">{date} </p>
                </div>
            </div>
        )
    }

  return (
    <div className="chatContainer">
        <h2 className="chatHeader">CHAT ROOM</h2>
        <div className="chatRoom">

            {messages && messages.map((message)=>{
                return(
                    <ChatMessage key={message.data().createdAt} message={message} />
                )
            })}
            <div ref={dummy}></div>
        </div>

        <div className="input-form">
             <form onSubmit={handleSubmit}>
                <input placeholder=" type here......" value = {formMessage} onChange={(e) => setFormMessage(e.target.value)}/>
                <span><FontAwesomeIcon icon={faPaperPlane} onClick={sendMessage}/></span>
            </form>
        </div>

    </div>
  )
}
