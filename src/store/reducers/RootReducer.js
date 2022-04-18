import { combineReducers } from "redux";
import { examDetailsReducer} from './ExamDetailsReducer'
import { userDetailsReducer } from "./UserDetailsReducer";


export const rootReducer = combineReducers({
    examDetails : examDetailsReducer,
    userDetails : userDetailsReducer
})