import { Button, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"
import { LocationContext } from "./Candidate"
import EditModal from "./EditModal"
import UpdateDetails from "./UpdateDetails"
import SettingsIcon from '@mui/icons-material/Settings';
import PasswordModal from "../common/PasswordModal"


export default function Home() {

    const setLocation = useContext(LocationContext)

    const currLocation = useLocation().pathname
    
    const userDetails = useSelector(state => state.userDetails.userDetails.userDetails)
    const [openPasswordModal, setOpenPasswordModal] = useState(false)
    const [editRequest, setEditRequest] = useState(false)

    const state = useSelector(state =>  state)

    console.log(state)

    useEffect(() => {
        setLocation(currLocation)
        const reloadCount = sessionStorage.getItem('reloadCount');
        if (reloadCount < 2) {
            sessionStorage.setItem('reloadCount', String(reloadCount + 1));
            window.location.reload();
        } else {
            sessionStorage.removeItem('reloadCount');
        }
    }, [])

    const handleModal = () => {
        setEditRequest(true)
        // setIsModalOpen(true)
    }

    const handlePasswordModal = () => {
        setOpenPasswordModal(true)
    }

    if (editRequest) {
        return (
            <UpdateDetails setEditRequest={setEditRequest} />
        )
    }

    return (<div className="candidateHomeContainer">
        <Button variant="contained" color="warning" onClick={handleModal}>Edit Details</Button>
        <Button variant="contained" color="secondary"
            style={{ marginLeft: "10px" }}
            onClick={handlePasswordModal}><SettingsIcon /> Change Password</Button>
        
        <PasswordModal isModalOpen={openPasswordModal} setIsModalOpen={setOpenPasswordModal} />
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Candidate Id</TableCell>
                        <TableCell>{userDetails.candidateId}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Mail</TableCell>
                        <TableCell>{userDetails.username}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>{userDetails.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Mobile</TableCell>
                        <TableCell>{userDetails.mobile}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Date of Birth</TableCell>
                        <TableCell>{userDetails.dateOfBirth.split('T')[0]}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>

    </div>)
}