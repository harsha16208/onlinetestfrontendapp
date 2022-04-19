import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';


export const LocationContext = React.createContext()

export default function Candidate({ component }) {

    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [sidebarTop, setSidebarTop] = useState(false)
    const [location, setLocation] = useState("/candidate/home")

    useEffect(() => {

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
    }, [])



    return (
        <div className="main-body">
            {sidebarOpen ? <div className={sidebarTop ? "candidateSidebarContainerTop" : "candidateSidebarContainer"}>
                <Sidebar location={location} sidebarTop={sidebarTop} setSidebarOpen={setSidebarOpen} />
            </div> : null}
            <div className={sidebarTop ? "mainContainerSidebarClose" : sidebarOpen ?
                "mainContainer" : "mainContainerSidebarClose"} >
                <div className="Navbar">
                    <div className="sidebar_menu_icon">
                        <MenuTwoToneIcon fontSize="large" style={{ color: "#fff" }}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        />
                    </div>
                    <div className='logoutContainer'>
                        <Link to="/logout"><PowerSettingsNewIcon sx={{ fontSize: "30px", fontWeight: "800", padding: "20px" }} /> </Link>
                    </div>
                </div>
                <div className="mainContentContainer">
                    <LocationContext.Provider value={setLocation}>
                        {component}
                    </LocationContext.Provider>
                </div>
            </div>
            <div className="clr-fix"></div>
        </div>
    )
}