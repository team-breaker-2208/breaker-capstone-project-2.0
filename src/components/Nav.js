import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";


export default function Nav() {

    const {currentUser} = useContext(AuthContext);

  return (
    <div className="navBar">
        <div className="logo">
            <span>BREAKER</span>
        </div>

        <div className="nav-right">
            {currentUser? 
                <span>Welcome {currentUser.displayName} !</span>
                : 
                null
            }
            <Link className ="nav-link" to="/" ><FontAwesomeIcon icon={faHouse} style={{color:"white"}}/></Link>
            <Link className ="nav-link" to="/chart" ><FontAwesomeIcon icon='chart-simple' style={{color:"white"}}/></Link>
            {currentUser? 
                <Link className="nav-link" to="/Profile"><FontAwesomeIcon icon={faUser} style={{color:"white"}}/></Link>
                : 
                null
            } 
            <a className ="nav-link" href="https://github.com/team-breaker-2208" ><FontAwesomeIcon icon={faGithub} style={{color:"white"}}/></a>   
        </div>
        

    </div>
  )
}
