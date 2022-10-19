import React from 'react'
import { auth, db } from '../server/firebase'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Register() {

  const [loading,setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [emptyError, setEmptyError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)


  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const displayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value
    const avatar = e.target[3].value

    console.log(displayName)
    console.log(email)
    console.log(password)
    console.log(avatar)
    
    if(!displayName || !email || !password || !avatar ){
      return setEmptyError(true)
    } 
    setEmptyError(false)
    if(password.length < 6){
      return setPasswordError(true)
    }
    
  
  else {
    setPasswordError(false)
      try {
          setLoading(true)
          const res = await createUserWithEmailAndPassword(auth, email, password)
          updateProfile(auth.currentUser, {
              displayName: displayName
            }).then(() => {
              console.log(auth.currentUser)
            }).catch((error) => {
              console.log(error)
            });

          await setDoc(doc(db, "users", res.user.uid),{
              uid: res.user.uid,
              displayName,
              email,
              avatar,
              star:0
          })

          console.log(res)
          setLoading(false)
          navigate("/")

      } catch (ex) {
          console.log(ex)
          setError(true)
          setLoading(false)
      }

    }
  }


  return (
    <div className="full-screen-container">
            <div className="login-container">
                <h1 className="login-title">REGISTER TO PLAY!</h1>
                <p className="login-message">Register New User!</p>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="input-login">
                        <label htmlFor="text">Display Name</label>
                        <input type="text" name="displayName" id="displayName" placeholder="Enter Display Name" />
                        <span className="msg">Display Name Taken</span>
                    </div>

                    <div className="input-login">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder="Enter Valid email" />
                        <span className="msg">Valid email</span>
                    </div>

                        {passwordError && <span className="msg">Password must be at least 6 characters long!</span>}
                    <div className="input-login">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="New Password" />
                        <span className="msg">Must meet Password criteria</span>
                    </div>

                    <div className='select'>
                      <select className='avatar-selector' defaultValue={""} >
                        <option value="" disabled>Please Choose an Avatar</option>
                        <option value="cat" >Cat <FontAwesomeIcon icon="cat" /></option>
                        <option value="dog" >Dog <FontAwesomeIcon icon="dog" /></option>
                        <option value="poo" >Poo <FontAwesomeIcon icon="poo" /></option>
                        <option value="coffee" >Coffee <FontAwesomeIcon icon="coffee" /></option>
                        <option value="rocket" >Rocket <FontAwesomeIcon icon="rocket" /></option>
                      </select>
                    </div>

                    {emptyError && <span className="msg">Fields cannot be left empty!</span>}
                    {error && <span className="msg">Email is already in use!</span>}

                    <button disabled={loading} type= "submit" className="login-button">Create User</button>
                    <p className="register-link">You have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        </div>
  )
}
