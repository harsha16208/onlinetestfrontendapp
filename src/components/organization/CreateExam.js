import { Alert, Button, CircularProgress, Snackbar, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { LocationContext } from "./Organization";
import Topics from "./Topics"


export default function CreateExam() {

    document.title = 'Create Exam'

    const orgId = useSelector(state => state.userDetails.userDetails.userDetails.organizationId)
    const setLocation = useContext(LocationContext)
    const currLocation = useLocation().pathname
    const initialValues = {
        examName: "", examDuration: 0, numberOfQuestions: 0,
        numberOfQuestionsInExam: 0, startDate: "", endDate: "",
        registrationEndDate: "", noOfTopics: 0, description: "",
        noOfQuestionsPerTopic: {},
        noOfQUestionsPerTopicInExam : {}
    }
    const [formData, setFormData] = useState(initialValues)
    const [errorData, setErrorData] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        setLocation(currLocation)
    }, [])

    useEffect(() => {
        if (Object.keys(errorData).length === 0 && isSubmitted) {
            const token = localStorage.getItem("jwtToken")
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            setLoading(true)
            axios.post(`createexam/${orgId}/`, formData, config)
                .then(dt => {
                    setStatus("success")
                    setLoading(false)
                })
                .catch(err => {
                    setStatus("failure")
                    setLoading(false)
                })
        }
    }, [errorData, isSubmitted])

    const handleSubmit = e => {
        e.preventDefault();
        setErrorData(validate(formData))
        setIsSubmitted(true)
    }

    const validate = data => {
        const errors = {}
        const dateTimeRegEx = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d(?:\.\d+)?Z?/
        if (Object.keys(formData.noOfQuestionsPerTopic).length === 0) {
            errors.noOfQUestionsPerTopic = "*please enter details and click on verify"
        }
        if (data.examName === "") {
            errors.examName = "*Exam name required"
        }
        if (data.examDuration < 10) {
            errors.examDuration = "*The minimum exam duration is 10 minutes"
        }
        if (data.numberOfQuestions === 0) {
            errors.numberOfQuestions = "*Required"
        }
        if (data.numberOfQuestionsInExam === 0) {
            errors.numberOfQuestionsInExam = "*Required"
        }
        else if (data.numberOfQuestions < data.numberOfQuestionsInExam) {
            errors.numberOfQuestionsInExam = "* number of questions in exam cannot be greater"
                + " than number of questions provided"
        }
        if (data.startDate === "") {
            console.log(data.startDate)
            errors.startDate = "*required"
        }
        else if (!dateTimeRegEx.test(data.startDate)) {
            errors.startDate = "please select a valid date"
        }
        else if (Date.parse(data.startDate) < Date.parse(new Date())) {
            errors.startDate = "Cannot create an exam in history"
        }
        if (data.endDate === "") {
            errors.endDate = "*required"
        }
        else if (!dateTimeRegEx.test(data.endDate)) {
            errors.endDate = "please select a valid date"
        }
        else if (Date.parse(data.startDate) >= Date.parse(data.endDate)) {
            errors.endDate = "The end date should be after start date"
        }
        if (data.registrationEndDate === "") {
            errors.registrationEndDate = "*required"
        }
        else if (!dateTimeRegEx.test(data.registrationEndDate)) {
            errors.registrationEndDate = "please select a valid date"
        }
        else if (Date.parse(data.startDate) <= Date.parse(data.registrationEndDate)) {
            errors.registrationEndDate = "*The registration date should be before start date"
        }
        else if (Date.parse(new Date()) >= Date.parse(data.registrationEndDate)) {
            errors.registrationEndDate = "*Cannot set registration end date in history"
        }
        if (data.noOfTopics === 0) {
            errors.noOfTopics = "*required"
        }
        else if (data.noOfTopics < 1) {
            errors.noOfTopics = "* number of sections should be greater than 0"
        }
        if (data.description.trim() === "") {
            errors.description = "*required"
        }
        return errors
    }

    const handleChange = ({ target }) => {
        const { name, value } = target
        setFormData({ ...formData, [name]: value })
    }

    if (status === "success") {

        return <div> <img src="images/success.png" alt="" /> 
            {window.location.reload()}
        </div>
    }

    return (<div className="CreateExamContainer">
        {status === "failure" ? <Snackbar open={true} onClose={() => setStatus(null)}
            autoHideDuration={10000} anchorOrigin={{ "vertical": "top", "horizontal": "center" }}>
            <Alert severity="error" variant="filled">Wait for some time or Please try again later</Alert>
        </Snackbar> : null}
        <Stack spacing={1}>
            <TextField placeholder="Enter exam name" label="Exam name" name="examName"
                onChange={handleChange} value={formData.examName} />
            <p className="createExam_formErrors" >{errorData.examName} </p>
            <TextField placeholder="Enter Exam duration" label="Exam Duration in minutes" type={"number"}
                name="examDuration" onChange={handleChange} value={formData.examDuration} />
            <p className="createExam_formErrors" >{errorData.examDuration} </p>
            <TextField placeholder="Enter number of questions" label="Number of Questions you want to provide"
                type={"number"} name="numberOfQuestions" onChange={handleChange}
                value={formData.numberOfQuestions} />
            <p className="createExam_formErrors" >{errorData.numberOfQuestions} </p>
            <TextField placeholder="Enter number of questions for exam" label="Number of Questions in exam"
                type={"number"} name="numberOfQuestionsInExam" onChange={handleChange}
                value={formData.numberOfQuestionsInExam} />
            <p className="createExam_formErrors" >{errorData.numberOfQuestionsInExam} </p>
            <TextField label="Start Date" type={"datetime-local"} InputLabelProps={{
                shrink: true,
            }} name="startDate" onChange={handleChange}
                value={formData.startDate} />
            <p className="createExam_formErrors" >{errorData.startDate} </p>
            <TextField label="End Date" type={"datetime-local"} InputLabelProps={{
                shrink: true,
            }} name="endDate" onChange={handleChange}
                value={formData.endDate} />
            <p className="createExam_formErrors" >{errorData.endDate} </p>
            <TextField label="Registration End Date" type={"datetime-local"} InputLabelProps={{
                shrink: true,
            }} name="registrationEndDate" onChange={handleChange}
                value={formData.registrationEndDate} />
            <p className="createExam_formErrors" >{errorData.registrationEndDate} </p>
            <TextField label="Number of sections" type={"number"} placeholder="Enter number of sections"
                onChange={handleChange} name="noOfTopics" value={formData.noOfTopics} />
            <p className="createExam_formErrors" >{errorData.noOfTopics} </p>
            {formData.noOfTopics > 0 ?
                <div className="createexam_topics">
                    <p>please enter topic names and number of questions per topic</p>
                    <Topics noOfTopics={formData.noOfTopics} setFormData={setFormData} formData={formData} />
                    <p className="createExam_formErrors" >{errorData.noOfQUestionsPerTopic} </p>
                </div>
                : null}

            <TextField label="Enter Description" placeholder="Enter description"
                onChange={handleChange} name="description" value={formData.description} />
            <p className="createExam_formErrors" >{errorData.description} </p>
            <div className="createExamButtonContainer">
                {
                    loading ? <CircularProgress color="secondary" /> :
                        <Button variant="contained" color="primary" onClick={handleSubmit} className="createExamButton">Create Exam </Button>
                }

            </div>
        </Stack>
    </div>)
}