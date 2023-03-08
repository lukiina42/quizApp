import React from "react";
import { Route, Switch } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import RegistrationPage from "../pages/registration/RegistrationPage";
import PageNotFound from "../pages/notFound/PageNotFound";
import CreateQuiz from "../pages/quiz/CreateQuiz";
import Home from "../pages/home/Home";
import StartQuiz from "../pages/quizSession/teacher/StartQuiz";
import JoinQuiz from "../pages/quizSession/student/JoinQuiz";
import ProtectedRoute from "./ProtectedRoute";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <ProtectedRoute path="/startQuiz" component={StartQuiz} />
      <ProtectedRoute path="/quiz" component={CreateQuiz} />
      <Route path="/login" component={LoginPage} />
      <Route path="/registration" component={RegistrationPage} />
      <Route path="/joinQuiz" component={JoinQuiz} />
      <Route component={PageNotFound} />
    </Switch>
  );
}
