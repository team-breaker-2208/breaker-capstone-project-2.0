import React, { useState, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../server/firebase'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function EditForm({email,stars,setUser,setClickEdit}) {

    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const [emptyError, setEmptyError] = useState(false);
    const [form,setForm] = useState({
        userId:currentUser.uid,
        displayName:"",
        avatar:""
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

        if(!form.displayName || !form.avatar ){
            return setEmptyError(true);
        } 
        setEmptyError(false);

        if(currentUser.displayName){
                let currentPlayerRef = doc(db,"users",currentUser.uid);
                await updateDoc(currentPlayerRef,{displayName:form.displayName,avatar:form.avatar})
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

            <div className='select-edit'>
                      <select className='avatar-selector-edit' value={form.avatar || ""} onChange={handleChange("avatar")} >
                        <option value="" disabled>Please Choose an Avatar</option>
                        <option value="cat" >Cat <FontAwesomeIcon icon="cat" /></option>
                        <option value="dog" >Dog <FontAwesomeIcon icon="dog" /></option>
                        <option value="poo" >Poo <FontAwesomeIcon icon="poo" /></option>
                        <option value="coffee" >Coffee <FontAwesomeIcon icon="coffee" /></option>
                        <option value="rocket" >Rocket <FontAwesomeIcon icon="rocket" /></option>
                      </select>
            </div>

            {emptyError && <span className="msg">Fields cannot be left empty!</span>}

            <button onClick={handleUpdate}>Save Changes</button>
            <button onClick={handleCancel} >Cancel</button>
        </form>
    </div>
  )
}
