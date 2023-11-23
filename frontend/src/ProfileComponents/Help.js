import { useState } from 'react';
import '../App.css';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from '../Components/Sidebar';

function Help() {

  return (
    <Box sx={{ display: 'flex', bgcolor:"yellow"}}>
      <CssBaseline />
      <Sidebar />
      <Typography>
        Hello Help
      </Typography>
    </Box>
  );
}

export default Help;