import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";

const outerTheme = createTheme({
  palette: {
    primary: {
      main: "#2fc484",
    },
    secondary: {
      main: "#FFFFFFF",
    },
  },
});

function TimeRangeSelector({ changeTime }) {
  const [title, setTitle] = useState("Leaders in Carbon Output All Time");

  // Make sure this changes which button looks selected on the screen
  function changeSelection(event) {
    setTitle("Leaders in Carbon Output " + event.currentTarget.value);
    changeTime(event.currentTarget.value);
  }

  return (
    <ThemeProvider theme={outerTheme}>
    <Box sx={{width: "800px", justifyContent: "right", display: "flex"}}>
      <ButtonGroup sx={{ width: "100%" }}>
        <Button
          sx={{
            backgroundColor: title === "Leaders in Carbon Output All Time" ? 'primary' : 'transparent',
            color: title === "Leaders in Carbon Output All Time" ? 'white' : 'black' ,
            '&:hover': {
              backgroundColor: 'lightgrey',
              color: 'black'
            },
            width: "25%"
          }}
          onClick={changeSelection}
          value="All Time"
          variant="contained"
        >
          {" "}
          All Time{" "}
        </Button>
        <Button
          sx={{
            backgroundColor: title === "Leaders in Carbon Output This Year" ? 'primary' : 'transparent',
            color: title === "Leaders in Carbon Output This Year" ? 'white' : 'black' ,
            '&:hover': {
              backgroundColor: 'lightgrey',
              color: 'black'
            },
            width: "25%"
          }}
          onClick={changeSelection}
          value="This Year"
          variant="contained"
        >
          {" "}
          This Year{" "}
        </Button>
        <Button
          sx={{
            backgroundColor: title === "Leaders in Carbon Output This Month" ? 'primary' : 'transparent',
            color: title === "Leaders in Carbon Output This Month" ? 'white' : 'black' ,
            '&:hover': {
              backgroundColor: 'lightgrey',
              color: 'black'
            },
            width: "25%"
          }}
          onClick={changeSelection}
          value="This Month"
          variant="contained"
        >
          {" "}
          This Month{" "}
        </Button>
        <Button
          sx={{
            backgroundColor: title === "Leaders in Carbon Output This Week" ? 'primary' : 'transparent',
            color: title === "Leaders in Carbon Output This Week" ? 'white' : 'black' ,
            '&:hover': {
              backgroundColor: 'lightgrey',
              color: 'black'
            },
            width: "25%"
          }}
          onClick={changeSelection}
          value="This Week"
          variant="contained"
        >
          {" "}
          This Week{" "}
        </Button>
      </ButtonGroup>
    </Box>
    </ThemeProvider>
  );
}

export default TimeRangeSelector;
