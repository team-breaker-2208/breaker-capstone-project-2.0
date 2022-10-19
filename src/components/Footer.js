import React from 'react';
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function Footer() {
    return (
        <div className="footer">
        <p>Copyright &copy; Breaker</p>
        <a className="footer-github" href="https://github.com/team-breaker-2208" ><FontAwesomeIcon icon={faGithub} style={{color:"white"}}/></a>
        </div>
      );
}
