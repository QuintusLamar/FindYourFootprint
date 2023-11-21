import { useState } from 'react';
import './App.css';
import UserTable from './UserTable'
import UserTypeSelector from './UserTypeSelector'
import TimeRangeSelector from './TimeRangeSelector';


function createData(rank, name, output, prev_rank) {
  return { rank, name, output, prev_rank };
}


function Leaderboard() {
  const [userType, setUserType] = useState("Friends");
  const [title, setTitle] = useState("Leaders in Carbon Output All Time");

  const rows = [
    createData(1, "Tom Brady", 0.5, 5),
    createData(2, "Aaron Rodgers", 1, 2),
    createData(3, "Patrick Mahomes", 2, 1),
    createData(4, "Lamar Jackson", 6, 3),
    createData(5, "Jalen hurts", 12, 9),
    createData(6, "Brock Purdy", 14, 4),
    createData(7, "Joe Burrow", 18, 8),
    createData(8, "Trevor Lawrence", 21, 7),
    createData(9, "Joshua Dobbs", 26, 10),
    createData(10, "CJ Stroud", 28, 6)
  ];

  function changeUsers(target) {
    console.log("Selected user: ", target)
    setUserType(target)
  }

  function changeTime(target) {
    console.log("Selected title: ", target)
    setTitle("Leaders in Carbon Output " + target)
  }

  return (
    <div className="Leaderboard">
      <TimeRangeSelector 
        changeTime={changeTime}
      
      />
      <UserTypeSelector 
        changeUsers={changeUsers}
        title={title}
      />
      <UserTable 
        rows = {rows}
      />
    </div>
  );
}

export default Leaderboard;