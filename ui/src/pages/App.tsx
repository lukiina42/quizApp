import { Route, Switch } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import RegistrationPage from "./registration/RegistrationPage";
import PageNotFound from "./notFound/PageNotFound";
import CreateQuiz from "./quiz/CreateQuiz";
import Header from "../Layout/Header";
import Home from "./home/Home";
import StartQuiz from "./quizSession/teacher/StartQuiz";
import JoinQuiz from "./quizSession/student/JoinQuiz";
import { UserProvider } from "../context/UserContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

//The context is defined here, it is wrapped around all of the used components to be available everywhere.
// Also the routing is defined here
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/registration" component={RegistrationPage} />
            <Route path="/quiz" component={CreateQuiz} />
            <Route path="/startQuiz" component={StartQuiz} />
            <Route path="/joinQuiz" component={JoinQuiz} />
            <Route path="/login" component={LoginPage} />
            <Route component={PageNotFound} />
          </Switch>
        </UserProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </>
  );
}

export default App;
