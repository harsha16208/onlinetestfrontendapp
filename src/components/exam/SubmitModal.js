import ReactDOM from 'react-dom'


function SubmitModal({ setOpenModal, openModal, handleExamSubmit, setIsSubmitModalOpen }) {

    if (!openModal) {
        return null
    }


    return ReactDOM.createPortal(
        <>
            <div className='ModalOverlay'></div>
            <div className='ModalContainer'>
                <div className='submitModalInfo'>
                    Time left !
                    Would you still like to submit ?
                </div>
                <div className='ButtonsContainer'>
                    <button className='ModalButton ConfirmButton' onClick={handleExamSubmit}>Confirm</button>
                    <button className='ModalButton CloseButton' onClick={() => {
                        const root = document.getElementById('root')
                        if (root.requestFullscreen) {
                            root.requestFullscreen()
                        }
                        setOpenModal(false)
                        setIsSubmitModalOpen(false)
                    }}>close</button>
                </div>
            </div>
        </>,
        document.getElementById('portal')
    )
}

export default SubmitModal
