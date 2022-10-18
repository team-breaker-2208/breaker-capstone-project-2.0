import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Nav() {

    const {currentUser} = useContext(AuthContext);

  return (
    <div className="navBar">
        <div className="logo">
            <span>BREAKER</span>
        </div>

        <div className="nav-right">
            {currentUser? 
                <span>Welcome {currentUser.displayName}!</span>
                : 
                null
            }
            <Link className ="nav-link" to="/" >Home</Link>
            <a className ="nav-link" href="https://github.com/team-breaker-2208" >Contact</a>
            {currentUser? 
                <Link className="nav-link" to="/Profile">Profile</Link>
                : 
                null
            }    
        </div>
        

    </div>
  )
}
