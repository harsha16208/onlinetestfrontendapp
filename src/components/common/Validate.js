import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom"
import Login from "./Login";
import Register from "./Register";
import OtpVerification from "./OtpVerification"
import Organization from "../organization/Organization";
import FilterCandidates from "../organization/FilterCandidates";
import Home from "../organization/Home";
import CreateExam from "../organization/CreateExam"
import TriggerMails from "../organization/TriggerMails"
import ExamLinks from "../organization/ExamLinks"
import PostQuestionsStatus from "../organization/PostQuestionsStatus";
import Candidate from "../candidate/Candidate"
import CandidateHome from "../candidate/Home";
import ExamsApplied from "../candidate/ExamsApplied"
import CandidateResults from "../candidate/Results"
import MyExams from "../candidate/MyExams"
import ApplyForExam from "../candidate/ApplyForExam";
import { useSelector } from "react-redux";
import ExamHome from "../exam/ExamHome";
import Exam from "../exam/Exam"
import ForgotPassword from "./ForgotPassword";
import AdminPanel from "../Admin/AdminPanel";

export default function Validate() {
    const url = useLocation().pathname
    const history = useHistory()
    const state = useSelector(state => state)

    if (url === "/home") {
        if (localStorage.getItem("jwtToken") === null) {
            return <Redirect to={"/"} />
        }
        return <Route><Organization component={<Home />} /></Route>
    }

    if (url === "/adminpanel") {
        if (localStorage.getItem("jwtToken") === null) {
            return <Redirect to={"/"} />
        }
        return <Route component={AdminPanel}/>
    }

    if (url === "/candidate/home") {
        if (localStorage.getItem("jwtToken") === null) {
            return <Redirect to={"/"} />
        }

        return <Route><Candidate component={<CandidateHome />} /></Route>
    }

    if (url === "/forgotpassword") {
        if (localStorage.getItem("jwtToken") === null) {
            return <Route component={ForgotPassword} />
        }
        history.goBack()
        return null
    }

    if (url === "/") {

        if (localStorage.getItem("jwtToken") !== null) {
            const role = state.userDetails.userDetails.role
            if (role === "ORG")
                return <Redirect to={"/home"} />
            else if (role === "CANDIDATE")
                return <Redirect to={"/candidate/home"} />
        }
        return <Route component={Login} />
    }

    if (url === "/register") {
        if (localStorage.getItem("jwtToken") !== null) {
            history.goBack()
            return null;
        }
        else if (localStorage.getItem("verified") !== null) {
            return <Route component={Register} />
        }
        else {
            return <Route component={OtpVerification} />
        }
    }

    if (url === "/filtercandidates") {
        if (localStorage.getItem("jwtToken") !== null) {
            return <Route><Organization component={<FilterCandidates />} /></Route>
        }
        else {
            return <Redirect to={'/'} />
        }
    }

    if (url === "/createexam") {
        if (localStorage.getItem("jwtToken") !== null) {
            return <Route><Organization component={<CreateExam />} /></Route>
        }
        else {
            return <Redirect to={'/'} />
        }
    }


    if (url === "/triggeremail") {
        if (localStorage.getItem("jwtToken") !== null) {
            return <Route><Organization component={<TriggerMails />} /></Route>
        }
        else {
            return <Redirect to={'/'} />
        }
    }

    if (url === "/examlinks") {
        if (localStorage.getItem("jwtToken") !== null) {
            return <Route><Organization component={<ExamLinks />} /></Route>
        }
        else {
            return <Redirect to={'/'} />
        }
    }

    if (url === "/postquestions") {
        if (localStorage.getItem("jwtToken") !== null) {
            return <Route><Organization component={<PostQuestionsStatus />} /></Route>
        }
        else {
            return <Redirect to={'/'} />
        }
    }

    if (url === "/examsapplied") {
        if (localStorage.getItem("jwtToken") !== null) {
            return <Route><Candidate component={<ExamsApplied />} /></Route>
        }
        else {
            return <Redirect to={'/'} />
        }
    }

    if (url === "/candidateresults") {
        if (localStorage.getItem("jwtToken") !== null) {
            return <Route><Candidate component={<CandidateResults />} /></Route>
        }
        else {
            return <Redirect to={'/'} />
        }
    }

    if (url === "/myexams") {
        if (localStorage.getItem("jwtToken") !== null) {
            return <Route><Candidate component={<MyExams />} /></Route>
        }
        else {
            return <Redirect to={'/'} />
        }
    }

    if (url === "/applyforexam") {
        if (localStorage.getItem("jwtToken") !== null) {
            return <Route><Candidate component={<ApplyForExam />} /></Route>
        }
        else {
            return <Redirect to={'/'} />
        }
    }

    if (url === "/examhome") {
        if (localStorage.getItem("jwtToken") !== null) {
            return <Route render={props => <ExamHome {...props}/>} />
        }
        else {
            return <Redirect to={'/'} />
        }
    }

    if (url === "/exam") {
        if (localStorage.getItem("jwtToken") !== null) {
            if (localStorage.getItem("examAccess") !== null) {
                return <Route render={props => <Exam {...props}/>} />
            }
                return <Redirect to={'/'} />
        }
        else {
            return <Redirect to={'/'} />
        }
    }

}
