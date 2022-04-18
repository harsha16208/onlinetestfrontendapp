import { CircularProgress, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'

function PasswordModal({ isModalOpen, setIsModalOpen }) {
    const username = useSelector(state => state.userDetails.userDetails.userDetails.username)
    const [password, setPassword] = useState('')
    const [confirmClicked, setConfirmClicked] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [verified, setVerified] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [newPassword2, setNewPassword2] = useState('')
    const [errorData, setErrorData] = useState({})
    const [changeClicked, setChangeClicked] = useState(false)
    const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false)

    const handlePasswordChange = ({ target }) => {
        setPassword(target.value)
    }

    const handleNewPasswordChange = ({ target }) => {
        setNewPassword(target.value)
    }

    const handleNewPassword2Change = ({ target }) => {
        setNewPassword2(target.value)
    }

    const handlePasswordUpdate = () => {
        const result = validate()
        if (Object.keys(result).length === 0){
            setChangeClicked(true)
            setErrorData({})
        } else {
            setErrorData(result)
        }
        
    }

    const validate = () => {
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

        if (password === newPassword) {
            errors['newPassword'] = "You are using the previous password. Please try a new password"
        }

        return errors;
    }

    useEffect(() => {
        if (confirmClicked) {
            setLoading(true)
            setError('')
            axios.post('authenticate', {
                "username": username,
                "password": password
            })
                .then(dt => {
                    setVerified(true)
                })
                .catch(err => {
                    if (err.response.status === 406)
                        setError('invalid password')
                    else
                        setError('Network Error')

                })
            setLoading(false)
            setConfirmClicked(false)
        }

    }, [confirmClicked])

    useEffect(() => {
        if (Object.keys(errorData).length === 0 && changeClicked) {
            setChangeClicked(false)
            setLoading(true)
            const token = localStorage.getItem("jwtToken")
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

            axios.post('changePassword', {
                username: username,
                password: newPassword
            }, config)
                .then(dt => {
                    setLoading(false)
                    setPasswordChangeSuccess(true)
                    clear()
                    setTimeout(() => {
                        setPasswordChangeSuccess(false)
                        setIsModalOpen(false)
                    }, 3000)
                })
                .catch(err => {
                    setLoading(false)
                })
        }
    }, [changeClicked])

    const clear = () =>{
        setVerified(false)
        setNewPassword('')
        setNewPassword2('')
        setPassword('')
    }

    const handleClose = () => {
        clear()
        setIsModalOpen(false)
    }

    if (!isModalOpen) {
        return null
    }
    return ReactDOM.createPortal(
        <>
            <div className='ModalOverlay'></div>
            <div className='ModalContainer'>
                {
                    passwordChangeSuccess ?
                        <><h3 style={{ color: "green" }}> Successfully Updated Your Password</h3></>
                        :
                        !verified ? <div className='credentialsContainer'>
                            <p className='credentialsInfo'>Enter Your current Password</p>
                            <TextField placeholder='Enter Your current password'
                                value={password}
                                onChange={handlePasswordChange}
                                label="Current Password" variant='standard'
                                type={'password'}
                            />
                            <p className='formErrors'>{error}</p>
                        </div> : <div className='passwordUpdationContainer'>
                            <p className='credentialsInfo'>Enter Your New Password</p>
                            <TextField placeholder='Enter your New password'
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                label="New Password" variant='standard'
                                type={'password'}
                            />
                            <p className='formErrors'>{errorData.newPassword}</p>
                            <TextField placeholder='Re-Enter your new password'
                                value={newPassword2}
                                onChange={handleNewPassword2Change}
                                label="Re-Enter New Password" variant='standard'
                                type={'password'}
                            />
                            <p className='formErrors'>{errorData.newPassword2}</p>
                        </div>}
                <div className='ButtonsContainer'>
                    {
                        loading ?
                            <CircularProgress color='success' />
                            :
                            <>
                                {
                                    verified ?
                                        <button className='ModalButton ConfirmButton' onClick={handlePasswordUpdate}>Change</button> :
                                        passwordChangeSuccess ? null :
                                            <button className='ModalButton ConfirmButton' onClick={() => setConfirmClicked(true)}>Confirm</button>
                                }
                                <button className='ModalButton CloseButton' onClick={handleClose}>close</button>
                            </>

                    }
                </div>
            </div></>
        , document.getElementById('portal'))
} export default PasswordModal
