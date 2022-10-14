import React, { useState, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

export default function EditForm() {

    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const [form,setForm] = useState({
        userId:currentUser.uid,
        displayName:"",
        email:""
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

    const handleUpdate = () => {
        
    }

  return (
    <div className="editProfile">
        <div className="form-title">Edit Profile</div>
        <form>
            <div className="form-item">
                <label htmlFor="displayName" className="form-label">Name</label>
                <input type="displayName" value={form.userName || ""} onChange={handleChange("displayName")} /> 
            </div>

            <div className="form-item">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" value={form.email || ""} onChange={handleChange("email")} /> 
            </div>

            <button onClick={handleCancel} >Cancel</button>
            <button onClick={handleUpdate}>Edit</button>
        </form>
    </div>
  )
}
