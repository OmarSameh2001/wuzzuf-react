import { Button } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import { createApplication } from "../../services/Application";
import { useContext } from "react";
import { userContext } from "../../context/UserContext";
import { useNavigate } from "react-router";

function ApplicantFooter({type, job_id}) {
    const {user} = useContext(userContext)
    const navigate = useNavigate()
    async function handleClick(){
        const application = {
            "user": `${user.id}`,
            "job": `${job_id}`,
            "status": `1`,
        };
        const res = await createApplication(application)
        console.log(res)
        navigate()
    }
    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            {type != 'saved' && <Button variant="text" startIcon={<SaveIcon/>} onClick={()=>handleClick()}>
                Save
            </Button>}
            <Button variant="text" startIcon={<SendIcon />} onClick={()=>handleClick()}>
                Apply
            </Button>
        </div>
    );
}

export default ApplicantFooter;
