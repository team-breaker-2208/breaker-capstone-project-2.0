import React, {useEffect, useState, useContext} from 'react';
import { collection } from "firebase/firestore"; 
import { query, onSnapshot, addDoc, orderBy, limit, serverTimestamp, doc, getDoc  } from "firebase/firestore";
import { db } from '../server/firebase';
import { AuthContext } from "../context/AuthContext";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ChatRoom() {

    const {currentUser} = useContext(AuthContext);
    

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

    }

      //watching messages in chatRoom
    useEffect(()=>{
        let messageRef = query(collection(db,"messages"),orderBy("createdAt","desc"),limit(10));
        // messageRef = query(messageRef,orderBy("createdAt"),limit(10));
        
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
        let time;
        let date;
        if(createdAt){
            time= createdAt.toDate().toLocaleTimeString();
            date = createdAt.toDate().toLocaleDateString();
        }
        return(
            <div className="oneMessage">
                <div key = {props.message} className={`message ${className}`}>
                    <h3>{displayName}<FontAwesomeIcon icon={avatar} /></h3>
                    <p>{text}</p>
                    <p>{date} {time}</p>
                </div>
            </div>
        )
    }
 


  return (
    <>
        <h2>ChatRoom</h2>
        <div className="chatRoom">

            {messages && messages.map((message)=>{
                return(
                    <ChatMessage key={message.data().createdAt} message={message} />
                )
            })}

            <form onSubmit={handleSubmit}>
                <input value = {formMessage} onChange={(e) => setFormMessage(e.target.value)}/>
                <FontAwesomeIcon icon={faPaperPlane} onClick={sendMessage}/>
            </form>

        </div>
    </>
  )
}
