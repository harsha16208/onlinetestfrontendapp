import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { LocationContext } from "./Candidate"
import axios from "axios";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import { Redirect } from "react-router-dom";

export default function MyExams() {

    document.title = "Exams Page"

    const setLocation = useContext(LocationContext)
    const currLocation = useLocation().pathname
    const cId = useSelector(state => state.userDetails.userDetails.userDetails.candidateId)
    const [currentExams, setCurrentExams] = useState(null)
    const [loading, setLoading] = useState(true)
    const [testUrl, setTestUrl] = useState("")
    const [filteredResults, setResultsFiltered] = useState([])
    const [examId, setExamId] = useState("")
    const [organizationName, setOrganizationName] = useState("")

    useEffect(() => {
        setLocation(currLocation)

        const token = localStorage.getItem('jwtToken')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.get(`getcurrentexamdetails/?cId=${cId}`, config)
            .then(dt => {
                console.log(dt)
                setCurrentExams(dt.data)
                setResultsFiltered(dt.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
            
        
    }, []);

    useEffect(() => {
        if (currentExams !== null) {
            if (examId === "" && organizationName === "") {
                setResultsFiltered(currentExams)
            } else {
                if (examId !== "") {

                    const filteredData = currentExams.filter(result => {
                        return result.examId.includes(examId)
                    })
                    setResultsFiltered(filteredData)
                } else {

                    const filteredData = currentExams.filter(result => {
                        return result.organizationName.includes(organizationName)
                    })
                    setResultsFiltered(filteredData)
                }

            }
        }
    }, [examId, organizationName])

    const handleChange = ({ target }) => {
        setExamId(target.value)
        setOrganizationName("")
    }

    const handleOrganizationChange = ({ target }) => {
        setOrganizationName(target.value)
        setExamId("")
    }

    const handleClick = testUrl => {
        setTestUrl(testUrl)
    }

    if (loading) {
        return <h1>loading...</h1>
    }
    else if (currentExams === null || currentExams.length === 0) {
        return <h4 className="formErrors">No exams scheduled currently</h4>
    }
    else if (testUrl !== "") {
        return <Redirect to={{
            pathname: "/examhome",
            state: {
                testUrl: testUrl,
                cId: cId
            }
        }} />
    }
    return (<div className="myexams_container">
        <p className="filterinfo"> &#9733; Filter Resuls by either Exam Id or Organization Name</p>
        <div className="searchByExamId">
            <h3 className="title">Filter Results</h3>
            <TextField placeholder="Enter Exam Id" label="Exam Id" variant="standard" style={{ margin: "10px" }} value={examId} onChange={handleChange} />
            <TextField placeholder="Enter Organization name" label="Organization Name"
                variant="standard" style={{ margin: "10px" }} value={organizationName} onChange={handleOrganizationChange} />
        </div>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Exam Id</TableCell>
                        <TableCell>Organization</TableCell>
                        <TableCell>Exam Name</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Attempted</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        filteredResults.map(exam => {
                            return (
                                <TableRow key={exam.examId}>
                                    <TableCell>{exam.examId}</TableCell>
                                    <TableCell>{exam.organizationName}</TableCell>
                                    <TableCell>{exam.examName}</TableCell>
                                    <TableCell>{exam.startDate}</TableCell>
                                    <TableCell>{exam.endDate}</TableCell>
                                    <TableCell>{exam.duration} minutes</TableCell>
                                    <TableCell>{exam.attempted ? "Yes" : "No"}</TableCell>
                                    <TableCell>
                                        {
                                            exam.attempted ?
                                                <Button color="primary" variant="contained"
                                                    onClick={() => handleClick(exam.testUrl)}
                                                    disabled
                                                >
                                                    Start Exam
                                                </Button>
                                                :
                                                <Button color="primary" variant="contained"
                                                    onClick={() => handleClick(exam.testUrl)}
                                                >
                                                    Start Exam
                                                </Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </div>)
}