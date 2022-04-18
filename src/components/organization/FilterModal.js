import { CircularProgress, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'

function FilterModal({ openFilterModal, setOpenFilterModal, setVerified }) {

    const username = useSelector(state => state.userDetails.userDetails.userDetails.username)
    const [password, setPassword] = useState('')
    const [confirmClicked, setConfirmClicked] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (confirmClicked) {
            setLoading(true)
            setError('')
            axios.post('authenticate', {
                "username": username,
                "password": password
            })
                .then(dt => {
                    setPassword('')
                    setVerified(true)
                    setOpenFilterModal(false)
                })
                .catch(err => {
                    if (err.response.status === 406)
                        setError('invalid user')
                    else
                        setError('Network Error')

                })
            setLoading(false)
            setConfirmClicked(false)
        }

    }, [confirmClicked])


    const handlePasswordChange = ({ target }) => {
        setPassword(target.value)
    }


    if (!openFilterModal)
        return null

    return ReactDOM.createPortal(
        <>
            <div className='ModalOverlay'></div>
            <div className='ModalContainer'>
                <div className='credentialsContainer'>
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
                                <button className='ModalButton ConfirmButton' onClick={() => setConfirmClicked(true)}>Confirm</button>
                                <button className='ModalButton CloseButton' onClick={() => setOpenFilterModal(false)}>close</button>
                            </>

                    }
                </div>
            </div>
        </>,
        document.getElementById('portal')
    )
}

export default FilterModal
