import { LoginAction } from "../Actions/Actions"

export default function LoginActionCreator (userDetails){
    return {
        type: LoginAction,
        payload: userDetails
    }
}