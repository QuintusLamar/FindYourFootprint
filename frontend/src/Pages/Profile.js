import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import Co2Icon from '@mui/icons-material/Co2';
import MovingIcon from '@mui/icons-material/Moving';

function Profile() {
  const [name, setName] = useState("Utkarsh");
  const [savedCO2, setSavedCO2] = useState(0);
  const [traveledMiles, setTraveledMiles] = useState(0);
  const [favMode, setFavMode] = useState("Bike");

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar />
      <Box sx={{ ml: '10px', flexGrow: 1, p: 3 }}>
        <Typography variant="h3" gutterBottom>Welcome, {name}!</Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', mb: 2 }}>
                  <Co2Icon fontSize="large" />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Saved CO2: {savedCO2} pounds
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: 'secondary.main', mb: 2 }}>
                  <MovingIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Traveled Miles: {traveledMiles} miles
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Your favorite mode of sustainable transportation is:
          </Typography>
          <Avatar sx={{ width: 150, height: 150, bgcolor: 'info.main', mx: 'auto', mt: 2 }}>
            <DirectionsBikeIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" align="center" gutterBottom sx={{ mt: 2 }}>
            {favMode}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default Profile;
