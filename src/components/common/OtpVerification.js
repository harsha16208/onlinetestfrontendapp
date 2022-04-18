import "./styles/OtpVerification.css"
import { Button, Snackbar, TextField } from "@material-ui/core"
import { useEffect, useState } from "react"
import axios from "axios"
import { Alert } from "@mui/material"
import { Redirect } from "react-router-dom";
import { CircularProgress } from '@mui/material';
import OtpTimer from "./OtpTimer"
import { Link } from "react-router-dom"

export default function OtpVerification() {

    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const [otpGenerated, setOtpGenerated] = useState(false)
    const [otp, setOtp] = useState("")
    const [tempOtp, setTempOtp] = useState("")
    const [verified, setVerified] = useState(false)
    const [otpError, setOtpError] = useState(false)



    useEffect(() => {
        if (emailSent && tempOtp === "") {
            axios.post("/generateotp", {
                "email": email
            })
                .then(dt => {
                    setOtpGenerated(true)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        if (otp !== "") {
            axios.post("/verify", {
                "email": email,
                "otp": otp
            })
                .then(dt => {
                    if (dt.status === 200)
                        setVerified(true)
                    else
                        setOtpError(true)
                })
                .catch(err => {
                    console.log(err)
                    setOtpError(true)
                })
        }
    }, [emailSent, otp])

    const handleChange = ({ target }) => {
        setEmail(target.value)
    }

    const handleOtpChange = ({ target }) => {
        setTempOtp(target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        const validationResult = validate(email)
        if (Object.keys(validationResult).length !== 0) {
            setError(validate(email))
        }
        else {
            setError("")
            setEmailSent(true)
        }
    }


    const validate = mail => {
        const errors = {}
        const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (!emailRegex.test(mail)) {
            errors.info = "*Enter a valid mail"
        }
        return errors
    }

    const handleEmailChange = () => {
        setEmailSent(false)
        setOtpGenerated(false)
    }

    const handleTimeUp = () => {
        setEmailSent(false)
        setOtpGenerated(false)
    }

    if (verified) {
        localStorage.setItem("verified", true)
        return <Redirect to={"/register"} />
    }
    return (
        <div className="otpVerificationContainer">
            <div className="otpVerification">
                {otpError ?
                    <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={true}>
                        <Alert severity="error" variant="filled">Invalid otp</Alert>
                    </Snackbar>
                    : null}
                <h1 className="otpVerification_title">Email Verification</h1>
                <p className="otpverification_info">Please Enter your Mail address for verification</p>
                <TextField label="Email" placeholder="Enter email address" value={email} onChange={handleChange} variant={"filled"} />
                {otpGenerated && !otpError ?
                    <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={true}>
                        <Alert severity="success" variant="filled">Otp sent</Alert>
                    </Snackbar>
                    : null}
                {error.info === undefined ? null : <p className="otpVerification_error">{error.info}</p>}
                {otpGenerated ?
                    <div>
                        <p className="otpTimerInfo">*Your otp Expires in</p>
                        <OtpTimer handleTimeUp={handleTimeUp} />
                        <TextField placeholder="Enter otp" label="otp" value={tempOtp} onChange={handleOtpChange} />
                    </div>
                    :
                    emailSent ? <div><CircularProgress color="secondary" /></div> : null}
                <div className="verify_button_container">
                    {
                        otpGenerated ?
                            <button onClick={() => setOtp(tempOtp)} className="verify_button">verify</button> :
                            <button onClick={handleSubmit} className="verify_button">Send</button>
                    }

                </div>
                {
                    otpGenerated ?
                        <div>
                            <p className="otpVerification_info">Want to change email</p>
                            <Button color="secondary" onClick={handleEmailChange}>Change</Button>
                        </div>
                        : null
                }
            <Link to={"/"} className="signInLink"> Already a user? Sign in </Link>
            </div>
        </div>
    )
}