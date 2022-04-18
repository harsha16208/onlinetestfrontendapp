import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { DataGrid } from '@mui/x-data-grid';
import { Button } from "@mui/material";
import PostQuestions from "./PostQuestions"
import axios from "axios";
import { LocationContext } from "./Organization";
import { useLocation } from "react-router-dom";

export default function PostQuestionsStatus() {

    const [selected, setSelected] = useState(false)
    const orgId = useSelector(state => state.userDetails.userDetails.userDetails.organizationId)
    const [examId, setExamId] = useState('')
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const setLocation = useContext(LocationContext)
    const currLocation = useLocation().pathname


    const columns = [
        { field: 'id', headerName: 'ID', width: 200 },
        { field: 'examName', headerName: 'Name', width: 200 },
        {
            field: 'questionsPosted', headerName: 'Questions Posted', width: 200,
            renderCell: (cellValues) => {
                return <>
                    {cellValues.row.questionsPosted ? <div className="result qualified">&#10004;</div>
                        : <div className="result notQualified">X</div>}
                </>
            }
        },
        {
            field: 'postQuestions', headerName: 'Post Questions', width: 200,
            renderCell: (cellValues) => {
                return (
                    cellValues.row.questionsPosted?
                        <Button color={"secondary"} variant="contained" disabled> Post </Button> :
                        <Button
                            variant="contained"
                            color={"secondary"}
                            onClick={(event) => {
                                handleClick(event, cellValues);
                            }}
                        >
                            Post
                        </Button>
                );
            }
        }
    ]


    useEffect(() => {
        setLocation(currLocation)
    }, [])

    useEffect(() => {

        const token = localStorage.getItem("jwtToken")
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        setLoading(true)
        axios.get(`/getexamdetails/${orgId}`, config)
            .then(dt => {
                const rowData = dt.data.map(row => {
                    return {
                        'id': row.examId,
                        'examName': row.examName,
                        'questionsPosted': row.questionsPosted,
                    }
                })

                setRows(rowData)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })


    }, [selected])

    const handleClick = (event, cellValues) => {
        event.preventDefault()
        setExamId(cellValues.id)
        setSelected(true)
    }

    if (loading) {
        return <><h3>loading....</h3></>
    }
    else if (selected) {
        return <PostQuestions examId={examId} setSelected={setSelected} />
    }
    return (<div className="postQuestions" style={{ height: "70vh", width: '100%' }}>
        <h1 className="title">Post Questions</h1>
        <h3>Exams Created : {rows.length}</h3>
        <DataGrid
            rows={rows}
            columns={columns}
        />
    </div>)
}