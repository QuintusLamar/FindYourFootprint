import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            authenticated ? (
              <NavPage />
            ) : (
              <>
                <Login setAuthenticated={setAuthenticated} />
                {/* Do not render BottomNav when on the login screen */}
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
      </Routes>
      {authenticated && <BottomNav />} {/* Render BottomNav only when authenticated */}
    </div>
  );
}

export default App;
