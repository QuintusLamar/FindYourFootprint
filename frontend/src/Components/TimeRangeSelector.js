import { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

function TimeRangeSelector({changeTime}) {
  const [title, setTitle] = useState("Leaders in Carbon Output All Time");


  // Make sure this changes which button looks selected on the screen
  function changeSelection(event) {
    setTitle("Leaders in Carbon Output " + event.currentTarget.value);
    changeTime(event.currentTarget.value);
  }

  return (
    <div>
      <ButtonGroup sx={{width:"100%"}}>
        <Button sx={{width:"25%"}} onClick={changeSelection} value="All Time"> All Time </Button>
        <Button sx={{width:"25%"}} onClick={changeSelection} value="This Year"> This Year </Button>
        <Button sx={{width:"25%"}} onClick={changeSelection} value="This Month"> This Month </Button>
        <Button sx={{width:"25%"}} onClick={changeSelection} value="This Week"> This Week </Button>
      </ButtonGroup>
    </div>
  )
}

export default TimeRangeSelector;