import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../server/firebase";

export default function Login() {
    const [error, setError] = useState(false)

  const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const email = e.target[0].value
        const password = e.target[1].value

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/")
        } catch (ex) {
            console.log(ex)
            setError(true)
        }
    }

  return (
    <div className="full-screen-container">
            <div className="login-container">
                <h1 className="login-title">Welcome to Breaker Game!</h1>
                <p className="login-message">Please Register or Login to Enter</p>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="input-login">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" />
                        <span className="msg">Valid email</span>
                    </div>

                    <div className="input-login">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" />
                        <span className="msg">Incorrect password</span>
                    </div>
                    
                    {error && <span className="msg">Failed to sign in</span>}

                    <button type="submit" className="login-button">Login</button>
                    <p className="register-link">Don't have an account? <Link to="/register">Register a new User</Link> </p>
                    {/* <div id="signInDiv"></div> */}
                </form>
            </div>
        </div>
  )
}
