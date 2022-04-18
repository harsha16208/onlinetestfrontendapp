import { Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import { Redirect } from "react-router-dom/cjs/react-router-dom.min"

export default function ExamHome(props) {


    const [examDetails, setExamDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const urlArray = props.location.state.testUrl.split("/")
    const examId = urlArray[urlArray.length - 1]
    const [startClicked, setStartClicked] = useState(false)
    const testUrl = props.location.state.testUrl
    const cId = props.location.state.cId

    useEffect(() => {
        
        const reloadCount = sessionStorage.getItem('reloadCount');
        if (reloadCount < 2) {
            sessionStorage.setItem('reloadCount', String(reloadCount + 1));
            window.location.reload();
        } else {
            sessionStorage.removeItem('reloadCount');
        }
        
        const token = localStorage.getItem("jwtToken")
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.get(`examdetails/${examId}`, config)
            .then(dt => {
                setExamDetails(dt.data)
            })
            .catch(err => {
            })
        setLoading(false)

    }, [])

    if (startClicked) {
        localStorage.setItem("examAccess", true)
        return <Redirect to={{
            pathname: "/exam",
            state: {
                testUrl: testUrl + `/${cId}`,
                examDetails: examDetails
            }
        }} />
    }
    if (loading) {
        return <div> <img src="images/loading.gif" alt="loading..." height={500} width={500} /></div>
    }
    else if (examDetails === null || examDetails.length === 0) {
        return <h4 className="formErrors">NO Exam found</h4>
    }
    return (
        <div className="examDetailsContainerExamHome">
            <div className="examDetailsExamHome">
                <TableContainer component={Paper}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#24313d"
                                }}>Exam Id</TableCell>
                                <TableCell>{examDetails.examId}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#24313d"
                                }}>Organization Name</TableCell>
                                <TableCell>{examDetails.organizationName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#24313d"
                                }}>Exam Name</TableCell>
                                <TableCell>{examDetails.examName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#24313d"
                                }}> Duration</TableCell>
                                <TableCell>{examDetails.duration} minutes</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#24313d"
                                }}>Start Date</TableCell>
                                <TableCell>Date: {examDetails.startDate.split('T')[0]} - Time: {examDetails.startDate.split('T')[1]
                                }</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    color: "#24313d"
                                }}>End Date</TableCell>
                                <TableCell>Date: {examDetails.endDate.split('T')[0]} - Time: {examDetails.endDate.split('T')[1]
                                }</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <div className="exam-info">
                    <p className="otpTimerInfo">Info About Answer colors</p>
                    <div className="infodivContainer"><div className="currentQuestion infodiv"></div><span>Current Question</span></div>
                    <div className="infodivContainer"><div className="markAsReview infodiv"></div><span>Mark as review</span></div>
                    <div className="infodivContainer"><div className="answered infodiv"></div><span>Answered</span></div>
                    <div className="infodivContainer"><div className="visitedAndUnanswered infodiv"></div><span>Visited and Unanswered</span></div>
                    <div className="infodivContainer"><div className="Unvisited infodiv"></div><span>Unvisited</span></div>
                </div>

                <div className="applyButtonContainer">
                    <Button color="success" variant="contained"
                        onClick={() => {
                            const root = document.getElementById('root')
                            if (root.requestFullscreen) {
                                root.requestFullscreen()
                            }
                            setStartClicked(true)
                        }}
                    >Start Exam</Button>
                </div>
            </div >

        </div>


    )
}