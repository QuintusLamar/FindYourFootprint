import '../App.css';
import React, { useState } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from "react-router-dom";
function BottomNav() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  return (
    <BottomNavigation 
      showLabels elevation={4} 
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1 }}
      value={value}
      onChange={(event, newValue) => {
        console.log("Hey: ", newValue)
        setValue(newValue)
      }}
      sx={{position: "absolute", bottom: 0, width: "100%"}}
    >
      <BottomNavigationAction onClick={() => navigate("/Profile")} value="Profile" label="Profile" icon={<AccountCircleIcon />} />
      <BottomNavigationAction onClick={() => navigate("/")} value="Home" label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction onClick={() => navigate("/Leaderboard")} value="Leaderboard" label="Leaderboard" icon={<GroupsIcon />} />
    </BottomNavigation>
  )
}

export default BottomNav;

