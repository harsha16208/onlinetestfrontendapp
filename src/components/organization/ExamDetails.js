import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function ExamDetails({ setExamId }) {

    const examDetails = useSelector(state => state.examDetails.examDetails)
    const [filteredDetails, setFilteredDetails] = useState(examDetails)
    const [id, setId] = useState('')
    const [name, setName] = useState('')


    useEffect(() => {
        if (id === '' && name === '') {
            setFilteredDetails(examDetails)
        } else {
            if (name === '') {
                setFilteredDetails(examDetails.filter(exam => exam.examId.toLowerCase().includes(id.toLowerCase())))
            } else {
                setFilteredDetails(examDetails.filter(exam => exam.examName.toLowerCase().includes(name.toLowerCase())))
            }
        }
    }, [id, name])

    const handleClick = (examId) => {
        setExamId(examId)
    }


    const handleExamIdChange = ({ target }) => {
        setId(target.value)
        setName('')
    }

    const handleExamNameChange = ({ target }) => {
        setName(target.value)
        setId('')
    }


    return (
        <>
            <div className='filterContainer-TriggerMails'>
                <p className='filterInfo-TriggerMails'>Want to Filter enter ExamId or Exam Name</p>
                <TextField style={{ backgroundColor: "white" }}
                    variant='filled' placeholder='Enter Exam Id' label='Exam Id' value={id} onChange={handleExamIdChange} />
                <TextField style={{ backgroundColor: "white" }}
                    variant='filled' placeholder='Enter Exam Name' label='Exam Name' value={name} onChange={handleExamNameChange} />
            </div>
            <div className='ExamDetailsContainer-TriggerMails'>
                <h3>Count : {filteredDetails.length}</h3>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Exam Id</TableCell>
                                <TableCell>Exam Name</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Send Mail</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                filteredDetails.map((exam, index) => {
                                    return <TableRow key={index}>
                                        <TableCell className='examId-TriggerMails'>{exam.examId}</TableCell>
                                        <TableCell>{exam.examName}</TableCell>
                                        <TableCell>{exam.startDate}</TableCell>
                                        <TableCell>{exam.endDate}</TableCell>
                                        <TableCell><button className='sendMailButton'
                                            onClick={() => handleClick(exam.examId)}>Send Mail</button></TableCell>
                                    </TableRow>
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}

export default ExamDetails
