import React from 'react'

export const CookieClicker = () => {

const dummyUsers = [
    {displayName:"Tom",
    points:0
    },
    {displayName:"Jerry",
    points:0
}];


const handleClick=(user)=>{
    user.points++;
    console.log(user.points);
}



  return (
    <>
        <h1>Cookie Clicker!</h1>
        <div className="cookies-container">
            {dummyUsers.map((user)=>{
                return(
                    <div className="cookie-container">
                        <h2>{user.displayName} : {user.points}</h2>
                        <img 
                            src="https://www.pngkey.com/png/detail/368-3686114_cookie-lucky-block-german-cute-cartoon-chocolate-chip.png" 
                            alt="Cookie" 
                            onClick={handleClick(user)}
                        />
                    </div>
                )
            })}
        </div>

    </>
  )
}
