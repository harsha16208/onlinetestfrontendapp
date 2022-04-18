import { ExamDetails } from "../Actions/Actions"

const initialState = {}

export const examDetailsReducer = (state = initialState, action) => {
    switch(action.type){
        case ExamDetails:
            return {
                ...state,
                examDetails : action.payload
            }
        default:
            return initialState
    }
}