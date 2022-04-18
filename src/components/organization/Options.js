import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import FilterAltTwoToneIcon from '@mui/icons-material/FilterAltTwoTone';
import DynamicFeedTwoToneIcon from '@mui/icons-material/DynamicFeedTwoTone';

export const options = [
    {
        title : "Home",
        icon : <HomeTwoToneIcon style = {{ fontSize: "25px" }} />,
        link : "/home"
    },
    {
       title : "Create Exam",
       icon : <AddCircleTwoToneIcon style = {{ fontSize: "25px" }} />,
       link :  "/createexam"
    },
    {
        title : "Trigger Mails",
        icon : <MailTwoToneIcon style = {{ fontSize: "25px" }} />,
        link : "/triggeremail"
    },
    {
        title : "Results and Filter",
        icon : <FilterAltTwoToneIcon style = {{ fontSize: "25px" }} />,
        link : "/filtercandidates"
    },
    {
        title: "Post Questions",
        icon: <DynamicFeedTwoToneIcon style = {{ fontSize: "25px" }} />,
        link: "/postquestions"
    }
]