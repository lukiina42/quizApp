import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser, UserStatus } from "../../context/UserContext";
import { UserInterface } from "../../common/types";
import LoggedUserHome from "./loggedUser/LoggedUserHome";
import GuestHome from "./guest/GuestHome";
import { Quiz } from "../../common/types";

export interface AnchorType {
  element: Element | null;
  id: number;
}

//Home component, decides whether guest home or home for logged in user should be displayed and holds states
const Home = () => {
  //The quizzes of logged in user, initialized to empty array and the is fetched from the server
  const [quizes, setQuizes] = useState<Array<Quiz>>([]);

  const [isLoading, setIsLoading] = useState(false)

  //Current user from context
  const currentUser: UserInterface = useUser();

  //The current location of the user
  const location = useLocation();

  //The method used to find quiz by id in current quizzes
  const findQuizById = (id: number): Quiz => {
    let quizToReturn;
    quizes.forEach((quiz) => {
      if (quiz.id === id) {
        quizToReturn = quiz;
      }
    });
    return quizToReturn;
  };

  //Anchor state, holds the DOM element where the popover should be
  //displayed and id (key) of the quiz about which the popover displays possibilities
  const anchorInitial: AnchorType = {
    element: null,
    id: 0,
  };
  const [anchorEl, setAnchorEl] = React.useState<AnchorType>(anchorInitial);
  const open = Boolean(anchorEl.element);

  //Opens options about clicked quiz
  const handleOptionsOpen = (event, idToSet: number) => {
    setAnchorEl({
      element: event.currentTarget,
      id: idToSet,
    });
  };

  //Closes options
  const handleClose = () => {
    setAnchorEl(anchorInitial);
  };

  //Fetches all of the quizzes of current user
  const fetchAllQuizzes = (id: number) => {
    setIsLoading(true)
    fetch("http://localhost:8080/betterKahoot/quiz/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Something went wrong :(");
        }
        return response.json();
      })
      .then((quizes) => {
        setQuizes(quizes);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  //Deletes the quiz the user chose to delete by it's id
  const handleDeleteQuiz = () => {
    fetch("http://localhost:8080/betterKahoot/quiz/" + anchorEl.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 204) {
          handleClose();
          fetchAllQuizzes(currentUser.id);
        }
      })
      .catch((error) => console.log(error));
  };

  //At the start or when current user changes, decide whether to fetch all quizzes
  useEffect(() => {
    if (currentUser.status !== UserStatus.Logged) {
      return;
    }
    fetchAllQuizzes(currentUser.id);
  }, [location, currentUser]);

  return (
    <>
      {currentUser.status === UserStatus.Logged ? (
        <LoggedUserHome
          quizes={quizes}
          anchorEl={anchorEl}
          handleClose={handleClose}
          findQuizById={findQuizById}
          handleDeleteQuiz={handleDeleteQuiz}
          open={open}
          handleOptionsOpen={handleOptionsOpen}
          isLoading={isLoading}
        />
      ) : (
        <GuestHome />
      )}
    </>
  );
};

export default Home;
