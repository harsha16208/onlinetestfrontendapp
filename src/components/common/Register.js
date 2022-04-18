import { useState } from "react"
import CandidateForm from "./CandidateForm"
import OrganizationForm from "./OrganizationForm"
import "./styles/Register.css"

export default function Register() {

    const [Role, setRole] = useState("candidate")

    const changeRole = (role) => {
        setRole(role)
    }

    return (
        <div className="register">
            <div className="register_card">
                <div className="register_info">
                    <h3>Select the type of user</h3>
                </div>
                <div className="register_card_top">
                    <div onClick={() => changeRole("organization")} className={Role === 'organization' ? 'role_option_active' : 'role_option'}><h2>Organization</h2></div>
                    <div onClick={() => changeRole("candidate")} className={Role === 'candidate' ? 'role_option_active' : 'role_option'}><h2>Candidate</h2></div>
                </div>
                <hr />
                <div className="register_card_bottom">
                    {Role === "candidate" ? <CandidateForm /> : <OrganizationForm />}
                </div>
            </div>
        </div>
    )
}