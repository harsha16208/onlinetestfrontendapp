import { ExamDetails } from "../Actions/Actions";

export default function ExamDetailsAction(examDetails){
    return {
        type: ExamDetails,
        payload: examDetails
    }
}