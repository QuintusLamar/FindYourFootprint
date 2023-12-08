import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box"

// Defines the theme for custom colored buttons
const outerTheme = createTheme({
  palette: {
    primary: {
      main: "#349dd0",
    },
    secondary: {
      main: "#FFFFFFF",
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
    <Box sx={{width: "300px", justifyContent: "center", display: "flex"}}>
      <ThemeProvider theme={outerTheme}>
      <ButtonGroup sx={{ width: "100%" }}>
        <Button
          sx={{
            '&:hover': {
              backgroundColor: 'lightgrey',
              color: 'black'
            },
          }}
          onClick={callCallback}
          value="Friends"
          variant="contained"
          color={users === "Friends" ? "primary" : "secondary"}
        >
          {" "}
          Friends {" "}
        </Button>
        <Button
          sx={{
            '&:hover': {
              backgroundColor: 'lightgrey',
              color: 'black'
            },
          }}
          onClick={callCallback}
          value="All Users"
          variant="contained"
          color={users === "All Users" ? "primary" : "secondary"}
        >
          {" "}
          All Users{" "}
        </Button>
      </ButtonGroup>
      </ThemeProvider>
    </Box>
  );
}

export default UserTypeSelector;
