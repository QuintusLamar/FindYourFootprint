import { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

// This should be nicer, idk what the plan is for the design though

function Profile() {
  const [name, setName] = useState("Quintus");
  const [savedCO2, setSavedCO2] = useState(0);
  const [traveledMiles, setTraveledMiles] = useState(0);
  const [favMode, setFavMode] = useState("Bike");

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box sx={{ml: '10px'}}>
        <h1> Welcome {name}!</h1>

        <h2> Using FindYourFootprint, you have saved {savedCO2} pounds of CO2</h2>
        <h2> Using FindYourFootprint, you have traveled {traveledMiles} pounds of CO2</h2>
        {/* Have the bike icon here? */}
        <h2> Your favorite mode of sustainable transportation is {favMode}</h2>


      </Box>
    </Box>
  )
}

export default Profile;