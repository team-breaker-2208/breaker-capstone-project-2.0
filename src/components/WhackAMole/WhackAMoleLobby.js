import React, { useContext,useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { doc, setDoc, getDoc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore"; 
import { query, onSnapshot } from "firebase/firestore";
import { db } from '../../server/firebase';
import { Link , useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const WhackAMoleLobby = ({setShowNav}) => {

    const {currentUser} = useContext(AuthContext)
    const [player, setPlayer] = useState({});
    const [players, setPlayers] = useState([])
    const [gameId, setGameId] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    //getting or creating the current Game
    useEffect(()=>{
        const getGame = async()=>{
            let currentGame = false
            const gamesCollectionRef = collection(db,"whackAMoleGames")
            const data = await getDocs(gamesCollectionRef)
            data.docs.map((game) => { 
                const gameStatus = game.data().gameStatus
                if(gameStatus){
                    console.log("GID in getGame", game.data().gid)
                    setGameId(game.data().gid)
                    currentGame = true
                }
                return currentGame
            })

            if(currentGame === false ){
                const addGame = async()=>{
                    const gameRef = await addDoc(collection(db, "whackAMoleGames"),{
                        gameStatus: true
                    })
                    await setDoc(doc(db, "whackAMoleGames", gameRef.id), {
                        gameStatus: true,
                        gid: gameRef.id
                    })
                    setGameId(gameRef.id)
                    currentGame = true
                };
                console.log('addGame function runs!')

                addGame();
            }; 
        }
        getGame()
        return () => {
            console.log("get/add game useEffect was fired!")
        }
    }, [])  

    //adding players to whackAMoleGames lobby
    useEffect(()=>{
  
        const addPlayer = async()=>{
                if(currentUser.displayName){
                    let currentPlayerRef = doc(db,"users",currentUser.uid);
                    let currentPlayerSnap = await getDoc(currentPlayerRef);
                    const avatar = currentPlayerSnap.data().avatar
                    const displayName = currentPlayerSnap.data().displayName
                    await setDoc(doc(db, "whackAMolePlayers", currentUser.uid),{
                        uid: currentUser.uid,
                        displayName: displayName,
                        points:0,
                        avatar: avatar
                        // gid: gameId
                    })
                }
        };
        addPlayer();

        //to get all players in "Cookie player" collection
        const getSinglePlayer = async()=>{
            
            if(currentUser.displayName){
                let currentPlayerRef = doc(db,"whackAMolePlayers",currentUser.uid);
                let currentPlayerSnap = await getDoc(currentPlayerRef);
                if (currentPlayerSnap.exists()) {
                        setPlayer(currentPlayerSnap.data());
                } else {
                    // doc.data() will be undefined in this case
                    // console.log("No such document!");
                }
            }
        }
        setLoading(true);

        getSinglePlayer(); 
        setLoading(false);
    },[currentUser, gameId])
    
      

    useEffect(()=>{
        const qPlayers = query(collection(db, "whackAMolePlayers"));
        const unsubscribe = onSnapshot(qPlayers, (querySnapshot) => {
            let playersArr = querySnapshot.docs;
            setPlayers(playersArr);
        });
        
        return()=>{
            unsubscribe();
        }
    },[])

    console.log("GID: ", gameId);

    const handleNavigateAway = async () => {
        await deleteDoc(doc(db, 'whackAMolePlayers', player.uid))
    }

    window.onunload = function(){
        handleNavigateAway();
        return 'Are you sure you want to leave?';
      };

    const handleClick = async(player)=>{
        await deleteDoc(doc(db, 'whackAMolePlayers', player.uid))
    }

    if (players.length === 4){
        setShowNav(false)
        setTimeout(()=>{
            navigate("/whackAMole");

        }, "6000")
        return(
            <div className="cookieClicker-loading-screen">
                <h1 className="word mole-ready">READY!</h1>  
                <h1 className="word mole-set">SET!!</h1>
                <h1 className="word mole-go">GO!!!</h1>
            </div>
        )
    }

  return (
    <>
    <h1 className="welcome">WELCOME TO WHACK A MOLE LOBBY!</h1>
    <div className="lobbyContainer">
        <h2 className="infoDiv">LOBBY STATUS: {players.length}/4 PLAYERS</h2>
        {loading ?<div>Loading...</div> : <div className="PlayersContainer">
            {players.map((singlePlayer) => {
                return (
                    <h3 className="players" key={singlePlayer.data().uid}>
                        {singlePlayer.data().displayName.toUpperCase()}
                        <div className='avatar'><FontAwesomeIcon icon={singlePlayer.data().avatar} bounce /></div>
                    </h3>
                )
            })}
        
        
        </div>}
        <div className="infoDiv">WAITING ON {4 - players.length} MORE</div>         
    </div>
    <Link to="/"><button onClick={()=>handleClick(player)}>Return to Game Select</button></Link>
    </>
  )
}

export default WhackAMoleLobby;