import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import RateReviewTwoToneIcon from '@mui/icons-material/RateReviewTwoTone';
import LibraryAddCheckTwoToneIcon from '@mui/icons-material/LibraryAddCheckTwoTone';
import MilitaryTechTwoToneIcon from '@mui/icons-material/MilitaryTechTwoTone';
import EditIcon from '@mui/icons-material/Edit';

export const options = [
    {
        title: "Home",
        icon: <HomeTwoToneIcon />,
        link: "/candidate/home"
    },
    {
        title: "Exams Applied",
        icon: <LibraryAddCheckTwoToneIcon />,
        link: "/examsapplied"
    },
    {
        title: "Results",
        icon: <MilitaryTechTwoToneIcon />,
        link: "/candidateresults"
    },
    {
        title: "My Exams",
        icon: <RateReviewTwoToneIcon />,
        link: "/myexams"
    },
    {
        title: "Apply For an Exam",
        icon: <EditIcon />,
        link: "/applyforexam"
    }
]