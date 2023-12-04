// LogoutButton.js

import React from "react";
import Button from "@mui/material/Button";

const LogoutButton = ({ onLogout }) => {
  return (
    <Button variant="contained" color="primary" onClick={onLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
