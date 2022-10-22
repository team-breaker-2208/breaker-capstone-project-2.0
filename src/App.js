import React, { useContext, useState } from "react";
import Register from "./components/Register";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from "./components/Home";
import Login from "./components/Login";
import { AuthContext } from "./context/AuthContext";
import { CookieClicker } from "./components/CookieClicker";
import CookieLobby from "./components/CookieLobby";
import WinnerPage from './components/WinnerPage';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Profile from './components/Profile';
import WhackAMole from "./components/WhackAMole/WhackAMole";
import WhackAMoleLobby from './components/WhackAMole/WhackAMoleLobby';
import WhackAMoleWinnerPage from './components/WhackAMole/WhackAMoleWinnerPage';
import Chart from './components/Chart'
import SlideGame from './components/SlideGame/SlideGame.js'
import Memory  from "./components/Memory/Memory"
import MemoryLobby from "./components/Memory/MemoryLobby"
import MemoryWinnerPage from "./components/Memory/MemoryWinnerPage"
import CookieClickerSingle from "./components/SinglePlayerGames/CookieClickerSingle"
import MemorySinglePlayer from "./components/SinglePlayerGames/MemorySinglePlayer";

function App() {
  const currentUser = useContext(AuthContext)
  const [showNav, setShowNav] = useState(true);

  const ProtectedRoute = ({children}) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children
  }

  return (
    <BrowserRouter>
    { showNav && <Nav /> } 
      <div className="wrapper">
        <Routes>
            <Route path="/">
              <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route exact path="login" element={<Login />} />
              <Route exact path="register" element={<Register />} />
              <Route exact path="cookieClicker" element={<CookieClicker setShowNav={setShowNav} />} />
              <Route exact path="cookieClickerSingle" element={<CookieClickerSingle setShowNav={setShowNav} />} />
              <Route exact path="CookieLobby" element={<CookieLobby setShowNav={setShowNav} />} />
              <Route exact path='winnerPage' element={<WinnerPage/>}/>
              <Route exact path='profile' element={<Profile/>}/>
              <Route exact path="whackAMoleLobby" element={<WhackAMoleLobby setShowNav={setShowNav} />}/>
              <Route exact path="whackAMole" element={<WhackAMole setShowNav={setShowNav} />}/>
              <Route exact path="whackAMoleWinnerPage" element={<WhackAMoleWinnerPage/>}/>
              <Route exact path="chart" element={<Chart/>}/>
              <Route exact path="slideGame" element={<SlideGame setShowNav={setShowNav} />}/>
              <Route exact path="memory" element={<Memory setShowNav={setShowNav} />}/>
              <Route exact path="memorySingle" element={<MemorySinglePlayer setShowNav={setShowNav} />}/>
              <Route exact path="memoryLobby" element={<MemoryLobby setShowNav={setShowNav} />}/>
              <Route exact path="memoryWinnerPage" element={<MemoryWinnerPage />}/>
            </Route>
        </Routes>
      </div>
    <Footer />
    </BrowserRouter>
  );
}

export default App;
