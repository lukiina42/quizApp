import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

const Home = () => {

  const [quizes, setQuizes] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:8080/betterKahoot/quiz", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      if(response.status === 200){
        return response.json()
      }
    })
    .then((quizes) => {
      setQuizes(quizes);
    })
    .catch(error => console.log(error));
  }, [location])

  return (
    <Grid
      container
      direction="row"
      alignItems="flex-start"
      spacing={0}
      justifyContent="flex-start"
      sx={{ maxHeight:'calc(100vh - 38px)', height:'94vh', width:'100%'}}
    >
      <Grid item xs={2} sx={{backgroundColor: '#E8FFFF', height: '100%'}}>
       
      </Grid>
      <Grid item xs sx={{backgroundColor: 'white', height: '100%', padding: '20px 0 0 20px'}}>
        <Grid 
          container 
          direction="column"
        >
          {quizes.length === 0 ? 
          <Typography>You sadly don't have any created quizzes, create one using the button at the top!</Typography> 
          : 
          <>
          <Grid item>
            <Typography>
              Your quizzes:
            </Typography>
          </Grid>
          {quizes.map((quiz) => 
          <Grid item key={quiz.id}>
            <NavLink
              to={{
                pathname: "/quiz",
                state: quiz // your data array of objects
              }}
            >
              <Typography>
                {quiz.name}
              </Typography>
            </NavLink>
          </Grid>
          )}
          </>
          }
            
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Home;