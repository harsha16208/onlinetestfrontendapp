import { LoginAction, LogoutAction } from "../Actions/Actions"

const initialState = {}

export const userDetailsReducer = (state = initialState, action)=>{
    switch(action.type){
        case LoginAction:
            return {
                ...state,
                userDetails: action.payload
            }
        case LogoutAction:
            return initialState
        default:
            return state
    }
}

