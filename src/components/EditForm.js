import React, { useState, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../server/firebase'; 

export default function EditForm({email,stars,setUser,setClickEdit}) {

    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const [form,setForm] = useState({
        userId:currentUser.uid,
        displayName:"",
    });

    const handleCancel = () => {
        navigate("/");
    }
    const handleChange = (prop) => (event) => {
        setForm({
            ...form,
            [prop]:event.target.value
        });
    };

    const handleUpdate = async(event) => {
        event.preventDefault();
        if(currentUser.displayName){
            let currentPlayerRef = doc(db,"users",currentUser.uid);
            // let currentPlayerSnap = await getDoc(currentPlayerRef);
            // const stars = currentPlayerSnap.data().star;
            await updateDoc(currentPlayerRef,{displayName:form.displayName})
            setUser({displayName:form.displayName,email:email,stars:stars})
        }
        setClickEdit(false);
        navigate("/profile");
    }

  return (
    <div className="editProfile">
        <div className="form-title">Edit Profile</div>
        <form>
            <div className="form-item">
                <label htmlFor="displayName" className="form-label">DisplayName</label>
                <input type="text" value={form.displayName || ""} onChange={handleChange("displayName")} /> 
            </div>

            <button onClick={handleCancel} >Cancel</button>
            <button onClick={handleUpdate}>Edit</button>
        </form>
    </div>
  )
}
