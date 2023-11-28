import Profile from './Pages/Profile';
import EditProfile from './ProfileComponents/EditProfile';
import Notification from './ProfileComponents/Notification';
import Security from './ProfileComponents/Security';
import Appearance from './ProfileComponents/Appearance';
import Help from './ProfileComponents/Help';
import NavPage from './Pages/NavPage';
import Leaderboard from './Pages/Leaderboard';
import BottomNav from './Components/BottomNav';
import { Routes, Route } from "react-router-dom";


function App() {
  
  return (
    <div>
      <Routes>
        
        <Route path="/" element={<NavPage/>}/>

        <Route path="/Profile/" element={<Profile/>}/>
        <Route path="/Profile/EditProfile" element={<EditProfile/>}/>
        <Route path="/Profile/Notification" element={<Notification/>}/>
        <Route path="/Profile/Security" element={<Security/>}/>
        <Route path="/Profile/Appearance" element={<Appearance/>}/>
        <Route path="/Profile/Help" element={<Help/>} />

        <Route path="/Leaderboard" element={<Leaderboard/>}/>
        
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App;