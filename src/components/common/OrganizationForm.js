import { Button, CircularProgress, Snackbar, TextField } from "@material-ui/core";
import { Alert, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

export default function OrganizationForm() {

    localStorage.removeItem("verified")

    const initialValues = { username: "", password: "", password2: "", mobile: "", organizationName: "", orgLink: "" }
    const [formData, setFormData] = useState(initialValues)
    const [errorData, setErrorData] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [registered, setRegistered] = useState(false)
    const [loading, setLoading] = useState(false)
    const [regErrors, setRegErrors] = useState("")


    useEffect(() => {
        if (Object.keys(errorData).length === 0 && isSubmitted) {
            setLoading(true)
            axios.post("/register/organization", formData)
                .then(dt => {
                    setRegistered(true)
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false)
                    setRegErrors("Try again after sometime or Try with a different username or verify your mail")
                    console.log(err)
                })
        }
    }, [errorData])

    const handleChange = ({ target }) => {
        const { name, value } = target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = e => {
        e.preventDefault()
        const result = validate(formData)
        setErrorData(result)
        setIsSubmitted(true)
    }

    const validate = data => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        const passwordRegex = /(?=^.{10,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
        const mobileRegex = /^$|[0-9]{10}/
        const urlRegex = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

        const errors = {}
        if (data.username === "") {
            errors.username = "*Username required"
        }
        else if (!emailRegex.test(data.username)) {
            errors.username = "*username must be a  email"
        }
        if (data.password === "") {
            errors.password = "*password required"
        }
        else if (!passwordRegex.test(data.password)) {
            errors.password = "*password should contain 10 letters with a capital letter, symbol and a digit"
        }
        if (data.password2 === "") {
            errors.password2 = "*Reenter password required"
        }
        else if (data.password !== data.password2) {
            errors.password2 = "*Passwords Doesn't match"
        }
        if (data.mobile === "") {
            errors.mobile = "*mobile number required"
        }
        else if (!mobileRegex.test(data.mobile)) {
            errors.mobile = "*Please enter a valid mobile number"
        }
        if (data.organizationName === "") {
            errors.organizationName = "*Name of the organization required"
        }
        if (!urlRegex.test(data.orgLink)) {
            errors.orgLink = "*The organization link must be a a valid url"
        }

        return errors;
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
                <h2 className="register_title">Register as Organization</h2>
                <Stack component={"form"} spacing={1}>
                    <TextField variant="filled" placeholder="Enter username" label="Username" name="username" value={formData.username} onChange={handleChange} />
                    <p className="formErrors">{errorData.username} </p>
                    <TextField variant="filled" placeholder="Enter password" label="Enter password" type={"password"} name="password" value={formData.password} onChange={handleChange} />
                    <p className="formErrors">{errorData.password} </p>
                    <TextField variant="filled" placeholder="Enter password" label="Re-Enter password" type={"password"} name="password2" value={formData.password2} onChange={handleChange} />
                    <p className="formErrors">{errorData.password2} </p>
                    <TextField variant="filled" placeholder="Enter Mobile number" label="mobile number" name="mobile" value={formData.mobile} onChange={handleChange} />
                    <p className="formErrors">{errorData.mobile} </p>
                    <TextField variant="filled" placeholder="Enter Organization Name" label="Organization name" name="organizationName" value={formData.organizationName} onChange={handleChange} />
                    <p className="formErrors">{errorData.organizationName} </p>
                    <TextField variant="filled" placeholder="Enter Url" label="Organization URL" name="orgLink" value={formData.orgLink} onChange={handleChange} />
                    <p className="formErrors">{errorData.orgLink}</p>
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