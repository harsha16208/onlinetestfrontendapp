import { Button, TextField } from "@mui/material";

export default function FilterResults({ examId, score, handleChange, handleFilterClick }) {
    return (
        <div className="filterResults">
            <h3 className="title">Filter Results for Exam {examId}</h3>
            <div className="filterResultsContainer">
                <TextField label={"Cut-off"} placeholder="Enter cut-off mark"
                    value={score} onChange={handleChange}
                    variant="standard"
                    type={'number'}
                />
                <Button color={"primary"} variant={"contained"} onClick={handleFilterClick}>Filter</Button>
            </div>
        </div>
    )
}