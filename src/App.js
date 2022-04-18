import {Switch, Route, BrowserRouter} from "react-router-dom";
import Logout from './components/common/Logout';
import Validate from './components/common/Validate';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Validate path={"/"} exact></Validate>
          <Validate path={"/home"}></Validate>
          <Validate path={"/register"}></Validate>
          <Validate path={"/filtercandidates"}></Validate>
          <Validate path={"/createExam"}></Validate>
          <Validate path={"/triggeremail"}></Validate>
          <Validate path={"/examlinks"}></Validate>
          <Validate path={"/postquestions"}></Validate>
          <Validate path={"/candidate/home"}></Validate>
          <Validate path={"/examsapplied"}></Validate>
          <Validate path={"/candidateresults"}></Validate>
          <Validate path={"/myexams"}></Validate>
          <Validate path={"/applyforexam"}></Validate>
          <Validate path={"/examhome"}></Validate>
          <Validate path={"/exam"}></Validate>
          <Validate path={"/forgotpassword"}></Validate>
          <Validate path={"/adminpanel"}></Validate>
          <Route path={'/logout'} component={Logout} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
