import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Profile from './Pages/Profile';
import EditProfile from './ProfileComponents/EditProfile';
import Notification from './ProfileComponents/Notification';
import Security from './ProfileComponents/Security';
import Appearance from './ProfileComponents/Appearance';
import Help from './ProfileComponents/Help';
import NavPage from './Pages/NavPage';
import Leaderboard from './Pages/Leaderboard';
import BottomNav from './Components/BottomNav';
import Login from './Login';
import Register from './Register';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <div style={{ 
      background: 'linear-gradient(to bottom, #98FB98, #2E8B57)', 
      minHeight: '85vh', 
      padding: '20px' 
    }}>
      {/* Add your gradient background color and styling here */}
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? (
              <NavPage />
            ) : (
              <>
                <Login setAuthenticated={setAuthenticated} />
                {/* Add a link to the register page */}
              </>
            )
          }
        />
        <Route path="/Profile/" element={<Profile />} />
        <Route path="/Profile/EditProfile" element={<EditProfile />} />
        <Route path="/Profile/Notification" element={<Notification />} />
        <Route path="/Profile/Security" element={<Security />} />
        <Route path="/Profile/Appearance" element={<Appearance />} />
        <Route path="/Profile/Help" element={<Help />} />
        <Route path="/Leaderboard" element={authenticated ? <Leaderboard /> : <Login setAuthenticated={setAuthenticated} />} />
        <Route path="/register" element={<Register />} /> {/* New route for the register page */}
      </Routes>
      {authenticated && <BottomNav />} {/* Render BottomNav only when authenticated */}
    </div>
  );
}

export default App;
