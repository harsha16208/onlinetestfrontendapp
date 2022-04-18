import { Alert, AlertTitle, Button, CircularProgress, Snackbar, TextField } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

function MailContainer({ examId, setExamId }) {
    const [content, setContent] = useState({ subject: '', body: '' })
    const [sendClicked, setSendClicked] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(null)
    const [errorData, setErrorData] = useState({ body: false, body: false })

    useEffect(() => {
        if (sendClicked && errorData.body === false && errorData.body === false) {
            setLoading(true)

            const token = localStorage.getItem('jwtToken')

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

            axios.post(`trigger/${examId}`, content, config)
                .then(dt => {
                    console.log(dt)
                    setLoading(false)
                    setSuccess(true)
                    setContent({
                        body: '',
                        subject: ''
                    })
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                    setSuccess(false)
                })
            setSendClicked(false)
        }
    }, [sendClicked])

    const handleSendMail = e => {
        e.preventDefault()
        const result = validate(content)
        if (result)
            setSendClicked(true)
    }

    const validate = contentData => {
        if ((contentData.subject === '' || contentData.subject.trim().length === 0) &&
            (contentData.body === '' || contentData.body.trim().length === 0)) {
            setErrorData({
                body: true,
                subject: true
            })

            return false;
        } else {
            if (contentData.subject === '' || contentData.subject.trim().length === 0) {
                setErrorData({
                    body: false,
                    subject: true
                })
                console.log("here")
                return false;

            } else {
                setErrorData({
                    body: false,
                    subject: false
                })
            }

            if (contentData.body === '' || contentData.body.trim().length === 0) {
                setErrorData({
                    body: true,
                    subject: false
                })
                console.log("there")
                return false;
            } else {
                setErrorData({
                    body: false,
                    subject: false
                })
            }

        }
        return true;
    }

    const handleChange = ({ target }) => {
        const { name, value } = target
        setContent({
            ...content,
            [name]: value
        })
    }

    return (
        <div className='mailContainer'>
            <Snackbar open={success === true} autoHideDuration={10000} onClose={() => setSuccess(null)} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
                <Alert variant='filled' severity='success'>
                    <AlertTitle>Success</AlertTitle>
                    Mail Sent Successfully
                </Alert>
            </Snackbar>
            <Snackbar open={success === false} autoHideDuration={10000} onClose={() => setSuccess(null)} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
                <Alert variant='filled' severity='error'>
                    <AlertTitle>Failure</AlertTitle>
                    Failed to send the Mail
                </Alert>
            </Snackbar>
            <div className='backButtonContainer-mailContainer'>
                <button className='backButton-mailContainer'
                    onClick={() => setExamId(null)}
                > {'<<='} Go Back</button>
            </div>
            <p className='mailInfo'>
                You are sending a mail to all the registered candidates for Examid : <span className='examId-mailInfo'>{examId}</span>
            </p>
            <div className='mailArea'>

                {!errorData.subject ?
                    <TextField placeholder='Enter Subject' rows={3} className='mailField'
                        multiline={true} onChange={handleChange} name={'subject'}
                        label='Subject' value={content.subject} /> :
                    <>
                        <TextField placeholder='Enter Subject' rows={3} className='mailField'
                            multiline={true} onChange={handleChange} name={'subject'}
                            label='Subject' value={content.subject} color='error' focused={true} />
                        <p className='formErrors'>*required</p>
                    </>}
                {!errorData.body ?
                    <TextField placeholder='Enter body' label='Body' multiline={true}
                        rows={10} className='mailField' onChange={handleChange} name={'body'}
                        value={content.body} /> : <>
                        <TextField placeholder='Enter body' label='Body' multiline={true}
                            rows={10} className='mailField' onChange={handleChange} name={'body'}
                            sx={{marginTop: "20px"}}
                            value={content.body} color='error' focused={true} /><p className='formErrors'>*required</p>
                    </>}
                {
                    loading ? <CircularProgress color='primary' /> :
                        <button className='sendButton-MailContainer' onClick={handleSendMail}><SendIcon /> <span className='sendButtonText'>Send</span></button>
                }

            </div>
        </div>
    )
}

export default MailContainer
