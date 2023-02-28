import { Grid, Typography } from "@mui/material";

import { Quiz, UserInterface } from "../../../common/types";
import { HashLoader } from "react-spinners";
import { deleteQuiz, loadAllQuizes } from "../../../api/quizApi";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import QuizList from "./quizList/QuizList";
import { quizChanged } from "../../../redux/features/currentQuizSlice";

interface LoggedUserHomeProps {
  currentUser: UserInterface;
}

//The home for logged in user. It displays the current user's
//quizzes and enables him to edit, delete or start (Start testing students) them
export default function LoggedUserHome({ currentUser }: LoggedUserHomeProps) {
  const dispatch = useDispatch();

  const history = useHistory();

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
    },
  });

  const handleDeleteQuiz = (id: number) => {
    deleteQuizMutation.mutate(id);
  };

  const handleDispatchQuizChange = (quiz: Quiz) => {
    dispatch(quizChanged(quiz));
    history.push("/quiz", { name: quiz.name });
  };

  if (error) throw error;

  return (
    <Grid
      container
      direction="row"
      spacing={0}
      sx={{
        height: "calc(100vh - 3.5rem)",
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
                  <QuizList
                    handleDeleteQuiz={handleDeleteQuiz}
                    quizes={loadedQuizes}
                    handleQuizChange={handleDispatchQuizChange}
                  />
                </>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
