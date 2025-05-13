import { useParams } from "react-router";
import CompanyBox from "../../../components/accounts/CompanyBox";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "../../../services/Auth";
import "../../../ComponentsStyles/job/job_details.css";
import { FaRegBuilding } from "react-icons/fa";
import UserJobs from "./Jobs";
import { useContext } from "react";
import { userContext } from "../../../context/UserContext";

const SingleCompany = () => {
  const { id } = useParams();
  const {isLight} = useContext(userContext)
  const {
    data: company,
    error: companyError,
    isLoading: companyLoading,
    refetch: companyRefetch,
  } = useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const res = await getCompanyById(id);
      return res || {};
    },
  });
  console.log(company);
  return (
    <div>
      {company && (
        <>
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column',background: isLight ? '#fff' : '#121212'}}>
            <div className="job-header">
            <div className="company-logo-container">
              <img
                src={
                  company.img ||
                  "https://static.thenounproject.com/png/3198584-200.png"
                }
                alt={company.name}
                className="company-logo"
              />
            </div>

            <div className="job-title-container">
              <div className="company-info">
                <span
                  className="company-name"
                >
                  {/* <FaRegBuilding className="company-icon" /> */}
                  {company.name}
                </span>
              </div>
            </div>
          </div>
          <CompanyBox profileData={company} />
          </div>
          <UserJobs fixedCompany={company.id}/>
        </>
      )}
    </div>
  );
};

export default SingleCompany;
