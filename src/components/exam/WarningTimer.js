import React, { useEffect, useState } from 'react'

function WarningTimer({setSubmitClicked}) {
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(20)

    useEffect(() => {
        const timerInterval = setInterval(() => {
                if (minutes === 0 && seconds === 0) {
                    setSubmitClicked(true)
                } else {
                    setSeconds(seconds - 1)
                }
        }, 1000)

        return () => clearInterval(timerInterval)
    }, [minutes, seconds])
    return (
        <div className='WarningTimerContainer'>
            <h1 className="formErrors">{minutes < 10 ? `0${minutes}` : minutes} : {seconds < 10 ? `0${seconds}` : seconds}</h1>
        </div>

    )
}

export default WarningTimer
