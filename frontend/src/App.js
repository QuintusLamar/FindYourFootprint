import OldApp from './SearchMap';
import BottomNav from './BottomNav';
import Profile from './Profile';
import Leaderboard from './Leaderboard';
import { Routes, Route } from "react-router-dom";


function App() {
  
  return (
    <div>
      <Routes>
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/" element={<OldApp/>}/>
        <Route path="/Leaderboard" element={<Leaderboard/>}/>
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App;