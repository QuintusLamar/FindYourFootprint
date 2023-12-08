import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function ProgressBar({ width, label, currAmount, maxAmount }) {
  return (
    <Box sx={{ width: "80%" }}>
      <Typography sx={{ mb: "10px", mt: "10px" }}>
        {label}
      </Typography>
      <div
        className="progressBarWrapper"
        style={{ borderRadius: "50px", overflow: "hidden" }}
      >
        <progress
          className="progressBar"
          id="progress-bar"
          value={currAmount}
          max={maxAmount}
          style={{ width: "100%" }}
        >
          {currAmount}%
        </progress>
      </div>
    </Box>
  );
}

export default ProgressBar;
