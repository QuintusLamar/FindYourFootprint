import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';

function ProgressBar({width, label, currAmount, maxAmount}) {

  return (
    <Box sx={{width: "80%"}}>
      <Typography sx={{mb: "10px", mt:"10px"}}>
        {label}
      </Typography>
      <progress className="progressBar" id="progress-bar" value={currAmount} max={maxAmount}>{currAmount}%</progress>
    </Box>
  )
}

export default ProgressBar;