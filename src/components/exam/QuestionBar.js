import { Button, Grid } from "@mui/material"
import { useEffect, useState } from "react"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function QuestionBar({ questionPaper, setSectionAndQuestion, answers, questionsForReview, sectionAndQuestion,
    visitedQuestions, setVisitedQuestions, setHelpModalOpen }) {


    const handleVisited = (qId) => {
        setVisitedQuestions([
            ...visitedQuestions,
            qId
        ])
    }


    const handleQuestionChange = (sectionIndex, questionIndex, qId) => {

        handleVisited(qId)
        setSectionAndQuestion({
            "section": sectionIndex,
            "question": questionIndex
        })
    }



    const [answeredQuestions, setAnsweredQuestions] = useState([])
    const [reviewQuestions, setReviewQuestions] = useState([])

    useEffect(() => {
        setAnsweredQuestions(Object.keys(answers))
        setReviewQuestions(questionsForReview)
    }, [Object.keys(answers).length, Object.keys(questionsForReview).length])



    return (<div className="questionBar">
        <div className="HelpButtonContainer"><Button color="error" variant="contained"
         onClick={()=>setHelpModalOpen(true)}><HelpOutlineIcon />Help</Button></div>
        {
            questionPaper.map((section, sectionIndex) => {
                const sectionName = Object.keys(section)
                const questions = Object.values(section)[0]
                return (
                    <div className="questionBarsectionContainer" key={sectionIndex}>
                        <div className="sectionName">
                            <h4>{sectionName}</h4>
                        </div>
                        <Grid container rowSpacing={2} columnSpacing={1}>
                            {
                                questions.map((question, questionIndex) => {
                                    return (
                                        <Grid
                                            item
                                            lg={2}
                                            sm={4}
                                            xs={6}
                                            key={questionIndex} className="questionNumberContainer">
                                            {
                                                sectionAndQuestion['section'] === sectionIndex && sectionAndQuestion['question'] === questionIndex ?
                                                    <div className="currentQuestionNumber"
                                                        onClick={() => handleQuestionChange(sectionIndex, questionIndex, question.qId)}>{questionIndex + 1}
                                                    </div>
                                                    :
                                                    answeredQuestions.includes(question.qId) ?
                                                        <div className="questionNumberAnswered"
                                                            onClick={() => handleQuestionChange(sectionIndex, questionIndex, question.qId)}>{questionIndex + 1}
                                                        </div>
                                                        :
                                                        reviewQuestions.includes(question.qId) ?
                                                            <div className="questionNumberReviewed"
                                                                onClick={() => handleQuestionChange(sectionIndex, questionIndex, question.qId)}>{questionIndex + 1}
                                                            </div> :

                                                            visitedQuestions.includes(question.qId) ?
                                                                <div className="questionNumberUnansweredAndVisited"
                                                                    onClick={() => handleQuestionChange(sectionIndex, questionIndex, question.qId)}>{questionIndex + 1}
                                                                </div> :
                                                                <div className="questionNumberUnanswered"
                                                                    onClick={() => handleQuestionChange(sectionIndex, questionIndex, question.qId)}>{questionIndex + 1}
                                                                </div>
                                            }
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </div>
                )
            })
        }
    </div>)
}