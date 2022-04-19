import "./styles/Organization.css"
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ExamDetailsAction from "../../store/actioncreators/ExamDetailsAction";
import axios from "axios";
import React from "react";

export const LocationContext = React.createContext()

export default function Organization(props) {

    const dispatch = useDispatch()
    const orgId = useSelector(state => state.userDetails.userDetails.userDetails.organizationId)
    const [location, setLocation] = useState("/home")
    const org = useSelector(state => state.userDetails.userDetails.userDetails)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [sidebarTop, setSidebarTop] = useState(false)



    useEffect(() => {
        const reloadCount = sessionStorage.getItem('reloadCount');
        if (reloadCount < 2) {
            sessionStorage.setItem('reloadCount', String(reloadCount + 1));
            window.location.reload();
        } else {
            sessionStorage.removeItem('reloadCount');
        }

        const token = localStorage.getItem("jwtToken")
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        axios.get(`/getexamdetails/${orgId}`, config)
            .then(dt => {
                const data = dt.data
                dispatch(ExamDetailsAction(data))
            })
            .catch(err => {
                console.log(err)
            })

        const handleResize = () => {
            if (window.innerWidth < 1100) {
                setSidebarOpen(false)
                setSidebarTop(true)
            } else {
                setSidebarTop(false)
                setSidebarOpen(true)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)

        return () => window.removeEventListener("resize", handleResize)
    }, []);


    if (!org.accessGiven) {

        return <div className="NoAccessOrg">
            <h1 style={{ color: "red" }}>Your Account Needs Access from ADMIN</h1>
            <p className="otpTimerInfo"><Link to={"/logout"}>Logout</Link></p>
        </div>
    }


    return (
        <div className="main-body">
            {sidebarOpen ?
                <div className={sidebarTop ? "organizationSidebarContainerTop" : "organizationSidebarContainer"}>
                    <Sidebar location={location} sidebarTop={sidebarTop} setSidebarOpen={setSidebarOpen} />
                </div> :
                null}
            <div className={sidebarTop ? "mainContainerSidebarClose" : sidebarOpen ?
                "mainContainer" : "mainContainerSidebarClose"} >
                <div className="Navbar">
                    <div className="sidebar_menu_icon">
                        <MenuTwoToneIcon fontSize="large" style={{ color: "#fff" }}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        />
                    </div>
                    <div className='logoutContainer'>
                        <Link to="/logout"><PowerSettingsNewIcon style={{ color: "white", fontSize: "30px", fontWeight: "800", padding: "20px" }} /> </Link>
                    </div>
                </div>
                <div className="mainContentContainer">
                    <LocationContext.Provider value={setLocation}>
                        {props.component}
                    </LocationContext.Provider>
                </div>
            </div>
            <div className="clr-fix"></div>
        </div>
    )
}