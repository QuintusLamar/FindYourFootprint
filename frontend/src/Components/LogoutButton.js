// LogoutButton.js

import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";

const TransparentButton = styled(Button)({
  backgroundColor: "transparent",
  color: "#000", // Set the text color to black
  boxShadow: "none", // Remove the shadow
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Add a slight background on hover if needed
  },
});

const LogoutButton = ({ onLogout }) => {
  return (
    <TransparentButton variant="contained" color="primary" onClick={onLogout}>
      Logout
    </TransparentButton>
  );
};

export default LogoutButton;
