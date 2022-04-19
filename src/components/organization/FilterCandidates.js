import { Paper } from "@material-ui/core"
import { Button } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { LocationContext } from "./Organization"
import Results from "./Results"

export default function FilterCandidates() {

    document.title = 'Results'

    const examDetails = useSelector(state => state.examDetails.examDetails)
    const [examId, setExamId] = useState('')
    const [selected, setSelected] = useState("")
    const rows = []
    const columns = [
        { field: "id", headerName: "Exam Id", width: 200 },
        { field: "examName", headerName: "Exam Name", width: 200 },
        {
            field: "filtered", headerName: "Filtered", width: 200,
            renderCell: (cellValues) => {
                return <>
                    {cellValues.row.filtered ? <div className="result qualified">&#10004;</div>
                    : <div className="result notQualified">X</div>}
                </>
            }
        },
        {
            field: "getResults", headerName: "Get Results", width: 200,
            renderCell: (cellValues) => {
                return (
                    <Button color={"success"} variant={"contained"}
                        onClick={
                            () => handleClick(cellValues)
                        }
                    >Get Results</Button>
                )
            }
        }
    ]
    const setLocation = useContext(LocationContext)
    const currLocation = useLocation().pathname

    useEffect(() => {
        setLocation(currLocation)
    }, [])

    examDetails.forEach(exam => {
        rows.push({
            id: exam.examId,
            examName: exam.examName,
            filtered: exam.resultsFiltered
        })
    })

    const handleClick = (cellValues) => {
        setExamId(cellValues.row.id)
        setSelected("getresults")
    }

    if (selected === "getresults") {
        return <Results setSelected={setSelected} examId={examId}  />
    }
    return (<div style={{ height: '65vh', width: '100%'}}>
        <h1 className="title">Check Results</h1>
        <DataGrid 
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
        />
    </div>)
}