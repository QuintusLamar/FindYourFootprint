import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Profile from './Pages/Profile';
import EditProfile from './ProfileComponents/EditProfile';
import ViewFriends from './ProfileComponents/ViewFriends';
import AddFriend from './ProfileComponents/AddFriend';
import NavPage from './Pages/NavPage';
import Leaderboard from './Pages/Leaderboard';
import BottomNav from './Components/BottomNav';
import Login from './Login';
import Register from './Register'; // Import your Register component

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
                {/* Add a link to the register page */}
              </>
            )
          }
        />
        <Route path="/Profile/" element={<Profile />} />
        <Route path="/Profile/EditProfile" element={<EditProfile />} />
        <Route path="/Profile/Friends" element={<ViewFriends />} />
        <Route path="/Profile/AddFriend" element={<AddFriend />} />
        <Route path="/Leaderboard" element={authenticated ? <Leaderboard /> : <Login setAuthenticated={setAuthenticated} />} />
        <Route path="/register" element={<Register />} /> {/* New route for the register page */}
      </Routes>
      {authenticated && <BottomNav />} {/* Render BottomNav only when authenticated */}
    </div>
  );
}

export default App;
