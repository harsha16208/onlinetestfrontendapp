export default function ExamHelpModal({ helpModalOpen, setHelpModalOpen }) {

    if (!helpModalOpen) {
        return null;
    }

    return (<>
        <div className='ModalOverlay'></div>
        <div className='ModalContainer'>
            <div className="exam-info">
                <p className="otpTimerInfo">Info About Answer colors</p>
                <div className="infodivContainer"><div className="currentQuestion infodiv"></div><span>Current Question</span></div>
                <div className="infodivContainer"><div className="markAsReview infodiv"></div><span>Mark as review</span></div>
                <div className="infodivContainer"><div className="answered infodiv"></div><span>Answered</span></div>
                <div className="infodivContainer"><div className="visitedAndUnanswered infodiv"></div><span>Visited and Unanswered</span></div>
                <div className="infodivContainer"><div className="Unvisited infodiv"></div><span>Unvisited</span></div>
            </div>
            <div className='ButtonsContainer'>
                <button className='ModalButton CloseButton' onClick={() => setHelpModalOpen(false)}>Close</button>
            </div>
        </div>
    </>)
}