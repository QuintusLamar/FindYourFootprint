import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box"

// Defines the theme for custom colored buttons
const outerTheme = createTheme({
  palette: {
    primary: {
      main: "#0096FF",
    },
    secondary: {
      main: "#808080",
    },
  },
});

function UserTypeSelector({ changeUsers }) {
  const [users, setUsers] = useState("Friends");

  function callCallback(event) {
    setUsers(event.currentTarget.value);
    changeUsers(event.currentTarget.value);
  }

  return (
    <Box sx={{display: "flex", justifyContent: "left", mt:"10px", width: "30%"}}>
      <ThemeProvider theme={outerTheme}>
        <div className="Rand">
          <Button
            sx={{
              borderRadius: "10px",
              minWidth: "12px",
              color: "black",
              fontSize: 14,
              fontWeight: 600,
              margin: "4px",
              height: "28px",
            }}
            variant="contained"
            onClick={callCallback}
            value="Friends"
            color={users === "Friends" ? "primary" : "secondary"}
          >
            Friends
          </Button>
          <Button
            sx={{
              borderRadius: "10px",
              minWidth: "12px",
              color: "black",
              fontSize: 14,
              fontWeight: 600,
              margin: "4px",
              height: "28px",
            }}
            variant="contained"
            onClick={callCallback}
            value="All Users"
            color={users==="All Users" ? "primary" : "secondary"}
          > 
            All Users 
          </Button>
        </div>
      </ThemeProvider>
    </Box>
  );
}

export default UserTypeSelector;
