import { useState } from "react"
import "./styles/Login.css"
import { TextField } from "@material-ui/core";
import { Alert, AlertTitle } from "@mui/material";
import { Snackbar } from "@material-ui/core";
import axios from "axios";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoginActionCreator from "../../store/actioncreators/LoginAction";

export default function Login(props) {

    const dispatch = useDispatch()

    let message = null
    if (props.location.state !== undefined) {
        message = props.location.state.message
    }
    window.history.replaceState({}, '')
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [invalidCredentials, setInvalidCredentials] = useState(false)
    const [login, setLogin] = useState({})
    const [loading, setLoading] = useState(false)


    useEffect(()=>{
        
    })

    const validate = () => {
        if (username === "" && password === "") {
            setErrors("Username and Password required")

        }
        else {
            if (username === "") {
                setErrors("Username required")
            }

            if (password === "") {
                setErrors("Password required")
            }
        }
        if (username !== "" && password !== "") {
            setErrors("")
            axios.post("/authenticate", {
                "username": username,
                "password": password
            })
                .then(dt => {
                    //store user details in store --> completed
                    dispatch(LoginActionCreator(dt.data))
                    //store user role in state
                    const data = dt.data;
                    const jwtToken = data["jwtToken"]
                    localStorage.setItem("jwtToken", jwtToken)
                    setLogin({ role: dt.data.role })
                })
                .catch(error => {
                    setInvalidCredentials(true)
                })
        }
    }

    if (Object.keys(login).length !== 0) {
        if (login.role === "ORG") {
            return <Redirect to={"/home"} />
        }
        else if (login.role === "CANDIDATE") {
            return <Redirect to={"/candidate/home"} />
        }
        else if (login.role === "ADMIN") {
            return <Redirect to={"/adminpanel"} />
        }

    }
    return (
        <div className="login">
            <Snackbar open={message !== null && !openSnackbar} anchorOrigin={{ "vertical": "top", "horizontal": "center" }}
                autoHideDuration={10000} onClose={() => setOpenSnackbar(true)}
            >
                <Alert severity="success" variant="filled">{message}</Alert>
            </Snackbar>
            <div className="login_card">
                <Snackbar open={invalidCredentials} anchorOrigin={{
                    "vertical": "top",
                    "horizontal": "center"
                }}
                    autoHideDuration={1000}
                    onClose={() => setInvalidCredentials(false)}
                >
                    <Alert variant="filled" severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Invalid username and password
                    </Alert>
                </Snackbar>
                <h1 className="login_title">Login Here</h1>
                <div className="errors">
                    {errors !== "" ? <Alert severity="error">{errors}</Alert> : null}
                </div>
                <div className="login_part">
                    <div className="username">
                        {errors !== "" ?
                            <TextField color="secondary" placeholder="Enter user name" label="Username" onChange={e => setUsername(e.target.value)} />
                            : <TextField placeholder="Enter user name" label="Username" onChange={e => setUsername(e.target.value)} />
                        }
                    </div>
                    <div className="password">
                        {
                            errors !== "" ?
                                <TextField color="secondary" placeholder="Enter password" label="Password" type="password" onChange={e => setPassword(e.target.value)} /> :
                                <TextField placeholder="Enter password" label="Password" type="password" onChange={e => setPassword(e.target.value)} />
                        }
                    </div>
                    <div className="options">
                        <span><Link to="/forgotpassword">Forgot password?</Link></span>
                        <span><Link to={"/register"}>Register</Link></span>
                    </div>
                    <div className="login_button_container">
                        <button type="button" onClick={validate} className="login_button">Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}