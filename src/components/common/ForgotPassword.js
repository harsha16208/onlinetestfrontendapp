import { Alert, AlertTitle, Button, CircularProgress, Snackbar, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import OtpTimer from "./OtpTimer"

function ForgotPassword() {

    const [username, setUsername] = useState('')
    const [submitClicked, setSubmitClicked] = useState(false)
    const [loading, setLoading] = useState(true)
    const [otpReceived, setOtpReceived] = useState(false)
    const [errorData, setErrorData] = useState('')
    const [verifyClicked, setVerifyClicked] = useState(false)
    const [otp, setOtp] = useState('')
    const [notExistingUser, setNotExistingUser] = useState(false)
    const [otpVerificationStatus, setotpVerificationStatus] = useState(null)
    const [newPassword, setNewPassword] = useState('')
    const [newPassword2, setNewPassword2] = useState('')
    const [updateClicked, setUpdateClicked] = useState(false)
    const [passwordErrors, setPasswordErrors] = useState({})
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false)

    useEffect(() => {
        const reloadCount = sessionStorage.getItem('reloadCount');
        if (reloadCount < 2) {
            sessionStorage.setItem('reloadCount', reloadCount + 1);
            window.location.reload();
        } else {
            sessionStorage.removeItem('reloadCount');
        }
    }, [])

    useEffect(() => {
        if (submitClicked && errorData.trim().length === 0) {
            axios.get(`forgotpassword?username=${username}`)
                .then(dt => {
                    setOtpReceived(true)
                    setLoading(false)
                })
                .catch(err => {
                    if (err.response.status === 406) {
                        setNotExistingUser(true)
                        setLoading(false)
                    }
                })
        }

        if (verifyClicked && errorData.trim().length === 0) {
            axios.post("verifyotp", {
                email: username,
                otp: otp
            })
                .then(dt => {
                    const status = dt.data.status
                    setotpVerificationStatus(status)
                    setLoading(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                })
        }

        setSubmitClicked(false)
        setVerifyClicked(false)
    }, [submitClicked, verifyClicked])

    useEffect(() => {
        if (updateClicked && Object.keys(passwordErrors).length === 0) {
            axios.post("resetpassword", {
                username: username,
                password: newPassword
            })
                .then(dt => {
                    setPasswordResetSuccess(true)
                })
                .catch(err => {
                    console.log(err)
                })
        }

        setLoading(false)
        setUpdateClicked(false)
    }, [updateClicked])



    const handleUsernameChange = ({ target }) => {
        setUsername(target.value)
    }

    const handleSubmitClick = () => {
        setErrorData(validate(username, true))
        setLoading(true)
        setTimeout(() => {
            setSubmitClicked(true)
        }, 1000)
    }



    const handleVerifyClicked = () => {
        setErrorData(validate(otp, false))
        setLoading(true)
        setTimeout(() => {
            setVerifyClicked(true)
        }, 1000)

    }

    const handleTimeUp = () => {
        setOtpReceived(false)
    }

    const handleOtpChange = ({ target }) => {
        setOtp(target.value)
    }

    const handleNewPasswodChange = ({ target }) => {
        setNewPassword(target.value)
    }

    const handleNewPasswod2Change = ({ target }) => {
        setNewPassword2(target.value)
    }

    const handleUpdate = () => {
        setPasswordErrors(validatePassword())
        setLoading(true)
        setTimeout(() => setUpdateClicked(true), 1000)

    }


    const validatePassword = () => {
        const errors = {}
        const passwordRegex = /(?=^.{10,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
        if (newPassword.trim().length === 0) {
            errors['newPassword'] = "*required"
        }
        else if (!passwordRegex.test(newPassword)) {
            errors['newPassword'] = "*password should contain 10 letters with a capital letter, symbol and a digit"
        }
        if (newPassword2.trim().length === 0) {
            errors['newPassword2'] = "*required"
        } else if (newPassword !== newPassword2) {
            errors['newPassword2'] = "Passwords Doesn't match"
        }
        return errors;
    }
    const validate = (data, username) => {
        if (data.trim().length === 0) {
            return "*required"
        } else if (username) {
            const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            if (!emailRegex.test(data)) {
                return "*Enter valid mail address"
            }
        }
        return ''
    }

    if (passwordResetSuccess) {
        return (
            <Redirect to={{
                pathname: "/",
                state: {
                    "message": "Password Changed Successfully"
                }
            }} />
        )
    }


    if (otpVerificationStatus === "success") {
        return (
            <div className='PasswordChangeContainer'>
                <div className='PasswordChangeForm'>
                    <p className="otpTimerInfo">Resest Your Password</p>
                    <TextField placeholder="Enter new Password" label="New Password" value={newPassword}
                        variant="filled" type={"password"}
                        onChange={handleNewPasswodChange}
                    />
                    <p className='formErrors'>{passwordErrors.newPassword}</p>
                    <TextField placeholder="Enter new Password" label="New Password" value={newPassword2}
                        variant="filled" type={"password"}
                        onChange={handleNewPasswod2Change} />
                    <p className='formErrors'>{passwordErrors.newPassword2}</p>
                    {loading ? <CircularProgress color='warning' /> :
                        <Button color="warning" variant='contained' onClick={handleUpdate}>Submit</Button>}
                </div>
            </div>)
    }

    if (otpReceived) {
        return (<div className='otpContainer'>
            <Snackbar open={otpVerificationStatus === "invalid otp" || otpVerificationStatus === "expired"}
                autoHideDuration={10000} onClose={() => setotpVerificationStatus(null)}
                anchorOrigin={{ horizontal: "center", vertical: "top" }}>
                <Alert severity='error'>
                    <AlertTitle>Error</AlertTitle>
                    {otpVerificationStatus}
                </Alert>
            </Snackbar>
            <div className='otpForm'>
                <div className="otpInfo">
                    <div>
                        <p className="otpTimerInfo">*Your otp Expires in</p>
                        <OtpTimer handleTimeUp={handleTimeUp} />
                    </div>
                    <TextField variant='filled' style={{ backgroundColor: "#fff" }}
                        placeholder="Enter OTP" label="OTP" value={otp} onChange={handleOtpChange} />
                    {loading ? <CircularProgress color='warning' /> :
                        <Button variant='contained' color='warning' onClick={handleVerifyClicked}>
                            Verify
                        </Button>}

                </div>
            </div>
        </div>)
    }

    return (
        <div className='forgotPasswordContainer'>
            <Snackbar open={notExistingUser} autoHideDuration={10000} onClose={() => setNotExistingUser(false)} anchorOrigin={{ horizontal: "center", vertical: "top" }}>
                <Alert severity='error'>
                    <AlertTitle>Error</AlertTitle>
                    You are not an existing user
                </Alert>
            </Snackbar>

            <div className="forgotPasswordform">
                <p className='otpTimerInfo'>Please Enter Your username and request Otp</p>
                <TextField variant='filled' style={{ backgroundColor: "#fff" }}
                    label="username" placeholder='Enter user name' value={username}
                    onChange={handleUsernameChange} />
                <p className='formErrors'>{errorData}</p>
                {loading ? <CircularProgress color='primary' />
                    : <> <Link to="/">Sign in?</Link>
                        <Button color='primary' variant='contained' onClick={handleSubmitClick}>Submit</Button></>}
            </div>
        </div>
    )
}

export default ForgotPassword
