import React, { useContext, useState } from 'react';
import { AuthContext } from "../context/AuthContext";
import EditForm from './EditForm';

export default function Profile() {

  const {currentUser} = useContext(AuthContext);
  const [clickEdit,setClickEdit] = useState(false);
  
  const handleUpdate = () => {
   setClickEdit(true);
  }

  return (
    <div className="profile">
       <h2>{currentUser.displayName}</h2> 
       <h2>{currentUser.email}</h2>
       {!clickEdit? <button onClick = {handleUpdate} >Edit Profile</button> : < EditForm />}
       
    </div>
  )
}
