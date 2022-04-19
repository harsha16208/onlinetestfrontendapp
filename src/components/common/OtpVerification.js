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
    const [otpError, setOtpError] = useState("")
    const [loading, setLoading] = useState(false)
    const [verifyClicked, setVerifyClicked] = useState(false)
    const [errorData, setErrorData] = useState("")


    useEffect(() => {
        if (emailSent && tempOtp === "") {
            axios.post("/generateotp", {
                "email": email
            })
                .then(dt => {
                    setOtpGenerated(true)
                    setLoading(false)
                })
                .catch(err => {
                    setLoading(false)
                })
        }
        if (otp !== "") {
            axios.post("/verify", {
                "email": email,
                "otp": otp
            })
                .then(dt => {
                    if (dt.status === 200) {
                        setVerified(true)
                    }
                    else {
                        setOtpError(dt.data.message)
                    }
                    setLoading(false)
                    setVerifyClicked(false)
                })
                .catch(err => {
                    setOtpError("Network Error")
                    setLoading(false)
                })
        }
    }, [emailSent, otp, verifyClicked])

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
            setLoading(true)
            setTimeout(() => {
                setError("")
                setEmailSent(true)
            }, 500)
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
        setTempOtp("")
        setEmail("")
    }

    const handleTimeUp = () => {
        setEmailSent(false)
        setOtpGenerated(false)
    }

    const handleVerify = () => {
        const result = validateOtp()
        console.log(result)
        if (!result) {
            setErrorData("*required")
            return
        }
        setErrorData("")
        setLoading(true)
        setTimeout(() => {
            setOtp(tempOtp)
            setVerifyClicked(true)
        }, 1000)

    }

    const validateOtp = () => {
        if (tempOtp === "") {
            return false
        }
        return true
    }

    if (verified) {
        localStorage.setItem("verified", true)
        return <Redirect to={"/register"} />
    }
    return (
        <div className="otpVerificationContainer">
            <div className="otpVerification">
                <Snackbar anchorOrigin={{ vertical: "top", horizontal: "center" }} open={otpError.trim().length !== 0}
                    autoHideDuration={10000} onClose={() => setOtpError("")}
                >
                    <Alert severity="error" variant="filled">{otpError}</Alert>
                </Snackbar>
                <h1 className="otpVerification_title">Email Verification</h1>
                <div><p className="otpverification_info">Enter your Mail address for verification</p></div>
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
                        <p className="formErrors">{errorData}</p>
                        <div className="verify_button_container"> {loading ? <CircularProgress color="secondary" /> : <button onClick={handleVerify} className="verify_button">verify</button>}</div>
                    </div>
                    :
                    loading ? <CircularProgress color="secondary" /> : <button onClick={handleSubmit} className="verify_button">Send</button>

                }
                {
                    otpGenerated ?
                        <div>
                            <Button color="secondary" style={{ padding: "10px" }}
                                onClick={handleEmailChange}>Change Email</Button>
                        </div>
                        : null
                }
                <div className="ExistingUserSignin"><Link to={"/"} className="signInLink"> Already a user? Sign in </Link></div>
            </div>
        </div>
    )
}