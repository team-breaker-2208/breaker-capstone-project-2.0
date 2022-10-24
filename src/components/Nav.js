import React, { useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../server/firebase';
import {signOut} from 'firebase/auth'
import { auth } from '../server/firebase'

export default function Nav() {

    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleClick = async() =>{
        await deleteDoc(doc(db, 'whackAMolePlayers', currentUser.uid))
        await deleteDoc(doc(db, 'CookieClickerPlayer', currentUser.uid))
        await deleteDoc(doc(db, 'memoryPlayers', currentUser.uid))
    }

    const handleLogout = async() =>{
        await deleteDoc(doc(db, 'MainLobbyPlayer', currentUser.uid))
        await deleteDoc(doc(db, 'whackAMolePlayers', currentUser.uid))
        await deleteDoc(doc(db, 'CookieClickerPlayer', currentUser.uid))
        await deleteDoc(doc(db, 'memoryPlayers', currentUser.uid))
        signOut(auth);
        navigate('/')
      }

  return (
    <div className="navBar">
        <div className="logo">
            <span>BREAKER</span>
        </div>

        <div className="dropdown">
            <button className="menu-button"><FontAwesomeIcon icon="bars" style={{color:"white"}}/></button>
            <div className="dropdown-content">

                <div className="menu-item">
                    <Link  className="links" onClick={handleClick} to="/" ><FontAwesomeIcon icon={faHouse} style={{color:"white"}}/> Home</Link>
                </div>

                <div className="menu-item" >
                    <Link className="links" onClick={handleClick}  to="/chart" ><FontAwesomeIcon icon='chart-simple' style={{color:"white"}}/> Ranking</Link>
                </div>

                <div className="menu-item" >
                    <a className="links" onClick={handleClick}  href="https://github.com/team-breaker-2208" ><FontAwesomeIcon icon={faGithub} style={{color:"white"}}/> GitHub</a>   
                </div>

                <div className="menu-item" >
                    {currentUser? 
                        <Link className="links" onClick={handleClick}  to="/Profile"><FontAwesomeIcon icon={faUser} style={{color:"white"}}/> Profile</Link>
                        : 
                        null
                    }
                </div> 

                <div>
                    {currentUser? 
                        <span className="links" onClick={()=> handleLogout()}><FontAwesomeIcon icon="sign-out-alt" style={{color:"white"}}/> Logout</span>
                        : 
                        null
                    } 
                </div>
            </div>     
        </div>
    </div>
  )
}
