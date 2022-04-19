import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { LocationContext } from "./Candidate"

export default function ExamsApplied() {

    document.title = "Exams Applied"

    const setLocation = useContext(LocationContext)
    const currLocation = useLocation().pathname
    const cId = useSelector(state => state.userDetails.userDetails.userDetails.candidateId)
    const [examsAppliedDetails, setExamsAppliedDetails] = useState(null)
    const [loading, setLoading] = useState(true)
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

        axios.get(`getexamsapplieddetails?cId=${cId}`, config)
            .then(dt => {
                setExamsAppliedDetails(dt.data)
                setResultsFiltered(dt.data)
            })
            .catch(err => {
            })

        setLoading(false)
    }, [])

    useEffect(() => {
        if (examsAppliedDetails !== null) {
            if (examId === "" && organizationName === "") {
                setResultsFiltered(examsAppliedDetails)
            } else {
                if (examId !== "") {

                    const filteredData = examsAppliedDetails.filter(result => {
                        return result.examId.includes(examId)
                    })
                    setResultsFiltered(filteredData)
                } else {

                    const filteredData = examsAppliedDetails.filter(result => {
                        return result.organizationName.includes(organizationName)
                    })
                    setResultsFiltered(filteredData)
                }

            }
        }
    }, [examId, organizationName])

    const handleChange = ({target}) =>{
        setExamId(target.value)
        setOrganizationName("")
    }

    const handleOrganizationChange = ({target}) =>{
        setOrganizationName(target.value)
        setExamId("")
    }

    if (loading) {
        return <div> <img src="images/loading.gif" alt="loading..." height={500} width={500} /></div>
    }
    else if (examsAppliedDetails === null || examsAppliedDetails.length === 0) {
        return <h4 className="formErrors">No Exams Applied</h4>
    }
    return (
        <div className="examsAppliedContainer">
            <p className="filterinfo"> &#9733; Filter Resuls by either Exam Id or Organization Name</p>
            <div className="searchByExamId">
                <h3 className="title">Filter Results</h3>
                <TextField placeholder="Enter Exam Id" label="Exam Id" variant="standard" style={{ margin: "10px" }} value={examId} onChange={handleChange} />
                <TextField placeholder="Enter Organization name" label="Organization Name"
                    variant="standard" style={{ margin: "10px" }} value={organizationName} onChange={handleOrganizationChange} />
            </div>
            <div className="test">
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Exam Id</TableCell>
                                <TableCell>Organization</TableCell>
                                <TableCell>Exam Name</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                filteredResults.map(exam => {
                                    return <TableRow key={exam.examId}>
                                        <TableCell>{exam.examId}</TableCell>
                                        <TableCell>{exam.organizationName}</TableCell>
                                        <TableCell>{exam.examName}</TableCell>
                                        <TableCell>{exam.startDate}</TableCell>
                                        <TableCell>{exam.endDate}</TableCell>
                                    </TableRow>
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}