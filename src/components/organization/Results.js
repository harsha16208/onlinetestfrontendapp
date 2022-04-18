import { Alert, AlertTitle, Button, Snackbar, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import FilterResults from "./FilterResults";
import FilterModal from "./FilterModal"

export default function Results({ setSelected, examId }) {
    const [rowData, setRowData] = useState([])
    const [rowFilterData, setRowFilterData] = useState([])
    const [score, setScore] = useState('')
    const columns = [
        { field: "id", headerName: "Registration Number", width: 300 },
        { field: "candidateName", headerName: "Candidate Name", width: 300 },
        { field: "candidateId", headerName: "Candidate ID", width: 300 },
        { field: "score", headerName: "Score", width: 300 }
    ]
    const [filterSuccessful, setFilterSuccessful] = useState(false)
    const [loading, setLoading] = useState(true)
    const [candidateId, setcandidateId] = useState("")
    const [name, setName] = useState("")
    const [openFilterModal, setOpenFilterModal] = useState(false)
    const [verified, setVerified] = useState(false)

    useEffect(() => {

        const token = localStorage.getItem('jwtToken')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.get(`getresults/${examId}`, config)
            .then(dt => {
                const results = dt.data
                const rowDataTemp = []
                if (results.length > 0) {
                    results.forEach(result => {
                        rowDataTemp.push({
                            id: result.regId,
                            candidateName: result.name,
                            candidateId: result.candidateId,
                            score: result.score
                        })
                    })
                }
                setRowData(rowDataTemp)
                setRowFilterData(rowDataTemp)
            })
            .catch(err => {
            })

        setLoading(false)
    }, [])

    useEffect(() => {
        if (score === "") {
            return;
        }
        const token = localStorage.getItem('jwtToken')

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.get(`${examId}/filter?cutoff=${score}`, config)
            .then(dt => {
                if (dt.data === true) {
                    setFilterSuccessful(true)
                }
            })
            .catch(err => {
                setFilterSuccessful(false)
            })

        setVerified(false)
    }, [verified])

    useEffect(() => {
        if (score === "") {
            setRowFilterData(rowData)
        } else {
            const value = score
            const filteredTempData = rowData.filter(row => {
                let row_score = parseInt(row.score)
                return row_score >= value
            })
            setRowFilterData(filteredTempData)
        }

    }, [score])

    useEffect(() => {
        if (candidateId !== "" || name !== "") {
            if (candidateId === "") {
                const filteredNames = rowData.filter(row => {
                    return row.candidateName.toLowerCase().includes(name.toLowerCase())
                })
                setRowFilterData(filteredNames)
            } else {
                const filteredIds = rowData.filter(row => {
                    return row.candidateId.toLowerCase().includes(candidateId.toLowerCase())
                })
                setRowFilterData(filteredIds)
            }
        } else {
            setRowFilterData(rowData)
        }
    }, [name, candidateId])

    const handleChange = ({ target }) => {
        setcandidateId("")
        setName("")
        setScore(target.value)
    }

    const handleNameChange = ({ target }) => {
        setcandidateId("")
        setName(target.value)
    }

    const handlecandidateIdChange = ({ target }) => {
        setName("")
        setcandidateId(target.value)
    }

    const handleFilterClick = () => {
        setOpenFilterModal(true)
    }

    if (loading) {
        return <div> <img src="images/loading.gif" alt="loading..." height={500} width={500} /></div>
    }
    else if (rowFilterData === null) {
        return <div>Something went wrong</div>
    }

    return (
        <>
            <Snackbar open={filterSuccessful} autoHideDuration={10000}
                onClose={() => {
                    setFilterSuccessful(false)
                    window.location.reload()
                }}
                anchorOrigin={{ horizontal: "center", vertical: 'top' }}
            >
                <Alert severity="success" variant="filled">
                    <AlertTitle>Success</AlertTitle>
                    Filtered Successfully
                </Alert>
            </Snackbar>
            <Button color="error" variant="contained" onClick={() => setSelected("")}>Back</Button>
            <FilterResults examId={examId}
                handleFilterClick={handleFilterClick}
                score={score}
                handleChange={handleChange}
            />

            <FilterModal openFilterModal={openFilterModal}
                setOpenFilterModal={setOpenFilterModal}
                setVerified={setVerified}
            />

            <div className="searchResults">
                <h4>Count : {rowFilterData.length}</h4>
                <TextField placeholder="Enter Name" label="Search By name"
                    value={name} onChange={handleNameChange}
                    variant="standard" />
                <TextField placeholder="Enter candidateId" label="Search By CandidateID"
                    value={candidateId} onChange={handlecandidateIdChange}
                    variant="standard" />
            </div>
            <div style={{ height: "57vh", width: '100%', overflowY: "scroll" }}>
                <DataGrid
                    rows={rowFilterData}
                    columns={columns}
                />
            </div>
        </>
    )
}