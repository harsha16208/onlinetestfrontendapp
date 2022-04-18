import { useEffect, useState } from "react"

export default function Timer({ examDetails, setTimeup, timeup }) {

    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)
    const [timer, setTimer] = useState(false)
    const [danger, setDanger] = useState(false)

    useEffect(() => {
        const examDuration = parseInt(examDetails.duration)
        const examHours = Math.floor(examDuration / 60)
        const examMinutes = examDuration - hours * 60
        setHours(examHours)
        setMinutes(examMinutes)
        setSeconds(0)
        setTimer(true)
    }, [])

    useEffect(() => {
        const timerInterval = setInterval(() => {
            if (timer) {
                if (hours === 0 && minutes === 0 && seconds === 0) {
                    setTimeup(true)
                }
                if (minutes === 1 && seconds === 0) {
                    setDanger(true)
                }
                if (seconds === 0) {
                    if (minutes === 0) {
                        setHours(hours - 1)
                        setMinutes(59)
                    } else {
                        setSeconds(59)
                        setMinutes(minutes - 1)
                    }

                } else {
                    setSeconds(seconds - 1)
                }
            }
        }, 1000)

        return () => clearInterval(timerInterval)
    }, [hours, minutes, seconds])

    return (<div className="timer">
        {
            danger ?
            <h1 className="formErrors">{hours < 10 ? `0${hours}` : hours} : {minutes < 10 ? `0${minutes}` : minutes} : {seconds < 10 ? `0${seconds}` : seconds}</h1>
            :
            <h1>{hours < 10 ? `0${hours}` : hours} : {minutes < 10 ? `0${minutes}` : minutes} : {seconds < 10 ? `0${seconds}` : seconds}</h1>    
        }
    </div>)
}