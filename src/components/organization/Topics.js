import { Button, Stack, TextField } from "@mui/material"
import { useEffect, useState } from "react"

export default function Topics({ noOfTopics, setFormData, formData }) {

    const [topicFormData, setTopicFormData] = useState({})
    const [errorData, setErrorData] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    const arr = []
    for (let i = 0; i < noOfTopics; i++) {
        arr.push(i)
    }

    useEffect(() => {
        if (Object.keys(errorData).length === 0 && isSubmitted) {
            const noOfQuestionsPerTopic = {}
            const noOfQuestionsPerTopicInExam = {}
            const topics = []
            const counts = []
            const examCounts = []

            for (const [key, value] of Object.entries(topicFormData)) {
                if (key.startsWith("topic")) {
                    topics.push(value)
                }
                if (key.startsWith("count")) {
                    counts.push(parseInt(value))
                }
                if (key.startsWith("examCount")) {
                    examCounts.push(parseInt(value))
                }
            }

            for (let i = 0; i < topics.length; i++) {
                noOfQuestionsPerTopic[topics[i]] = counts[i]
                noOfQuestionsPerTopicInExam[topics[i]] = examCounts[i]
            }

                setFormData({ ...formData, ['noOfQuestionsPerTopic']: noOfQuestionsPerTopic , ['noOfQuestionsPerTopicInExam'] : noOfQuestionsPerTopicInExam })
        }


        if (Object.keys(topicFormData).length === 0) {
            const data = {}
            for (let i = 0; i < noOfTopics; i++) {
                data[`topic ${i}`] = ''
                data[`count ${i}`] = 0
                data[`examCount ${i}`] = 0
            }
            setTopicFormData(data)
        }

    }, [errorData, isSubmitted])

    const handleChange = ({ target }) => {
        const { name, value } = target
        setTopicFormData({ ...topicFormData, [name]: value })
    }

    const handleSubmit = e => {
        e.preventDefault()
        setErrorData(verify(topicFormData))
        setIsSubmitted(true)
    }

    const verify = data => {
        const errors = {}
        for (const [key, value] of Object.entries(data)) {
            if (key.startsWith("topic")) {
                const valueTrimmed = value.trim()
                if (valueTrimmed === "") {
                    errors[key] = "*required"
                }
            }
            else if (value === 0) {
                errors[key] = "*required"
            }
        }

        let totalSum = 0
        for (const [key, value] of Object.entries(data)) {
            if (key.startsWith("count")) {
                totalSum += parseInt(value)
            }
        }

        if (totalSum !== parseInt(formData.numberOfQuestions)) {
            errors.common = `*The total number of required questions are ${formData.numberOfQuestions}`
        }

        let sum = 0
        for (const [key, value] of Object.entries(data)) {
            if (key.startsWith("examCount")) {
                sum += parseInt(value)
            }
        }

        if (sum !== parseInt(formData.numberOfQuestionsInExam)) {
            errors.common = `*The total number of required questions in exam are ${formData.numberOfQuestionsInExam}`
        }

        return errors
    }

    return (<>
        {
            arr.map(i => {
                return (<Stack spacing={1} key={i}>
                    <TextField placeholder="Enter topic name" label="Topic name" name={`topic ${i}`}
                        value={topicFormData[`topic ${i}`] === undefined ? "" : topicFormData[`topic ${i}`]} onChange={handleChange}
                    />
                    <p className="createExam_formErrors">{errorData[`topic ${i}`]}</p>
                    <TextField type={"number"} label="Number of questions"
                        placeholder="Enter number of questions for the topic"
                        value={topicFormData[`count ${i}`] === undefined ? 0 : topicFormData[`count ${i}`]}
                        onChange={handleChange}
                        name={`count ${i}`}
                        InputLabelProps={{
                            shrink: true,
                        }} />
                    <p className="createExam_formErrors">{errorData[`count ${i}`]}</p>
                    <TextField type={"number"} label="Number of questions in exam"
                        placeholder="Enter number of questions you want in exam for the topic"
                        value={topicFormData[`examCount ${i}`] === undefined ? 0 : topicFormData[`examCount ${i}`]}
                        onChange={handleChange}
                        name={`examCount ${i}`}
                        InputLabelProps={{
                            shrink: true,
                        }} />
                    <p className="createExam_formErrors">{errorData[`examCount ${i}`]}</p>
                </Stack>
                )
            })
        }
        <p className="createExam_formErrors">{errorData.common}</p>
        <Button color="secondary" variant="outlined" onClick={handleSubmit}>Verify</Button>
    </>)
}