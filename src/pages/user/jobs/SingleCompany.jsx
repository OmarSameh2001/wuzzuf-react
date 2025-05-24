import { useParams } from "react-router";
import CompanyBox from "../../../components/accounts/CompanyBox";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "../../../services/Auth";
import "../../../ComponentsStyles/job/job_details.css";
import { FaRegBuilding } from "react-icons/fa";
import UserJobs from "./Jobs";
import { useContext , useEffect , useState} from "react";
import { userContext  } from "../../../context/UserContext";
import "../../../styles/user/usersinglecompanyjob.css";
import Loading from "../../helpers/Loading";

const SingleCompany = () => {
  const { id } = useParams();
  const {isLight} = useContext(userContext);
  const [initialThemeLoaded, setInitialThemeLoaded] = useState(false);
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
  useEffect(() => {
    // Set initial theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setInitialThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (initialThemeLoaded) {
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
    }
  }, [isLight, initialThemeLoaded]);

  if (!initialThemeLoaded || companyLoading) {
    return <Loading minHeight="100vh" />;
  }

  if (companyError) {
    return <div>Error loading company data</div>;
  }


  console.log(company);
  return (
    <div className={`company-container ${isLight ? 'light' : 'dark'}`}>
    {company && (
      <div className="company-content-wrapper">
        <div className="company-profile-section">
          <div className="company-header-container">
            <div className="company-header-grid">
              <div className="company-logo-wrapper">
                <img
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  src={company.img || "https://static.thenounproject.com/png/3198584-200.png"}
                  alt={company.name}
                  className="company-logo"
                />
              </div>
              <div className="company-info-wrapper">
                <h1 className="company-title">
                  <FaRegBuilding className="company-icon" />
                  {company.name}
                </h1>
                {company.industry && (
                  <p className="company-industry">{company.industry}</p>
                )}
              </div>
            </div>
          </div>

          <div className="company-details-section">
            <CompanyBox profileData={company} />
          </div>
        </div>

        <div >
          <h2 className="jobs-section-title">Open Positions</h2>
          <UserJobs fixedCompany={company.id} />
        </div>
      </div>
    )}
  </div>
);
};

export default SingleCompany;
