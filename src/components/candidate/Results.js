import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { LocationContext } from "./Candidate"

export default function Results() {

    document.title = "Results page"

    const setLocation = useContext(LocationContext)
    const currLocation = useLocation().pathname
    const [loading, setLoading] = useState(true)
    const [resultData, setResultData] = useState(null)
    const cId = useSelector(state => state.userDetails.userDetails.userDetails.candidateId)
    const [examId, setExamId] = useState("")
    const [filteredResults, setResultsFiltered] = useState([])
    const [organizationName, setOrganizationName] = useState("")

    useEffect(() => {
        setLocation(currLocation)

        const token = localStorage.getItem('jwtToken')
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.get(`getresults?cId=${cId}`, config)
            .then(dt => {
                setResultData(dt.data)
                setResultsFiltered(dt.data)
            })
            .catch(err => {
            })

        setLoading(false)

    }, [])

    useEffect(() => {
        if (resultData !== null) {
            if (examId === "" && organizationName === "") {
                setResultsFiltered(resultData)
            } else {
                if (examId !== "") {

                    const filteredData = resultData.filter(result => {
                        return result.examId.includes(examId)
                    })
                    setResultsFiltered(filteredData)
                } else {

                    const filteredData = resultData.filter(result => {
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

    if (loading) {
        return <h5>loading...</h5>
    }
    else if (resultData === null) {
        return <h4 className="formErrors">No results to display</h4>
    }
    return (<div className="resultContainer">
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
                        <TableCell>Exam Name</TableCell>
                        <TableCell>Organization Name</TableCell>
                        <TableCell>Score</TableCell>
                        <TableCell>Qualified</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredResults.map((result, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>{result.examId}</TableCell>
                                <TableCell>{result.examName}</TableCell>
                                <TableCell>{result.organizationName}</TableCell>
                                {
                                    result.resultFiltered ? (<>
                                        <TableCell>{result.score}</TableCell>
                                        <TableCell>
                                            {result.qualified ? <div className="result qualified">&#10004;</div> : <div className="result notQualified">X</div>}
                                        </TableCell> </>) :
                                        <TableCell colSpan={2} style={{ textAlign: "center" }}><h3>Pending</h3></TableCell>
                                }
                            </TableRow>)
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </div>)
}