import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { CircularProgress, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import LoginActionCreator from '../../store/actioncreators/LoginAction'

function AuthenticationModal({ isModalOpen, setIsModalOpen, setAuthenticated, message }) {


    const username = useSelector(state => state.userDetails.userDetails.username)
    const [password, setPassword] = useState('')
    const [confirmClicked, setConfirmClicked] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const dispatch = useDispatch()



    const handlePasswordChange = ({ target }) => {
        setPassword(target.value)
    }

    useEffect(() => {
        if (confirmClicked) {
            setError('')
            axios.post('authenticate', {
                "username": username,
                "password": password
            })
                .then(dt => {
                    dispatch(LoginActionCreator(dt.data))
                    setPassword('')
                    setAuthenticated(true)
                    setIsModalOpen(false)
                })
                .catch(err => {
                    if (err.response !== undefined) {
                        if (err.response.status === 406) {
                            console.log(err.response)
                            setError('invalid password')
                        }
                        else {

                            setError('Network Error')
                        }

                    }


                })
            setLoading(false)
            setConfirmClicked(false)
        }

    }, [confirmClicked])

    if (!isModalOpen) {
        return null
    }
    return ReactDOM.createPortal(
        <>
            <div className='ModalOverlay'></div>
            <div className='ModalContainer'>
                <div className='credentialsContainer'>
                    <p className='otpTimerInfo'>{message}</p>
                    <p className='credentialsInfo'>Enter Password for verification and click on confirm</p>
                    <TextField placeholder='Enter password'
                        value={password}
                        onChange={handlePasswordChange}
                        label="Password" variant='standard'
                        type={'password'}
                    />
                    <p className='formErrors'>{error}</p>
                </div>
                <div className='ButtonsContainer'>
                    {
                        loading ?
                            <CircularProgress color='success' />
                            :
                            <>
                                <button className='ModalButton ConfirmButton' onClick={() => { setTimeout(() => setConfirmClicked(true), 2000); setLoading(true) }}>Confirm</button>
                                <button className='ModalButton CloseButton' onClick={() => { setPassword(''); setIsModalOpen(false) }}>close</button>
                            </>

                    }
                </div>
            </div>
        </>
        , document.getElementById('portal'))
}

export default AuthenticationModal
