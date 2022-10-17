import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../context/AuthContext";
import EditForm from './EditForm';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../server/firebase';

export default function Profile() {

  // const {currentUser} = useContext(AuthContext);
  const [clickEdit,setClickEdit] = useState(false);
  const [user, setUser] = useState({});

//   useEffect(()=>{
//     const getUser = async()=>{
//         if(currentUser.displayName){
//             let currentPlayerRef = doc(db,"users",currentUser.uid);
//             let currentPlayerSnap = await getDoc(currentPlayerRef);
//             const stars = currentPlayerSnap.data().star;
//             setUser({...currentUser,stars:stars})
//         }
//     }
//     getUser();
//   },[currentUser,user,clickEdit])
  
  const handleUpdate = () => {
   setClickEdit(true);
  }

  return (
    <div className="profile">
       <h2>DisplayName: {user.displayName}</h2> 
       <h2>Email: {user.email}</h2>
       <h2>Stars: {user.stars}</h2>
       {!clickEdit? <button onClick = {handleUpdate} >Edit Profile</button> : < EditForm setClickEdit={setClickEdit} setUser={setUser}/>}
    </div>
  )
}
