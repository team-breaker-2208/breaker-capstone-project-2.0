import React from 'react'

export default function Register() {
  const handleSubmit = async (e) => {
    e.preventDefault()

    const displayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value

    console.log(displayName)
    console.log(email)
    console.log(password)
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
                        <span className="msg">Display Name Taken</span>
                    </div>

                    <div className="input-login">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder="Enter Valid email" />
                        <span className="msg">Valid email</span>
                    </div>

                    <div className="input-login">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="New Password" />
                        <span className="msg">Must meet Password criteria</span>
                    </div>

                    <button type="submit" className="login-button">Create User</button>
                    {/* <p className="register-link">You have an account? <Link to="/login">Login</Link></p> */}
                    {/* <div id="signInDiv"></div> */}
                </form>
            </div>
        </div>
  )
}
