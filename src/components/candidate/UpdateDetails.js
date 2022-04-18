import { Alert, AlertTitle, Button, CircularProgress, Snackbar, Stack, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import EditModal from './EditModal'
import { useDispatch } from "react-redux"
import LoginActionCreator from '../../store/actioncreators/LoginAction'

function UpdateDetails({ setEditRequest }) {
        const userDetails = useSelector(state => state.userDetails.userDetails.userDetails)
        const test = useSelector(state => state.userDetails.userDetails)
        const initialDetails = {
            username: userDetails.username, name: userDetails.name, candidateId: userDetails.candidateId,
            dateOfBirth: userDetails.dateOfBirth.split('T')[0], mobile: userDetails.mobile
        }
        const [updationDetails, setUpdationDetails] = useState(initialDetails)
        const [saveClicked, setSaveClicked] = useState(false)
        const [loading, setLoading] = useState(false)
        const [success, setSuccess] = useState(null)
        const [errors, setErrors] = useState({})
        const [isModalOpen, setIsModalOpen] = useState(false)
        const [verified, setVerified] = useState(false)
        const dispatch = useDispatch()

        useEffect(() => {
            if (saveClicked && Object.keys(errors).length === 0 && verified) {
                setLoading(true)

                const token = localStorage.getItem('jwtToken')
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

                axios.post('update', updationDetails, config)
                    .then(dt => {
                        setLoading(false)
                        setSuccess(true)
                        Object.assign(userDetails, updationDetails)
                        dispatch(LoginActionCreator(Object.assign(test, updationDetails)))
                    })
                    .catch(err => {
                        setLoading(false)
                        setSuccess(false)
                    })

                setSaveClicked(false)
                setVerified(false)

            }
        }, [verified])


        const handleChange = ({ target }) => {
            const { name, value } = target
            setUpdationDetails({
                ...updationDetails,
                [name]: value
            })
        }

        const handleClick = () => {
            const result = validate(updationDetails)
            if (Object.keys(result).length !== 0) {
                setErrors(result)
            } else {
                setErrors('')
                setSaveClicked(true)
                setIsModalOpen(true)


            }
        }

        const validate = (details) => {
            const errorData = {}
            const mobileRegex = /^[6-9]\d{9}$/
            if (!mobileRegex.test(details.mobile)) {
                errorData['mobile'] = '*should have only numbers'
            }

            if (details.dateOfBirth === '') {
                setUpdationDetails({
                    ...updationDetails,
                    ['dateOfBirth']: initialDetails.dateOfBirth
                })
            }

            if (details.name === '') {
                setUpdationDetails({
                    ...updationDetails,
                    ['name']: initialDetails.name
                })
            }

            if (details.mobile === '') {
                setUpdationDetails({
                    ...updationDetails({
                        ...updationDetails,
                        ['mobile']: initialDetails.mobile
                    })
                })
            }

            return errorData
        }

        return (
            <div className='updateDetailsContainer'>
                <EditModal setVerified={setVerified}
                    isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
                <div>
                    <button className='backButton-UpdateDetails'
                        onClick={() => setEditRequest(false)}
                    > {'<<--'}Go Back</button>
                </div>
                <Snackbar open={success === true} anchorOrigin={{ horizontal: "center", vertical: "top" }} autoHideDuration={10000}
                    onClose={() => setSuccess(null)} >
                    <Alert variant='filled' color='success'>
                        <AlertTitle>Success</AlertTitle>
                        Details Updated Successfully
                    </Alert>
                </Snackbar>
                <Snackbar open={success === false} anchorOrigin={{ horizontal: "center", vertical: "top" }} autoHideDuration={10000}
                    onClose={() => setSuccess(null)} >
                    <Alert variant='filled' color='error'>
                        <AlertTitle>Error</AlertTitle>
                        Details Updation Failed
                    </Alert>
                </Snackbar>
                <h2>Update Details Here</h2>
                <div className='updateDetailsForm'>
                    <Stack spacing={2}>
                        <TextField value={updationDetails.dateOfBirth} label="Date of Birth"
                            onChange={handleChange} name="dateOfBirth"
                            type={'date'} />
                        <TextField value={updationDetails.name} label="Name"
                            onChange={handleChange} name="name" />
                        <TextField value={updationDetails.mobile} label="Mobile"
                            onChange={handleChange} name="mobile" />
                        <p className='formErrors'>{errors['mobile']}</p>
                        {loading ?
                            <CircularProgress color='success' />
                            : <Button color="success" variant='contained'
                                style={{ width: "20%" }}
                                onClick={handleClick}
                            >Save</Button>}
                    </Stack>
                </div>
            </div>
        )
    }

export default UpdateDetails
