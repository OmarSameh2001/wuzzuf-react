import { useParams } from "react-router";
import ProcessColumn from "../../../components/companyProcess/ProcessColumn";
import ProcessCard from "../../../components/companyProcess/ProcessCard";
import { useState } from "react";
import JobDetails from "../../../components/job/JobDetails";

function SingleJob() {
    const phases = ["Applied", "Technical Assessment", "Technical Interview", "Hr Interview", "Offer"];
    const { id } = useParams();
    const [clickedColumn, setClickedColumn] = useState(1);
    
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            maxWidth: '100vw',
            backgroundColor: '#f8f9fa' // Light background to contrast with the theme
        }}>
            <JobDetails 
                style={{
                    border: `2px solid #901b20`,
                    borderRadius: '8px',
                    padding: '20px',
                    margin: '20px 0',
                    width: '90%'
                }}
            />
            <ProcessColumn 
                setter={setClickedColumn} 
                column={clickedColumn} 
                phases={phases}
                style={{
                    backgroundColor: '#901b20',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    margin: '10px 0'
                }}
            />
            <ProcessCard 
                column={clickedColumn} 
                phases={phases}
                style={{
                    border: `1px solid #901b20`,
                    borderRadius: '5px',
                    padding: '15px',
                    width: '90%',
                    marginBottom: '20px'
                }}
            />
        </div>
    )
}

export default SingleJob;