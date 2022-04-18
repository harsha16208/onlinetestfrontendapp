import React, { useEffect, useState } from 'react'

function OtpTimer({ handleTimeUp }) {

    const [minutes, setMinutes] = useState(10)
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {

        const timer = setInterval(() => {
            if (minutes === 0 && seconds === 0) {
                handleTimeUp()
            } else {
                if (seconds === 0) {
                    setSeconds(59)
                    setMinutes(minutes - 1)
                } else {
                    setSeconds(seconds - 1)
                }
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [minutes, seconds])

    return (
        <div className='otpTimer'>
            <h3>{minutes < 10 ? `0${minutes}` : minutes} : {seconds < 10 ? `0${seconds}` : seconds}</h3>
        </div>
    )
}

export default OtpTimer
