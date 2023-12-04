import { useState, useEffect } from "react";
import "../Style/App.css";
import UserTable from "../Components/UserTable";
import UserTypeSelector from "../Components/UserTypeSelector";
import TimeRangeSelector from "../Components/TimeRangeSelector";
import axios from "axios";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function createData(rank, name, output) {
  return { rank, name, output };
}

const Leaderboard = (ck) => {
  const [userType, setUserType] = useState("Friends");
  const [title, setTitle] = useState("Leaders in Carbon Output All Time");

  // This shouldn't be used by anything
  const [rows, setRows] = useState([]);
  console.log(ck);
  const token = ck["token"];

  // Don't implement this yet
  useEffect(() => {
    // Pretty sure I want to change data (aka rows) if either the title or users gets changed,
    const updateData = async () => {
      try {
        const apiUrl = "http://localhost:5000/leaderboard";
        const time_period = title
          .replace("Leaders in Carbon Output ", "")
          .replace(" ", "")
          .toLowerCase();
        const urlWithParameters = `${apiUrl}?token=${ck["ck"]["token"]}&time_period=${time_period}&is_friends_only=${userType}`;
        const response = await axios.get(urlWithParameters, {
          "Access-Control-Allow-Origin": "*",
        });
        if (response.statusText === "OK") {
          const data = await response.data;
          const newrows = [];
          for (let index = 0; index < data.length; index++) {
            newrows.push(
              createData(data[index][0], data[index][1], data[index][2])
            );
          }
          setRows(newrows);
        } else {
          // Handle error cases
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle network errors or other exceptions
      }
    };
    updateData();
  }, [title, userType, ck]);

  function changeUsers(target) {
    console.log("Selected user: ", target);
    setUserType(target);
  }

  function changeTime(target) {
    console.log("Selected title: ", target);
    setTitle("Leaders in Carbon Output " + target);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', overflow: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, width: '80%', maxWidth: '800px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Leaderboard
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          See who's making a positive impact on the environment!
        </Typography>
        <TimeRangeSelector
          changeTime={changeTime}
        />
        <UserTypeSelector
          changeUsers={changeUsers}
        />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, width: '80%', maxWidth: '800px', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <UserTable
          rows={rows}
        />
      </Paper>
    </Box>
  );
};

export default Leaderboard;
