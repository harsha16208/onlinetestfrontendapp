import { CircularProgress } from "@mui/material"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import QuestionBar from "./QuestionBar"
import QuestionContainer from "./Questioncontainer"
import WarningModal from "./WarningModal"
import ReactDOM from 'react-dom'
import ExamHelpModal from "./ExamHelpModal"

export default function Exam(props) {
    const testUrl = props.location.state.testUrl
    const examDetails = props.location.state.examDetails
    const [questionPaper, setQuestionPaper] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sectionAndQuestion, setSectionAndQuestion] = useState({ section: 0, question: 0 })
    const [lastQuestion, setLastQuestion] = useState(false)
    const [firstQuestion, setFirstQuestion] = useState(true)
    const [answers, setAnswers] = useState({})
    const [questionBarUpdate, setQuestionBarUpdate] = useState(0)
    const [questionsForReview, setQuestionsForReview] = useState([])
    const [timeup, setTimeup] = useState(false)
    const [submitClicked, setSubmitClicked] = useState(false)
    const [message, setMessage] = useState("")
    const candidateId = useSelector(state => state.userDetails.userDetails.userDetails.candidateId)
    const orgId = examDetails.orgId
    const examId = examDetails.examId
    const [submissionStatus, setSubmissionStatus] = useState(null)
    const [visitedQuestions, setVisitedQuestions] = useState([])
    const [warningModalOpen, setWarningModalOpen] = useState(false)
    const [warningCount, setWarningCount] = useState(-1)
    const [warningMessage, setWarningMessage] = useState('')
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
    const [focus, setFocus] = useState('')
    const [helpModalOpen, setHelpModalOpen] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("jwtToken")
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        axios.get(testUrl, config)
            .then(dt => {
                if (dt.status === 204) {
                    console.log(dt)
                    setMessage("Please Try At exam time")
                } else {
                    setQuestionPaper(dt.data)
                }
            })
            .catch(err => {
            })

        setLoading(false)


        // for preventing usage of back button on exam window
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', (event) => {
            window.history.pushState(null, document.title, window.location.href);
        });


    }, [])


    useEffect(() => {
        if (submitClicked === false && timeup === false && focus !== '') {
            const node = ReactDOM.findDOMNode(focus).focus()
        }

    }, [focus, warningModalOpen, isSubmitModalOpen])

    useEffect(() => {
        if (questionPaper !== null) {
            const isFirst = () => {
                if (sectionAndQuestion['section'] === 0 && sectionAndQuestion['question'] === 0) {
                    setFirstQuestion(true)
                } else {
                    setFirstQuestion(false)
                }
            }

            const isLast = () => {
                const totalSections = Object.values(questionPaper).length
                const lastSection = Object.values(questionPaper)[totalSections - 1]
                const questionsInLastSection = Object.values(lastSection)[0].length

                if (sectionAndQuestion['section'] === totalSections - 1 &&
                    sectionAndQuestion['question'] === questionsInLastSection - 1
                ) {
                    setLastQuestion(true)
                } else {
                    setLastQuestion(false)
                }


            }

            isLast()
            isFirst()


        }

    }, [loading, sectionAndQuestion['section'], sectionAndQuestion['question']])

    useEffect(() => {
        if (timeup || submitClicked) {
            const qIds = Object.keys(answers)
            const options = Object.values(answers)
            const answerData = []

            for (let i = 0; i < qIds.length; i++) {
                answerData.push({
                    qId: qIds[i],
                    answer: options[i]
                })
            }

            const token = localStorage.getItem('jwtToken')
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

            let attempts = 3

            const answerSubmissionCall = () => {
                axios.post(`test/${orgId}/${examId}/${candidateId}/submit`, {
                    answers: answerData
                }, config)
                    .then(dt => {
                        setSubmissionStatus(true)
                    }
                    )
                    .catch(err => {
                        attempts -= 1
                        if (attempts > 0) {
                            answerSubmissionCall()
                        } else {
                            setSubmissionStatus(false)
                        }
                    })
            }

            answerSubmissionCall()

        }

    }, [timeup, submitClicked])

    const handleSubmitExam = (qId, answer) => {
        if (answer !== "") {
            setAnswers({
                ...answers,
                [qId]: answer
            })
        }
        setSubmitClicked(true)
    }

    const questionVisited = (qId) => {
        setVisitedQuestions([
            ...visitedQuestions,
            qId
        ])
    }

    const handleNextQuestionChange = (qId, answer) => {
        questionVisited(qId)
        if (answer !== "") {
            setAnswers({
                ...answers,
                [qId]: answer
            })
        }

        const totalSections = Object.values(questionPaper).length
        const currentSection = Object.values(questionPaper)[sectionAndQuestion['section']]
        const questionsInCurrentSection = Object.values(currentSection)[0].length - 1
        if (sectionAndQuestion['question'] < questionsInCurrentSection) {
            setSectionAndQuestion({
                'question': sectionAndQuestion['question'] + 1,
                'section': sectionAndQuestion['section']
            })
        } else {
            if (sectionAndQuestion['section'] < totalSections - 1) {
                setSectionAndQuestion({
                    'question': 0,
                    'section': sectionAndQuestion['section'] + 1
                })
            }
        }
    }

    const handleMarkForReview = (qId) => {
        const questionsForReviewUpdate = questionsForReview
        questionsForReviewUpdate.push(qId)
        setQuestionsForReview(questionsForReviewUpdate)
        setQuestionBarUpdate(questionBarUpdate + 1)

        const totalSections = Object.values(questionPaper).length
        const currentSection = Object.values(questionPaper)[sectionAndQuestion['section']]
        const questionsInCurrentSection = Object.values(currentSection)[0].length - 1
        if (sectionAndQuestion['question'] < questionsInCurrentSection) {
            setSectionAndQuestion({
                'question': sectionAndQuestion['question'] + 1,
                'section': sectionAndQuestion['section']
            })
        } else {
            if (sectionAndQuestion['section'] < totalSections - 1) {
                setSectionAndQuestion({
                    'question': 0,
                    'section': sectionAndQuestion['section'] + 1
                })
            }
        }
    }


    const handlePrevQuestionChange = (qId, answer) => {
        questionVisited(qId)
        if (answer !== "") {
            setAnswers({
                ...answers,
                [qId]: answer
            })
        }

        setQuestionBarUpdate(questionBarUpdate + 1)
        if (sectionAndQuestion['question'] > 0) {

            setSectionAndQuestion({
                'question': sectionAndQuestion['question'] - 1,
                'section': sectionAndQuestion['section']
            })

        } else {
            if (sectionAndQuestion['section'] > 0) {
                const prevSection = Object.values(questionPaper)[sectionAndQuestion['section'] - 1]
                const questionsInPrevSection = Object.values(prevSection)[0].length - 1
                setSectionAndQuestion({
                    'question': questionsInPrevSection,
                    'section': sectionAndQuestion['section'] - 1
                })
            }
        }

    }

    /*This method handles the logic when user tries to take mouse from current document
    */
    const handleMouseLeave = (e) => {
        if (warningCount === 3) {
            setSubmitClicked(true)
            return;
        }
        setWarningCount(warningCount + 1)
        setWarningMessage('Your Mouse is Leaving the examination window')
        setWarningModalOpen(true)
    }

    const handleKeyDown = (e) => {
        if (warningCount === 3) {
            setSubmitClicked(true)
            return;
        }
        e.preventDefault()
        setWarningCount(warningCount + 1)
        setWarningMessage('Trying to press a key')
        setWarningModalOpen(true)
    }

    if (message !== "") {
        return <div>{message}</div>
    }
    else if (loading || questionPaper === null) {
        return <div> <img src="images/loading.gif" alt="loading..." height={500} width={500} /></div>
    }
    else if (timeup || submitClicked) {
        if (submissionStatus === null) {
            return <div className="answerSubmissionLoading">
                <div>
                    <h2 className="submissionInfo">Please Wait we are Submitting your answers</h2>
                    <CircularProgress color="primary" style={{ width: "200px", height: "300px" }} />
                </div>
            </div>
        }
        else if (submissionStatus === false) {
            return <div className="formErrors" style={{ textAlign: "center" }}><h3>Submission failed</h3></div>
        } else {
            return <div style={{ textAlign: "center", color: "green" }}><h3>Submission Successful</h3></div>
        }
    }
    return (<div className="examContainer"
        onContextMenu={(e) => e.preventDefault()}
        onMouseLeave={handleMouseLeave} tabIndex={0} onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()} onKeyDown={handleKeyDown}
        ref={elem => setFocus(elem)}
    >
        <WarningModal openModal={warningModalOpen} setOpenModal={setWarningModalOpen}
            warningMessage={warningMessage} warningCount={warningCount}
            setSubmitClicked={setSubmitClicked}
        />

        <ExamHelpModal helpModalOpen={helpModalOpen} setHelpModalOpen={setHelpModalOpen} />

        <div className="questionBarContainer" >
            <QuestionBar questionPaper={questionPaper}
                setSectionAndQuestion={setSectionAndQuestion}
                answers={answers}
                questionsForReview={questionsForReview}
                sectionAndQuestion={sectionAndQuestion}
                visitedQuestions={visitedQuestions}
                setVisitedQuestions={setVisitedQuestions}
                setHelpModalOpen={setHelpModalOpen}
            />
        </div>
        <div className="questionContainerContainer">
                <QuestionContainer
                    handleNextQuestionChange={handleNextQuestionChange}
                    sectionAndQuestion={sectionAndQuestion} questionPaper={questionPaper}
                    lastQuestion={lastQuestion}
                    handlePrevQuestionChange={handlePrevQuestionChange}
                    firstQuestion={firstQuestion}
                    answers={answers}
                    setAnswers={setAnswers}
                    handleMarkForReview={handleMarkForReview}
                    examDetails={examDetails}
                    setTimeup={setTimeup}
                    handleSubmitExam={handleSubmitExam}
                    visitedQuestions={visitedQuestions}
                    setVisitedQuestions={setVisitedQuestions}
                    setIsSubmitModalOpen={setIsSubmitModalOpen}
                />
        </div>
        <div className=".clr-fix"></div>
    </div >)
}