import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TextField, Grid, Box, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useUserUpdate, UserStatus } from "../../context/UserContext";
import { UserInterface } from "../../common/types";
import { useHistory } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { getEmailExists, registerUser } from "../../api/userApi";
import { useQuery } from "react-query";
import { useMutation } from "react-query";

//custom styling
const useStyles = makeStyles((theme) => ({
  box: {
    //@ts-ignore
    padding: theme.spacing(3),
  },
  error: {
    color: "red",
    margin: 0,
    fontSize: 13,
  },
}));

//The registration form which enables user to register and start creating quizzes
const RegistrationForm = () => {
  const classes = useStyles();

  //history used to move registered user to the home page
  const history = useHistory();

  //when user registers, move him to the home page
  const changeUser = useUserUpdate();

  const [isLoading, setIsLoading] = useState(false);

  //determines which fields were touched
  const touchedInitial = {
    email: false,
    password: false,
    passwordAgain: false,
    lastTouched: "",
  };

  //initial registration data
  const initialData = {
    email: "",
    password: "",
    passwordAgain: "",
  };

  //registration data containing info about user inputs in the form
  const [registrationData, setRegistrationData] = useState(initialData);
  //holds info about which fields were already touched by user
  const [touched, setTouched] = useState(touchedInitial);
  //holds errors
  const [errors, setErrors] = useState(initialData);

  const { data: emailUsed, refetch } = useQuery(
    ["getEmail", { email: registrationData.email }],
    //@ts-ignore
    getEmailExists,
    {
      enabled: registrationData.email !== "",
    }
  );

  const signInMutation = useMutation(registerUser, {
    onSuccess: (responseData) => {
      const loggedUser: UserInterface = {
        id: parseInt(responseData),
        email: registrationData.email,
        status: UserStatus.Logged,
      };
      //@ts-ignore
      changeUser(loggedUser);
      history.push("/");
    },
  });

  //determines whether the string contains capital letter
  function isUpper(str: string) {
    const pattern = new RegExp("^(?=.*[A-Z]).+$");
    return pattern.test(str);
  }

  //Determine wrong inputs of the user and set the errors if necessary
  useEffect(() => {
    let error = "";
    switch (touched.lastTouched) {
      case "email":
        if (touched.email) {
          if (!registrationData.email) {
            error = "Email is required";
          } else if (registrationData.email.length < 3) {
            error = "Email should contain at least 3 characters";
          } else if (!registrationData.email.includes("@")) {
            error = "Email should contain @ symbol";
          } else if (!registrationData.email.includes(".")) {
            error = "Email should contain highest order domain";
          }
          setErrors((currErrors) => {
            return { ...currErrors, email: error };
          });
        }
        break;
      case "password":
        if (touched.password) {
          if (!registrationData.password) {
            error = "Password is required";
          } else if (registrationData.password.length < 5) {
            error = "Password should contain at least 5 characters";
          } else if (!isUpper(registrationData.password)) {
            error = "Password should contain a capital letter";
          }
          setErrors((currErrors) => {
            return { ...currErrors, password: error };
          });
        }
        break;
      case "passwordAgain":
        if (touched.passwordAgain) {
          if (
            registrationData.password.localeCompare(
              registrationData.passwordAgain
            ) !== 0
          ) {
            error = "Passwords must match";
          }
          setErrors((currErrors) => {
            return { ...currErrors, passwordAgain: error };
          });
        }
        break;
      default:
        break;
    }
  }, [registrationData, touched]);

  //handles inputs in the form from the user
  function handleChange(event): void {
    event.persist();
    // To enable submit button
    // Without this user would first have to blur out of the text field to enable submit button
    if (
      event.target.id === "passwordAgain" &&
      event.target.value === registrationData.password
    ) {
      setTouched((cur) => {
        return { ...cur, [event.target.id]: true };
      });
    }
    setRegistrationData((currRegData) => {
      return { ...currRegData, [event.target.id]: event.target.value };
    });
  }

  //handles situation when user leaves current text field
  function handleBlur(event): void {
    event.persist();
    setTouched((cur) => {
      return { ...cur, [event.target.id]: true, lastTouched: event.target.id };
    });
  }

  //handles submit registration data, sends the request to the server, if the request is successful,
  // user is logged in and moved to home page
  function handleSubmit(event): void {
    event.preventDefault();
    const dataToSend = {
      email: registrationData.email,
      password: registrationData.password,
    };
    setIsLoading(true);
    signInMutation.mutate(dataToSend);
  }

  return (
    <Box className={classes.box} maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <Grid
          container
          direction="column"
          alignItems="center"
          spacing={3}
          justifyContent="center"
        >
          <Grid item xs={3}>
            <Typography variant="h4">Registration</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              error={touched.email && (errors.email !== "" || emailUsed)}
              id="email"
              label={
                touched.email && (errors.email !== "" || emailUsed)
                  ? errors.email
                    ? errors.email
                    : "Email is used"
                  : "Email"
              }
              autoFocus
              size="small"
              onChange={(e) => {
                handleChange(e);
                refetch();
              }}
              onBlur={handleBlur}
              value={registrationData.email}
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              error={errors.password !== "" && touched.password}
              id="password"
              label={
                errors.password !== "" && touched.password
                  ? errors.password
                  : "Password"
              }
              size="small"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={registrationData.password}
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              error={errors.passwordAgain !== "" && touched.passwordAgain}
              id="passwordAgain"
              label={
                errors.passwordAgain !== "" && touched.passwordAgain
                  ? errors.passwordAgain
                  : "Password, just to make sure :)"
              }
              size="small"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={registrationData.passwordAgain}
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid item xs={3}>
            {isLoading ? (
              <HashLoader loading={true} size={50} color={"#7D93FF"} />
            ) : (
              <Button
                color="primary"
                variant="contained"
                type="submit"
                disabled={
                  JSON.stringify(errors) !== JSON.stringify(initialData) ||
                  !touched.email ||
                  !touched.password ||
                  !touched.passwordAgain
                }
              >
                Submit
              </Button>
            )}
          </Grid>
          <Grid item xs={3}>
            {!isLoading && <Link to="/login">Already have an account?</Link>}
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default RegistrationForm;
