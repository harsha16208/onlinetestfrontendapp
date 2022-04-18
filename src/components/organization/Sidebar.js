import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { options } from "./Options"

export default function Sidebar({ location, sidebarTop, setSidebarOpen }) {

    const organizationName = useSelector(state => state.userDetails.userDetails.userDetails.organizationName)

    return (<div className="sidebar">
        {sidebarTop ?
            <div className="sidebarTopContainer"><button className="sidebarTopClose"
                onClick={() => setSidebarOpen(false)}>x</button></div> : null}
        <div className="sidebarNameContainer"><h2 className="sidebarName">{organizationName}</h2></div>
        <ul className="sidebarOptionsList">
            {
                options.map((option, index) => {
                    return (
                        <li key={index}
                            className={option.link === location ? "sidebarOptionActive"
                                : "sidebarOption"}>
                            <Link to={option.link}>
                                {option.icon}
                                <span className="sidebaroptiontitle">{option.title}</span>
                            </Link>
                        </li>
                    )
                })
            }
        </ul>
    </div>)
}