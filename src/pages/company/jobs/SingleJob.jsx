import { useNavigate, useParams } from "react-router";
import ProcessColumn from "../../../components/companyProcess/ProcessColumn";
import ProcessCard from "../../../components/companyProcess/ProcessCard";
import { useState } from "react";
import JobDetails from "../../../components/job/JobDetails";
import { useQuery } from "@tanstack/react-query";
import { getJobById, patchJob } from "../../../services/Job";
import { Button } from "@mui/material";

function SingleJob() {
    const phases = ["Applied", "Technical Assessment", "Technical Interview", "Hr Interview", "Offer"]
    const { id } = useParams();
    const [clickedColumn, setClickedColumn] = useState(1);
    const navigate = useNavigate();

    const handleActivation = async (state) => {
      if (
        state === 0 &&
        window.confirm("Are you sure you want to deactivate this job?")
      ) {
        // Implement the deactivation logic here
        console.log("Deactivating job with ID:", id);
        const res = await patchJob(id, { status: 0 });
        console.log(res);
        refetch();
      } else if (
        state === 1 &&
        window.confirm("Are you sure you want to activate this job?")
      ) {
        // Implement the activation logic here
        console.log("Activating job with ID:", id);
        const res = await patchJob(id, { status: 1 });
        console.log(res);
        refetch();
      }
    };
  
    const {
      data: jobData,
      error: jobError,
      isLoading: jobLoading,
      refetch,
    } = useQuery({
      queryKey: ["job", id],
      queryFn: async () => {
        const res = await getJobById(id);
        console.log(res);
        return res;
      },
    });
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

export default SingleJob
