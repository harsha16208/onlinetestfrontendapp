import { CircularProgress, Snackbar, TextField } from "@material-ui/core";
import { Alert, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

export default function CandidateForm() {

    localStorage.removeItem("verified")

    const form_data = {
        username: "",
        password: "",
        password2: "",
        mobile: "",
        name: "",
        dateOfBirth: ""
    }

    const [data, setData] = useState(form_data)
    const [errors, setErrors] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [registered, setRegistered] = useState(false)
    const [loading, setLoading] = useState(false)
    const [regErrors, setRegErrors] = useState("")

    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSubmitted) {
            setLoading(true)
            axios.post("register/candidate", data)
                .then(dt => {
                    setRegistered(true)
                    setLoading(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                    setRegErrors("Try again after sometime or Try with a different username or verify your mail")
                })
        }
    }, [errors])

    /* Binding form data with state */
    const handleChange = e => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    /* handling submit event */
    const handleSubmit = e => {
        e.preventDefault();
        setErrors(validate(data))
        setIsSubmitted(true)
    }


    /* Validating form data */
    const validate = values => {
        let errors = {}
        const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        const passwordRegex = /(?=^.{10,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
        const mobileRegex = /^$|[0-9]{10}/
        const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
        if (values.username === "") {
            errors.username = "*username required"
        }
        else if (!emailRegex.test(values.username)) {
            errors.username = "*Username must be an email"
        }
        if (values.password === "") {
            errors.password = "*password required"
        }
        else if (!passwordRegex.test(values.password)) {
            errors.password = "*password should contain 10 letters with a capital letter, symbol and a digit"
        }
        if (values.password2 === "") {
            errors.password2 = "*Reenter password required"
        }
        else if (values.password !== values.password2) {
            errors.password2 = "*Passwords Doesn't match"
        }
        if (values.mobile === "") {
            errors.mobile = "*mobile number required"
        }
        else if (!mobileRegex.test(values.mobile)) {
            errors.mobile = "*Please enter a valid mobile number"
        }
        if (values.name === "") {
            errors.name = "*Name required"
        }
        if (values.dateOfBirth === "") {
            errors.dateOfBirth = "*Date of birth required"
        }
        else if (!dateRegex.test(values.dateOfBirth)) {
            errors.dateOfBirth = "*Select a valid date"
        }


        return errors
    }


    if (registered) {
        return <Redirect to={{
            pathname: "/",
            state: {
                "message": "You're registered succsessfully \n login to continue"
            }
        }} />
    }
    return (
        <div className="registrationform_container">
            <Snackbar anchorOrigin={{ "horizontal": "center", "vertical": "top" }} open={regErrors !== "" ? true : false}
                autoHideDuration={10000} onClose={() => setRegErrors("")}
            >
                <Alert variant="filled" severity="error">{regErrors}</Alert>
            </Snackbar>
            <div className="registrationform">
                <h2 className="register_title">Register as Candidate </h2>
                <Stack component={"form"} spacing={1}>
                    <TextField variant="filled" placeholder="Enter username" label="Username" style={{ width: "100%" }} name="username" value={data.username} onChange={handleChange} />
                    <p className="formErrors">{errors.username}</p>
                    <TextField variant="filled" placeholder="Enter password" label="Enter password" type={"password"}
                        name="password" value={data.password} onChange={handleChange} />
                    <p className="formErrors">{errors.password}</p>
                    <TextField variant="filled" placeholder="Enter password" label="Re-Enter password" type={"password"}
                        name="password2" value={data.password2} onChange={handleChange} />
                    <p className="formErrors">{errors.password2}</p>
                    <TextField variant="filled" placeholder="Enter Mobile number" name="mobile" label="mobile number"
                        value={data.mobile} onChange={handleChange} />
                    <p className="formErrors">{errors.mobile}</p>
                    <TextField variant="filled" placeholder="Enter Candidate Name" label="Candidate name" name="name" value={data.name} onChange={handleChange} />
                    <p className="formErrors">{errors.name}</p>
                    <TextField variant="filled" label="Select your Date of birth" type="date" InputLabelProps={{
                        shrink: true
                    }} name="dateOfBirth" value={data.dateOfBirth} onChange={handleChange} />
                    <p className="formErrors">{errors.dateOfBirth}</p>
                    {
                        loading ?
                            <div><CircularProgress color="primary" /></div> :
                            <div className="register_button_container">
                                <button className="register_button" onClick={handleSubmit}>Register</button>
                            </div>
                    }

                </Stack>
            </div>
        </div>
    )
}