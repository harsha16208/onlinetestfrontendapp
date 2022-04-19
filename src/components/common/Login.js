import { useState } from "react"
import { TextField } from "@material-ui/core";
import { Alert, AlertTitle } from "@mui/material";
import { Snackbar } from "@material-ui/core";
import axios from "axios";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoginActionCreator from "../../store/actioncreators/LoginAction";
import { useEffect } from "react";
import { CircularProgress } from "@mui/material";

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
    const [loginClicked, setLoginClicked] = useState(false)

    document.title = "Login page"


    useEffect(() => {
        if (loginClicked && errors.trim().length === 0) {
            axios.post("/authenticate", {
                "username": username,
                "password": password
            })
                .then(dt => {
                    console.log(dt)
                    //store user details in store --> completed
                    dispatch(LoginActionCreator(dt.data))
                    //store user role in state
                    const data = dt.data;
                    const jwtToken = data["jwtToken"]
                    localStorage.setItem("jwtToken", jwtToken)
                    setLogin({ role: dt.data.role })
                    setLoginClicked(false)
                    setLoading(false)
                })
                .catch(error => {
                    setInvalidCredentials(true)
                    setLoginClicked(false)
                    setLoading(false)
                })
        }

    }, [loginClicked, errors])

    const validate = () => {

        let errorMessage = ""

        if (username === "" && password === "") {
            errorMessage = "Username and password required"

        }
        else {
            if (username === "") {
                errorMessage = "Username required"
            }

            if (password === "") {
                errorMessage = "Password required"
            }
        }

        return errorMessage;

    }

    const handleLogin = () => {
        const result = validate()
        if (result.trim().length === 0) {
            setErrors("")
            setLoading(true)
            setTimeout(() => {
                setLoginClicked(true)
            }, 1000)

        } else {
            setErrors(result)
            setLoading(false)
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
                    {
                        loading ?
                            <CircularProgress color="secondary" /> :
                            <div className="login_button_container">
                                <button type="button" onClick={handleLogin} className="login_button">Login</button>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}