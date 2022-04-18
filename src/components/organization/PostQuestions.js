import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import QuestionPostOptions from "./QuestionPostOptions"
import Questions from "./Questions"

export default function PostQuestions({examId, setSelected}){
    const state = useSelector(state => state.examDetails.examDetails)

    const examDetails = state.filter(exam => exam.examId === examId)[0]
    const [topicDetails, setTopicDetails] = useState([])
    const [topic, setTopic] = useState("")
    const [questionNumber, setQuestionNumber] = useState(1)
    const [buttonDisabled, setButtonDisabled] = useState({ forward: false, backward : true})
    const [questions, setQuestions] = useState({})
    
    useEffect(()=>{
        const config = {
            headers : {
                "Authorization" : `Bearer ${localStorage.getItem('jwtToken')}`
            }
        }

        axios.get(`/gettopicdetails/${examDetails.examId}`, config)
        .then(dt=>{
            const data = dt.data
            const topicData = {}
            data.forEach(topicInData =>{
                topicData[topicInData.topicName] = []
            })
            setQuestions(topicData)
            setTopicDetails(data)
            
        })
        .catch(err=>{
            console.log(err)
        })
    }, [])

    

    const handleQuestionNumbersForward = (number, data, setQuestionData) =>{
        const maxQuestionNumber = topicDetails.filter(t => t.topicName === topic)[0].numberOfQuestions
        if (number === maxQuestionNumber){
            setButtonDisabled({
                backward :true ,
                forward : false
            })
            addQuestion(number, data)
            setQuestionNumber(1)
            setTopic("")
            return
        }
        else{
            setButtonDisabled({
                backward :false ,
                forward : false
            })
        }
        addQuestion(number, data)
        setQuestionNumber(questionNumber+1)
        const nextQuestionData = questions[topic][questionNumber + 1]

        if(nextQuestionData === undefined){
            setQuestionData({question : "", option1 : "", option2 : "", option3 : "", option4 : "",
            answer : "" })
        }
        else{
            setQuestionData(nextQuestionData)
        }
    }

    const handleQuestionNumbersBackward = (number, setQuestionData) =>{
        if(questionNumber === 2){
            setButtonDisabled({
                backward : true,
                forward : false
            })
        }
        else{
            setButtonDisabled({
                backward : false,
                forward : false
            })
        }
        setQuestionNumber(questionNumber-1)
        const prevQuestionData = questions[topic][questionNumber - 1]

        if(prevQuestionData === undefined){
            setQuestionData({question : "", option1 : "", option2 : "", option3 : "", option4 : "",
            answer : "" })
        }
        else{
            setQuestionData(prevQuestionData)
        }
    }

    const addQuestion = (number, data) =>{
        const topicPrevData = questions[topic]
        topicPrevData[number] = data
        console.log(topicPrevData)
        setQuestions({
            ...questions,
            [topic] : topicPrevData
        })
    }

    if (Object.keys(topicDetails).length > 0 && topic === "") {
        return <QuestionPostOptions topics = {topicDetails} setTopic = {setTopic} 
        setSelected = {setSelected} questions = {questions} examId = {examId}/>
    }   
    else if (Object.keys(topicDetails).length > 0){
        const firstQuestion = questions[topic][questionNumber]
        return (
            <div className="postQuestionsContainer">
                <Questions topic = {topic} questionNumber = {questionNumber} 
                setTopic = {setTopic}
                handleQuestionNumbersForward = {handleQuestionNumbersForward}
                handleQuestionNumbersBackward = {handleQuestionNumbersBackward}
                buttonDisabled = {buttonDisabled}
                setQuestionNumber = {setQuestionNumber}
                questions = {questions}
                firstQuestion = {firstQuestion === undefined ? {question : "", option1 : "", option2 : "", option3 : "", option4 : "",
                answer : ""} : firstQuestion }
                />
            </div>
        )
    }
    else{
        return (
            <h1>loading....</h1>
        )
    }
}