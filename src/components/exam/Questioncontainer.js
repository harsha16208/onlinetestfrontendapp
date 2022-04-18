import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material"
import { useEffect, useState } from "react"
import Timer from "./Timer"
import SubmitModal from "./SubmitModal"

export default function QuestionContainer({ sectionAndQuestion, questionPaper,
    handleNextQuestionChange, lastQuestion, handlePrevQuestionChange,
    firstQuestion, answers, handleMarkForReview, examDetails, setTimeup, handleSubmitExam, visitedQuestions,
    setVisitedQuestions, setIsSubmitModalOpen }) {
    const currentTopic = questionPaper[sectionAndQuestion['section']]
    const currentTopicName = Object.keys(currentTopic)[0]
    const currentTopicQuestions = Object.values(currentTopic)[0]
    const currentQuestion = currentTopicQuestions[sectionAndQuestion['question']]
    const [answer, setAnswer] = useState("")
    const [openModal, setOpenModal] = useState(false)


    useEffect(() => {
        if (visitedQuestions.length === 0) {
            setVisitedQuestions([
                ...visitedQuestions,
                currentQuestion.qId
            ])
        }

        if (answers[currentQuestion.qId] !== undefined) {

            setAnswer(answers[currentQuestion.qId])
        } else {
            setAnswer("")
        }
    }, [sectionAndQuestion['section'], sectionAndQuestion['question']])


    const handleNext = () => {
        handleNextQuestionChange(currentQuestion.qId, answer)
    }

    const handleModal = () => {
        document.exitFullscreen()
        setIsSubmitModalOpen(true)
        setOpenModal(true)
    }

    const handleExamSubmit = () => {
        handleSubmitExam(currentQuestion.qId, answer)
    }

    const handlePrev = () => {
        handlePrevQuestionChange(currentQuestion.qId, answer)
    }

    const handleOptionSelected = ({ target }) => {
        setAnswer(target.value)
    }

    const handleMarkForReviewAndNext = () => {
        handleMarkForReview(currentQuestion.qId)
    }

    const handleOptionChange = ({target}) =>{
        setAnswer(target.value)
    }

    return (<div className="questionContainer">
        <SubmitModal setOpenModal={setOpenModal} openModal={openModal}
            handleExamSubmit={handleExamSubmit}
            setIsSubmitModalOpen={setIsSubmitModalOpen}
        />
        <div className="timerContainer"><Timer
            examDetails={examDetails}
            setTimeup={setTimeup} /></div>
        <div className="questionDetails">
            <div className="questionSectionName"><h2>{currentTopicName}</h2></div>
            <div className="SectionQuestionNumber"><h2>
                Question Number : {sectionAndQuestion['question'] + 1}</h2></div>
        </div>
        <div className="questionAndOption">
            <div className="question">
                <pre> {currentQuestion.question}</pre>
            </div>

            <FormControl component="fieldset">
                <FormLabel component="legend" >Options</FormLabel>
                <RadioGroup name="options" value={answer} onChange={handleOptionChange}>
                    <FormControlLabel value={currentQuestion.option1} control={<Radio />} label={currentQuestion.option1} />
                    <FormControlLabel value={currentQuestion.option2} control={<Radio />} label={currentQuestion.option2} />
                    <FormControlLabel value={currentQuestion.option3} control={<Radio />} label={currentQuestion.option3} />
                    <FormControlLabel value={currentQuestion.option4} control={<Radio />} label={currentQuestion.option4} />
                </RadioGroup>
            </FormControl>
            {/* <div className={answer === currentQuestion.option1 ? "optionSelected" : "optionContainer"}>
                <button className="option" onClick={handleOptionSelected} value={currentQuestion.option1}><pre>{currentQuestion.option1}</pre></button>
            </div>
            <div className={answer === currentQuestion.option2 ? "optionSelected" : "optionContainer"}>
                <button className="option" onClick={handleOptionSelected} value={currentQuestion.option2}><pre>{currentQuestion.option2}</pre></button>
            </div>
            <div className={answer === currentQuestion.option3 ? "optionSelected" : "optionContainer"}>
                <button className="option" onClick={handleOptionSelected} value={currentQuestion.option3}><pre>{currentQuestion.option3}</pre></button>
            </div>
            <div className={answer === currentQuestion.option4 ? "optionSelected" : "optionContainer"}>
                <button className="option" onClick={handleOptionSelected} value={currentQuestion.option4}><pre>{currentQuestion.option4}</pre></button>
            </div> */}
            <div className="optionButtonContainer">
                {
                    firstQuestion ? null :
                        <Button variant="contained" color="info" onClick={handlePrev}>Prev</Button>
                }

                <div className="optionButtonContainer-forward">
                    <Button variant="contained" color="warning"
                        style={{
                            marginRight: "20px"
                        }}
                        onClick={handleMarkForReviewAndNext}
                    >Mark For review and Next</Button>
                    {
                        lastQuestion ?
                            <span className="lastQuestionOptionsContainer">
                                <Button variant="contained" color="success" onClick={handleModal}>Submit Exam</Button>
                                <span> <Button variant="contained" color="success" onClick={handleNext}>Save</Button></span>
                            </span>
                            : <Button variant="contained" color="success" onClick={handleNext}>Save and Next</Button>
                    }

                </div>
            </div>
        </div>

    </div>)
}