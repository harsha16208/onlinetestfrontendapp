import { useContext, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import ExamDetails from "./ExamDetails"
import MailContainer from "./MailContainer"
import { LocationContext } from "./Organization"

export default function TriggerMails() {

    const setLocation = useContext(LocationContext)
    const currLocation = useLocation().pathname
    const [examId, setExamId] = useState(null)

    useEffect(() => {
        setLocation(currLocation)
    }, [])

    if (examId === null) {
        return <ExamDetails setExamId={setExamId} />
    }

    return <MailContainer examId={examId} setExamId={setExamId} />
}