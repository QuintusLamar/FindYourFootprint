import BottomNav from './BottomNav';
import App from './App';
import Profile from './Profile';
import { Routes, Route } from "react-router-dom";

import './App.css';

function Leaderboard() {


  return (
    <div className="Leaderboard">
      {/* Table here? */}
      <BottomNav />
      <Routes>
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/Home" element={<App/>}/>
        <Route path="/Leaderboard" element={<Leaderboard/>}/>
      </Routes>
    </div>
  );
}

export default Leaderboard;