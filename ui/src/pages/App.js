import { Route, Switch } from 'react-router-dom';
import LoginPage from './login/LoginPage';
import RegistrationPage from './registration/RegistrationPage';
import PageNotFound from './notFound/PageNotFound'
import CreateQuiz from './quiz/CreateQuiz'
import Header from '../Layout/Header';
import Home from './home/Home';

function App() {
  return (
    <>
    <Header />
      <Switch>
        <Route exact path='/' component={LoginPage} />
        <Route path='/registration' component={RegistrationPage} />
        <Route path='/quiz' component={CreateQuiz} />
        <Route path='/home' component={Home}/>
        <Route component={PageNotFound} />
      </Switch>
    </>
  );
}

export default App;
