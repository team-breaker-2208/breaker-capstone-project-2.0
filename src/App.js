import React, { useContext } from "react";
import Register from "./components/Register";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from "./components/Home";
import Login from "./components/Login";
import { AuthContext } from "./context/AuthContext";
import { CookieClicker } from "./components/CookieClicker";
import CookieLobby from "./components/CookieLobby";
import WinnerPage from './components/WinnerPage'

function App() {
  const currentUser = useContext(AuthContext)

  const ProtectedRoute = ({children}) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children
  }

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/">
            <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route exact path="login" element={<Login />} />
            <Route exact path="register" element={<Register />} />
            <Route exact path="cookieClicker" element={<CookieClicker />} />
            <Route exact path="CookieLobby" element={<CookieLobby/>} />
            <Route exact path='winnerPage' element={<WinnerPage/>}/>
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
