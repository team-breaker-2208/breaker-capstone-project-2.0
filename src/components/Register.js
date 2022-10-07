import React,{ useState } from 'react'
import { auth, db } from '../server/firebase'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
    const navigate = useNavigate()
    const [error,setError] = useState("")
    const [loading,setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const displayName = e.target[0].value
        const email = e.target[1].value
        const password = e.target[2].value
        const passwordConfirmation = e.target[3].value

        if(password !== passwordConfirmation){
          return setError("Password do not match")
        }

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
            email
        })
            console.log(res)
            navigate("/")
        } catch (ex) {
          setError("Fail to register")
          console.log(ex)
        }
    setLoading(false)
  }

  return (
    <div className="full-screen-container">
            <div className="login-container">
                <h1 className="login-title">Breaker Capstone Project</h1>
                <p className="login-message">Register New User</p>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="input-login">
                        <label htmlFor="text">Display Name</label>
                        <input type="text" name="displayName" id="displayName" placeholder="Enter Display Name" />
                        {/* <span className="msg">Display Name Taken</span> */}
                    </div>

                    <div className="input-login">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder="Enter Valid email" />
                        {/* <span className="msg">Valid email</span> */}
                    </div>

                    <div className="input-login">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="New Password" />
                        {/* <span className="msg">Must meet Password criteria</span> */}
                    </div>

                    <div className="input-login">
                        <label htmlFor="password">Password Confirmation</label>
                        <input type="password" name="passwordConfirmation" id="passwordConfirmation" placeholder="Password Confirmation" />
                        {/* <span className="msg">Must meet Password criteria</span> */}
                    </div>
                    {error && <span className="msg">{error}</span>}
                    <button disabled={loading} type="submit" className="login-button">Create User</button>
                    <p className="register-link">Have an account? <Link to="/login">Login</Link></p>
                </form>
            </div>
        </div>
  )
}
