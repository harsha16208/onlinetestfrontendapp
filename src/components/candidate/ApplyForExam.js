import { Button, CircularProgress, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from "@material-ui/core"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { LocationContext } from "./Candidate"
import { Alert, AlertTitle } from "@mui/material";

export default function ApplyForExam() {

    const userDetails = useSelector(state => state.userDetails.userDetails.userDetails)
    const setLocation = useContext(LocationContext)
    const currLocation = useLocation().pathname
    const [examId, setExamId] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const [examDetails, setExamDetails] = useState([])
    const [applyClicked, setApplyClicked] = useState(0)
    const [loading, setLoading] = useState(false)
    const [applyMessage, setApplyMessage] = useState("")

    useEffect(() => {
        setLocation(currLocation)

        const token = localStorage.getItem("jwtToken")
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        if (examId !== "") {
            axios.get(`examdetails/${examId}`, config)
                .then(dt => {
                    setExamDetails(dt.data)
                })
                .catch(err => {
                })

            setSubmitted(false)
        }
        if (applyClicked) {
            setLoading(true)
            const orgId = examDetails.orgId
            const eId = examDetails.examId
            const cId = userDetails.candidateId
            axios.post(`applyforexam/${orgId}/${eId}/${cId}`, {}, config)
                .then(dt => {
                    setApplyMessage(dt.data.status)
                    setLoading(false)
                    setApplyClicked(0)
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                    setApplyClicked(0)
                })
        }

    }, [submitted, applyClicked])

    const handleChange = ({ target }) => {
        setExamId(target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        setSubmitted(true)
    }


    return (
        <div className="ApplyForExamContainer">
            <Snackbar open={applyMessage.length != 0}
                autoHideDuration={6000}
                onClose={() => setApplyMessage("")}
                anchorOrigin={{ "vertical": "top", "horizontal": "center" }}
            >
                {applyMessage === "success" ?
                    <Alert severity="success" variant="filled">
                        <AlertTitle>Success</AlertTitle>
                        {applyMessage}
                    </Alert>
                    : <Alert severity="error" variant="filled">
                        <AlertTitle>Error</AlertTitle>
                        {applyMessage}
                    </Alert>
                }
            </Snackbar>
            <div className="ApplyForExam">
                <TextField label="Exam Id" placeholder="Enter Exam Id"
                    name="examId"
                    value={examId} onChange={handleChange} />
                {
                    examId === "" || examId.trim().length === 0 ?
                        <Button disabled>Get Exam Details</Button>
                        :
                        <Button style={{ backgroundColor: "#1a9be1", color: "#fff" }}
                            size="small"
                            onClick={handleSubmit}
                            variant="contained">Get Exam Details</Button>
                }
            </div>
            {
                Object.keys(examDetails).length != 0 ?
                    <div className="examDetailsContainer">
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Exam Id</TableCell>
                                        <TableCell>{examDetails.examId}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Organization Name</TableCell>
                                        <TableCell>{examDetails.organizationName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Exam Name</TableCell>
                                        <TableCell>{examDetails.examName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>{examDetails.startDate}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>End Date</TableCell>
                                        <TableCell>{examDetails.endDate}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div className="applyButtonContainers">
                            {loading ?
                                <CircularProgress color="primary" />
                                : <Button color="primary" variant="contained"
                                    onClick={() => setApplyClicked(applyClicked + 1)}
                                >Apply</Button>}
                        </div>
                    </div>
                    : null
            }
            {examDetails === "" ?<p className="formErrors">No exam found with given id</p> : null}
        </div>
    )
}
