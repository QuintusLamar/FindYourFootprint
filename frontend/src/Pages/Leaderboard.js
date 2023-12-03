import { useState, useEffect } from 'react';
import '../App.css';
import UserTable from '../Components/UserTable';
import UserTypeSelector from '../Components/UserTypeSelector';
import TimeRangeSelector from '../Components/TimeRangeSelector';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function createData(rank, name, output) {
  return { rank, name, output };
}

function Leaderboard() {
  const [userType, setUserType] = useState("Friends");
  const [title, setTitle] = useState("Leaders in Carbon Output All Time");
  const [rows, setRows] = useState([
    createData(1, "Tom Brady", 0.5),
    createData(2, "Aaron Rodgers", 1),
    createData(3, "Patrick Mahomes", 2),
    createData(4, "Lamar Jackson", 6),
    createData(5, "Jalen hurts", 12),
    createData(6, "Brock Purdy", 14),
    createData(7, "Joe Burrow", 18),
    createData(8, "Trevor Lawrence", 21),
    createData(9, "Joshua Dobbs", 26),
    createData(10, "CJ Stroud", 28)
  ]);

  useEffect(() => {
    const updateData = async () => {
      try {
        const apiUrl = 'http://127.0.0.1:5000/leaderboard';
        const email = "user_5@example.com";
        const time_period = title.replace('Leaders in Carbon Output ', '').replace(' ', '').toLowerCase();
        const urlWithParameters = `${apiUrl}?email=${email}&time_period=${time_period}&is_friends_only=${userType}`;
        const response = await fetch(urlWithParameters, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          const newrows = [];
          for (let index = 0; index < data.length; index++) {
            newrows.push(createData(data[index][0], data[index][1], data[index][2]))
          }
          setRows(newrows);

        } else {
          console.error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    updateData();
  }, [title, userType]);


  function changeUsers(target) {
    setUserType(target);
  }

  function changeTime(target) {
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
          title={title}
        />
      </Paper>
      <Paper elevation={3} sx={{ p: 3, width: '80%', maxWidth: '800px', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Top Performers
        </Typography>
        <UserTable
          rows={rows}
        />
      </Paper>
    </Box>
  );
}

export default Leaderboard;
