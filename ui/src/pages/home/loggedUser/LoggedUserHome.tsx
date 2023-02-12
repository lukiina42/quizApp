import {
  Grid,
  Typography,
  TextField,
  Menu,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { NavLink } from "react-router-dom";

import { useAnchor } from "./useAnchor/";
import { Quiz, UserInterface } from "../../../common/types";
import { HashLoader } from "react-spinners";
import { deleteQuiz, loadAllQuizes } from "../../../api/quizApi";
import { useQuery, useQueryClient, useMutation } from "react-query";

interface LoggedUserHomeProps {
  currentUser: UserInterface;
}

//The method used to find quiz by id in current quizzes
const findQuizById = (id: number, quizes: Quiz[]): Quiz => {
  let quizToReturn;
  quizes.forEach((quiz) => {
    if (quiz.id === id) {
      quizToReturn = quiz;
    }
  });
  return quizToReturn;
};

//The home for logged in user. It displays the current user's
//quizzes and enables him to edit, delete or start (Start testing students) them
export default function LoggedUserHome({ currentUser }: LoggedUserHomeProps) {
  const { anchor, open, handleOptionsOpen, handleClose } = useAnchor();

  const queryClient = useQueryClient();

  //Fetches all of the quizzes of current user
  const {
    data: loadedQuizes,
    isLoading,
    error,
  } = useQuery("quizes", () => loadAllQuizes(currentUser.id));

  //Deletes the quiz the user chose to delete by it's id
  const deleteQuizMutation = useMutation(deleteQuiz, {
    onSuccess: () => {
      queryClient.invalidateQueries("quizes");
      handleClose();
    },
  });

  if (error) throw error;

  return (
    <Grid
      container
      direction="row"
      spacing={0}
      sx={{
        height: "calc(100vh - 45px)",
        width: "100%",
      }}
    >
      <Grid
        item
        xs
        sx={{
          backgroundColor: "white",
          height: "100%",
          padding: "40px 0 0 20px",
        }}
      >
        <Grid
          container
          direction="column"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          {isLoading ? (
            <HashLoader
              loading={true}
              size={50}
              color={"#7D93FF"}
              style={{ paddingTop: "20px" }}
            />
          ) : (
            <>
              {loadedQuizes.length === 0 ? (
                <Typography fontWeight={"bold"}>
                  You sadly don't have any created quizzes, create one using the
                  button at the top!
                </Typography>
              ) : (
                <>
                  <Grid item>
                    <Typography fontWeight={"bold"}>Your quizzes:</Typography>
                  </Grid>
                  {loadedQuizes.map((quiz) => (
                    <Grid item key={quiz.id} id={quiz.id?.toString()}>
                      <TextField
                        id="demo-positioned-button"
                        disabled
                        value={quiz.name}
                        aria-controls={
                          open ? "demo-positioned-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={(event) => handleOptionsOpen(event, quiz.id)}
                        size="small"
                        sx={{
                          width: "300px",
                          textTransform: "none",
                          borderRadius: 0,
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SettingsIcon
                                onMouseEnter={(event) =>
                                  (event.currentTarget.style.cursor = "pointer")
                                }
                                onMouseLeave={(event) =>
                                  (event.currentTarget.style.cursor = "default")
                                }
                              />
                            </InputAdornment>
                          ),
                          style: {
                            fontWeight: "bold",
                          },
                        }}
                      />
                      <Menu
                        id="demo-positioned-menu"
                        aria-labelledby="demo-positioned-button"
                        anchorEl={anchor.element}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "center",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "center",
                          horizontal: "left",
                        }}
                      >
                        <MenuItem
                          component={NavLink}
                          to={{
                            pathname: "/quiz",
                            state: findQuizById(anchor.id, loadedQuizes),
                          }}
                          onClick={handleClose}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            deleteQuizMutation.mutate(anchor.id);
                          }}
                        >
                          Delete
                        </MenuItem>
                        <MenuItem
                          component={NavLink}
                          to={{
                            pathname: "/startQuiz",
                            state: findQuizById(anchor.id, loadedQuizes),
                          }}
                          onClick={handleClose}
                        >
                          Start
                        </MenuItem>
                      </Menu>
                    </Grid>
                  ))}
                </>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
