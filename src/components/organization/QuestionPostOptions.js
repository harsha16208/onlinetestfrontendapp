import { Button, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function QuestionPostOptions({topics, setTopic, setSelected, questions, examId}){

    const [errorData, setErrorData] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const userDetails = useSelector(state => state.userDetails.userDetails.userDetails)
    const organizationId = userDetails.organizationId
    

    const columns = [
        {field: "topic", headerName: "Topic", width: 200},
        {field: "questions", headerName: "Questions", width: 200},
        {field: "questionsPosted", headerName: "Questions Posted", width: 200},
        {field: "postQuestions", headerName: "Post Questions", width: 200,
            renderCell: ({row})=>{
                return (
                    <Button variant="contained" onClick={()=>setTopic(row.topic)}>Post</Button>
                )
            }
    
        }

    ]

    const rows = []

    const questionsRequired = []
    const totalQuestionsPosted = []


    useEffect(()=>{
        if(errorData.length === 0 && isSubmitted){
            setLoading(true)
            const config = {
                headers : {
                    "Authorization" : `Bearer ${localStorage.getItem('jwtToken')}`
                }
            }
            
            const trimQuestions = questions
            const keys = Object.keys(trimQuestions)

            keys.forEach(key =>{
                trimQuestions[key].shift()
            })
            


            axios.post(`createexam/${organizationId}/${examId}/postquestions`, {"questions" : questions}, config)
            .then(dt =>{
                setLoading(false)
                setSuccess(true)
                setIsSubmitted(false)
            })
            .catch(err =>{
                setLoading(false)
                setIsSubmitted(false)
            })
        }
    }, [errorData, isSubmitted])

    const validate = () =>{
        const result = totalQuestionsPosted.reduce((val1, val2)=> val1+val2)
        const required = questionsRequired.reduce((val1, val2)=> val1+val2)

        if(result - questionsRequired.length !== required){
            setErrorData("* Required to post all the questions from all the sections")
        }
        else{
            setErrorData("")
            setIsSubmitted(true)
        }
    }

    topics.forEach(topic => {
       const postedQuestionsCount =  questions[topic.topicName].length - 1
       totalQuestionsPosted.push(postedQuestionsCount + 1)
       questionsRequired.push(topic.numberOfQuestions)
       rows.push({
            id : topic.id,
            topic : topic.topicName,
            questions : topic.numberOfQuestions,
            questionsPosted : (postedQuestionsCount < 0) ? 0 : postedQuestionsCount
        })
    })

    if(success){
        setSelected(false)
    }

    return (
        <div style={{ height: 300, width: '100%' }}>
            <Button color = "secondary" onClick = {()=> setSelected(false)}>Change Exam</Button>
            <div className="examTitle"><h3>Exam Id : {examId}</h3></div>
            <DataGrid
            columns={columns}
            rows = {rows}
            />
            {
                loading ? <CircularProgress color="secondary"/> :
            <Button color = "primary" onClick = {validate} variant = {"contained"}>Post Questions</Button> }
            <p className="formErrors">{errorData}</p>
        </div>
    )
}