import React from 'react'
import WarningTimer from './WarningTimer'
import ReactDOM from 'react-dom'

function WarningModal({ openModal, setOpenModal, warningMessage, warningCount, setSubmitClicked }) {
    if (!openModal) {
        return null
    }
    return ReactDOM.createPortal(
        <>

            <div className='ModalOverlay'></div>
            <div className='ModalContainer'>
                <p className='formErrors'>Exam will be Submitted If You doesn't click on close before time expires</p>
                <WarningTimer setSubmitClicked={setSubmitClicked} />
                <div className='message'>
                    <p>{warningMessage}</p>
                    <p className='formErrors'>Remaining Chances : {3-warningCount}</p>
                </div>
                <div className='ButtonsContainer'>
                    <button className='ModalButton CloseButton' onClick={(e) => {setOpenModal(false)}}>close</button>
                </div>
            </div>
        </>
    , document.getElementById('portal'))
}

export default WarningModal
