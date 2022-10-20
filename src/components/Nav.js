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
    // const [open,setOpen] = useState(false);

    // const handleOpen = () => {
    //     setOpen(!open);
    // }

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
    // <div className="navBar">
    //     <div className="logo">
    //         <span>BREAKER</span>
    //     </div>

    //     <div className="nav-right">
    //         {currentUser? 
    //             <span>Welcome {currentUser.displayName} !</span>
    //             : 
    //             null
    //         }
    //         <Link onClick={handleClick} className="nav-link" to="/" ><FontAwesomeIcon icon={faHouse} style={{color:"white"}}/></Link>
    //         <Link onClick={handleClick} className ="nav-link" to="/chart" ><FontAwesomeIcon icon='chart-simple' style={{color:"white"}}/></Link>
    //         {currentUser? 
    //             <Link onClick={handleClick} className="nav-link" to="/Profile"><FontAwesomeIcon icon={faUser} style={{color:"white"}}/></Link>
    //             : 
    //             null
    //         } 
    //         <a onClick={handleClick} className ="nav-link" href="https://github.com/team-breaker-2208" ><FontAwesomeIcon icon={faGithub} style={{color:"white"}}/></a>   
    //         {currentUser? 
    //             <button className='logout-home-button' onClick={()=> handleLogout()}>Logout</button>
    //             : 
    //             null
    //         } 
    //     </div>
    // </div>

    <div className="navBar">
        <div className="logo">
            <span>BREAKER</span>
        </div>

        {currentUser? 
            <span>Welcome {currentUser.displayName} !</span>
            : 
            null
        }

        <div className="dropdown">
            <button >Menu</button>
            <div className="dropdown-content">
                    <div>
                    <Link onClick={handleClick}  to="/" ><FontAwesomeIcon icon={faHouse} style={{color:"white"}}/> Home</Link>
                    </div>
                    <Link onClick={handleClick}  to="/chart" ><FontAwesomeIcon icon='chart-simple' style={{color:"white"}}/> Ranking</Link>
                    <div>
                    {currentUser? 
                        <Link onClick={handleClick}  to="/Profile"><FontAwesomeIcon icon={faUser} style={{color:"white"}}/> Profile</Link>
                        : 
                        null
                    }
                    </div> 
                    <a onClick={handleClick}  href="https://github.com/team-breaker-2208" ><FontAwesomeIcon icon={faGithub} style={{color:"white"}}/> GitHub</a>   
                    {currentUser? 
                        <button onClick={()=> handleLogout()}>Logout</button>
                        : 
                        null
                    } 
            </div>     
        </div>
    </div>
  )
}
