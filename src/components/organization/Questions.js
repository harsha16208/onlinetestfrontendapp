import { Button, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField } from "@mui/material";
import { useState } from "react";

export default function Questions({ topic, questionNumber, setTopic, handleQuestionNumbersForward,
    buttonDisabled, handleQuestionNumbersBackward, setQuestionNumber, firstQuestion, maxQuestionNumber
}) {

    const [questionData, setQuestionData] = useState(firstQuestion)
    const [errorData, setErrorData] = useState({})

    const handleChange = ({ target }) => {
        const { name, value } = target
        setQuestionData({
            ...questionData,
            [name]: value
        })
    }

    const clearErrorData = () => {
        setErrorData({})
        handleQuestionNumbersBackward(questionNumber, setQuestionData)
    }

    const validate = () => {
        const errors = {}
        if (questionData.question === "" || questionData.question.trim().length === 0) {
            errors.question = "*required"
        }
        if (questionData.option1 === "" || questionData.option1.trim().length === 0) {
            errors.option1 = "*required"
        }
        if (questionData.option2 === "" || questionData.option2.trim().length === 0) {
            errors.option2 = "*required"
        }
        if (questionData.option3 === "" || questionData.option3.trim().length === 0) {
            errors.option3 = "*required"
        }
        if (questionData.option4 === "" || questionData.option4.trim().length === 0) {
            errors.option4 = "*required"
        }
        if (questionData.answer === "" || questionData.answer.trim().length === 0) {
            errors.answer = "*required"
        }

        if (Object.keys(errors).length === 0) {
            handleQuestionNumbersForward(questionNumber, questionData, setQuestionData)
            setErrorData(errors)
        }
        else
            setErrorData(errors)

    }

    return (<div className="postquestionContainer">
        <div><Button color={"error"}
            variant={"contained"}
            onClick={() => { setTopic(""); setQuestionNumber(1) }}>Change Topic</Button></div>
        <div className="QuestionTitle">
            <h1>Topic : {topic.toUpperCase()}</h1>
            <h3>Question Number : {questionNumber}</h3>
        </div>


        <Stack spacing={1}>
            <div>
                <p className="otpTimerInfo">Question</p>
                <pre className="sample">{questionData.question}</pre></div>
            <TextField name="question" placeholder="Enter Question" value={questionData.question}
                label="Question" onChange={handleChange}
                multiline={true}
                rows={4}
                color="success"
                focused={true}
            />
            <p className="formErrors">{errorData.question}</p>
            <div>
                <p className="otpTimerInfo">Option1</p>
                <pre className="sample">{questionData.option1}</pre></div>
            <TextField name={`option1`} placeholder={`Enter option 1`}
                label={`Option 1`} value={questionData.option1}
                multiline={true}
                rows={4}
                onChange={handleChange}
                style={{ width: "80%" }} focused={true}  />
            <p className="formErrors">{errorData.question}</p>
            <div>
                <p className="otpTimerInfo">Option2</p>
                <pre className="sample">{questionData.option2}</pre></div>
            <TextField name={`option2`} placeholder={`Enter option 2`}
                label={`Option 2`} value={questionData.option2}
                multiline={true}
                rows={4}
                onChange={handleChange} style={{ width: "80%" }} focused={true} />
            <p className="formErrors">{errorData.question}</p>
            <div>
                <p className="otpTimerInfo">option3</p>
                <pre className="sample">{questionData.option3}</pre></div>
            <TextField name={`option3`} placeholder={`Enter option 3`}
                label={`Option 3`} value={questionData.option3}
                multiline={true}
                rows={4}
                onChange={handleChange} style={{ width: "80%" }} focused={true} />
            <p className="formErrors">{errorData.question}</p>
            <div>
                <p className="otpTimerInfo">Option4</p>
                <pre className="sample">{questionData.option4}</pre></div>
            <TextField name={`option4`} placeholder={`Enter option 4`}
                label={`Option 4`} value={questionData.option4}
                multiline={true}
                rows={4}
                onChange={handleChange} style={{ width: "80%" }} focused={true} />
            <p className="formErrors">{errorData.question}</p>
            <FormLabel id="demo-radio-buttons-group-label">Answer</FormLabel>
            <RadioGroup
                row
                value={questionData.answer}
                name="answer"
                onChange={handleChange}
            >
                <FormControlLabel value={questionData.option1} control={<Radio />} label="option1" />
                <FormControlLabel value={questionData.option2} control={<Radio />} label="option2" />
                <FormControlLabel value={questionData.option3} control={<Radio />} label="option3" />
                <FormControlLabel value={questionData.option4} control={<Radio />} label="option4" />
            </RadioGroup>
            <p className="formErrors">{errorData.answer}</p>

            {maxQuestionNumber === 1 ? null :

                <div className="Questions_Buttons_container">
                    {
                        buttonDisabled.backward ? null :
                            <Button color="primary" variant="contained" onClick={clearErrorData}>Prev</Button>
                    }

                    {buttonDisabled.forward ? null :
                        <Button color="success" variant="contained" onClick={validate}>Add and Move to next</Button>
                    }
                </div>
            }
        </Stack>
    </div>)
}