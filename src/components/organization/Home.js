import { Button, Grid } from "@mui/material"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { LocationContext } from "./Organization"
import PasswordModal from "../common/PasswordModal"
import SettingsIcon from '@mui/icons-material/Settings';


export default function Home() {

    document.title = 'Home'

    const orgId = useSelector(state => state.userDetails.userDetails.userDetails.organizationId)

    const [loading, setLoading] = useState(false)
    const [homeData, setHomeData] = useState([])
    const setLocation = useContext(LocationContext)
    const currLocation = useLocation().pathname
    const [openPasswordModal, setOpenPasswordModal] = useState(false)

    const handlePasswordModal = () => {
        setOpenPasswordModal(true)
    }


    useEffect(() => {
        setLocation(currLocation)
        setLoading(true)

        const token = localStorage.getItem("jwtToken")

        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.get(`/gethomedetails/${orgId}`, config)
            .then(dt => {
                setHomeData(dt.data)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })
    }, [])


    if (loading) {
        return <div className="HomeLoading"> <img  className="loading_img" src="images/loadingballs.gif" alt="loading..." /></div>
    }

    return (<div className="homeContainer">
        <Button variant="contained" color="secondary"
            style={{ marginLeft: "10px" }}
            onClick={handlePasswordModal}><SettingsIcon /> Change Password</Button>
        <PasswordModal isModalOpen={openPasswordModal} setIsModalOpen={setOpenPasswordModal} />
        <Grid container columnSpacing={3} rowSpacing={10} sx={{ pt: 2, pl: 2 }}
            direction="row"
            justifyContent={"center"}
            alignItems={"center"}
        >

            <Grid item xs={12} sm={6} lg={3}  >
                <div className="ExamsCreatedCard HomeCard">
                    <div className="title">
                        Exams created
                    </div>
                    <div className="value">{homeData.examsCreated}</div>
                </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}  >
                <div className="QuestionsPostedCard HomeCard">
                    <div className="title">
                        Questions Posted
                    </div>
                    <div className="value">{homeData.questionsPosted}</div>
                </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}  >
                <div className="QuestionsToBePostedCard HomeCard">
                    <div className="title">
                        Questions To be Posted
                    </div>
                    <div className="value">{homeData.questionsNotPosted}</div>
                </div>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}  >
                <div className="RegisteredStudentsCard HomeCard">
                    <div className="title">
                        Total registered students
                    </div>
                    <div className="value">{homeData.registeredCandidates}</div>
                </div>
            </Grid>

        </Grid>

        <div className="ChartContainer">

        </div>
    </div >)
}