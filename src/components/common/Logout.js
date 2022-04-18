/*
    Remove the authentication token from the local storage and redirect to home page
*/

import { Redirect } from "react-router-dom"

export default function Logout(){
    
    localStorage.removeItem('persist:persist')    
    localStorage.removeItem('jwtToken')
    return <Redirect to={{
        pathname: "/",
        state:{
            "message": "You have Logged out succsessfully"
        }
    }} />
}