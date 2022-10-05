import React, { useContext,useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export const CookieClicker = () => {

    const {currentUser} = useContext(AuthContext)
    const [user, setUser] = useState({})

    //dependency either[] or[currentUser,user],otherwise warning,
    //but the first will not render the user and the later will cause infinite loop??
    useEffect(()=> {
        let userWithPoint={...currentUser,points:0}
        setUser(userWithPoint);
        console.log(user);
    },[currentUser])      
    //how to get other users in this room
    const dummyUsers = [
    {displayName:"Tom",
    points:0,
    id:1
    },
    {displayName:"Jerry",
    points:0,
    id:2
    }];


    const handleClick=(event,user)=>{
        user.points++;
        console.log(user.displayName +" points: " + user.points);
        
    }

  return (
    <>
        <h1>Cookie Clicker!</h1>
        <div className="cookies-container">
        <div className="cookie-container" >
                        <h2>You {user.displayName} </h2>
                        <span className="cookieImage">
                        <img 
                            // src="https://www.pngkey.com/png/detail/368-3686114_cookie-lucky-block-german-cute-cartoon-chocolate-chip.png" 
                            // src="https://www.fintechfutures.com/files/2018/12/Tough-cookie.jpg"
                            // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7n1EekB7b4vZ8g2HeaJvNPGoaZf_7m7vVYCRSlW2mSE38DrOxbXf8MSPyDDd60Yq3-ZU&usqp=CAU"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbDgy71hH1KUez-MRwk195KG_dx2I9-bULNg&usqp=CAU"
                            alt="Cookie" 
                            onClick={(event)=>handleClick(event,user)}
                        />
                        </span>
                    </div>
            {dummyUsers.map((user)=>{
                return(
                    <div className="cookie-container" key={user.id}>
                        <h2>{user.displayName} </h2>
                        <span className="cookieImage">
                        <img 
                            // src="https://www.pngkey.com/png/detail/368-3686114_cookie-lucky-block-german-cute-cartoon-chocolate-chip.png" 
                            // src="https://www.fintechfutures.com/files/2018/12/Tough-cookie.jpg"
                            // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7n1EekB7b4vZ8g2HeaJvNPGoaZf_7m7vVYCRSlW2mSE38DrOxbXf8MSPyDDd60Yq3-ZU&usqp=CAU"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbDgy71hH1KUez-MRwk195KG_dx2I9-bULNg&usqp=CAU"
                            alt="Cookie" 
                            onClick={(event)=>handleClick(event,user)}
                        />
                        </span>
                    </div>
                )
            })}
        </div>

    </>
  )
}
