import { Grid, Button, Popover, TextField, Typography } from "@mui/material";
import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useRef, useState } from 'react';

export default function Header(props) {
  const location = useLocation();
  const history = useHistory();
  const quizName = useRef(null);

  //state used to define where the popover, which contains the new question type options, should get displayed (around which tag)
  const [anchorEl, setAnchorEl] = useState(null);

  //derived states
  //open says whether the popover is displayed or not
  let open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handlePopoverChange = (event) => {
    open = !open
    if(open){
      setAnchorEl(event.currentTarget);
    } else{
      setAnchorEl(null)
    }
  };

  const handlePopoverClose = () => setAnchorEl(null);

  const handleCreateClick = () => {
    history.push('/quiz', {name: quizName.current.value})
    handlePopoverClose()
  }

  return (
    <>
      <header>
        <Grid
          container
          direction="row"
          spacing={0}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            height:'6vh',
            minHeight:38,
            borderBottom:1
          }}
          
        >
          {/* 
            <Link to="/">
              <img alt="Carved Rock Fitness" src="/images/logo.png" />
            </Link>
           */}
          <Grid item  sx={{paddingLeft:2}}>
          </Grid>
          <Grid item>
            {location.pathname === '/home' &&
            <Button 
              color="primary" 
              variant="contained" 
              size="small"
              onClick={handlePopoverChange}
              sx={{textTransform: 'none'}}
            >
              Create new quiz
            </Button>
            }
            {location.pathname === '/quiz' &&
            <Typography sx={{fontWeight: 'bold'}}>
              Currently creating/updating quiz: {history.location.state.name}
            </Typography>
            }
          </Grid>
          <Grid item sx={{paddingRight:2}}>
            {/* <NavLink activeStyle={activeStyle} to="/">
              Logout
            </NavLink> */}
          </Grid>
            
        </Grid>
    </header>
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose= {handlePopoverClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
    <Grid
      container
      alignItems="center"
      spacing={1}
      justifyContent="flex-start"
      sx={{padding:2, width: 300}}
    >
      <Grid item xs={12}>
        <TextField
          id="theQuestion"
          size='small'
          inputProps={{min: 0, style: { textAlign: 'center' }}}
          placeholder="Name of quiz"
          autoComplete="new-password"
          fullWidth
          inputRef={quizName}
        />
      </Grid>
      <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
        <Button 
          color="secondary" 
          variant="contained" 
          sx={{textTransform: 'none'}}
          onClick = {handleCreateClick}
        >
          Create
        </Button>
      </Grid>
    </Grid>
  </Popover>
  </>
  );
}