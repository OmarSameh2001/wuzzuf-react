import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import JobCreate from './components/job/JobCreate';
import { ProfileProvider } from "./context/ProfileContext";
import { ComProfileProvider } from "./context/ComProfileContext";
import { UserContextProvider } from "./context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AxiosProvider from "./services/AxiosProvider";
import Login from './pages/login/Login';
import VerifyOTP from "./pages/otp/VerifyOTP"; 
import ForgotPassword from "./pages/login/ForgotPassword";
import ResetPassword from "./pages/login/ResetPassword";
import TalentProfile from "./pages/company/talents/TalentProfile";
import ComProfile from "./pages/company/profile/ComProfile";
import EditPersonalCom from "./pages/company/profile/edit-profile/EditPersonalCom.jsx";
import Users from "./admin/Users.jsx";
// import Dashboard from "./admin/Dashboard.jsx";
// import Jobseekers from "./admin/Jobseekers.jsx";
// import Companies from "./admin/Companies.jsx";



function App() {
  const Home = React.lazy(() => import("./pages/home/Home"));
  const UserJobs = React.lazy(() => import("./pages/user/jobs/Jobs"));
  const CompanyJobs = React.lazy(() => import("./pages/company/jobs/Jobs"));
  const UserHome = React.lazy(() => import("./pages/user/home/Home"));
  const CompanyHome = React.lazy(() => import("./pages/company/home/Home"));
  const UserProfile = React.lazy(() =>
    import("./pages/user/profile/userProfile")
  );
  const EditPersonal = React.lazy(() =>
    import("./pages/user/profile/edit-profile/edit-personal")
  );
  const EditEducation = React.lazy(() =>
    import("./pages/user/profile/edit-profile/edit-education")
  );
  const EditExperience = React.lazy(() =>
    import("./pages/user/profile/edit-profile/edit-experience")
  );
  const EditSkills = React.lazy(() =>
    import("./pages/user/profile/edit-profile/edit-skills")
  );
  const EditCV = React.lazy(() =>
    import("./pages/user/profile/edit-profile/edit-cv")
  );
  const UserSaved = React.lazy(() => import("./pages/user/saved/Saved"));
  const UserApplications = React.lazy(() =>
    import("./pages/user/applications/Applications")
  );
  const UserSingleApplications = React.lazy(() =>
    import("./pages/user/singleApplication/SingleApplication")
  );
  const JobApplication = React.lazy(() =>
    import("./pages/user/applications/Applications")
  );
  const Login = React.lazy(() => import("./pages/login/Login"));
  const Register = React.lazy(() => import("./pages/register/Register"));
  const CompanyTalents = React.lazy(() =>
    import("./pages/company/talents/Talents")
  
  );
  const SingleJob = React.lazy(() => import("./pages/company/jobs/SingleJob"));
  const UserSingleJob = React.lazy(() => import("./pages/user/jobs/UserSingleJob"));
  const ApplicationForm = React.lazy(() => import("./pages/user/jobs/ApplicationForm"));
  // // const RegisterCompany = React.lazy(() => import("./pages/register/RegisterCompany"));
  const RecommendedJobs = React.lazy(() => import("./pages/user/jobs/RecomJobs"));
  const TalantProfile = React.lazy(() =>
    import("./pages/company/talents/TalentProfile")
  );
  const JobsDashboard  = React.lazy(() =>
    import("./pages/company/jobs/JobsDashboard")
  );

  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <ProfileProvider>
            <ComProfileProvider>
            <UserContextProvider>
              <AxiosProvider>
                <Navbar />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    maxWidth: "100vw",
                    backgroundColor: "#f5f6f7",
                  }}
                >
                  <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/admin/users" element={<Users />} />
                      {/* <Route path="/admin/dashboard" element={<Dashboard />} />
                      <Route path="/admin/jobseekers" element={<Jobseekers />} />
                      <Route path="/admin/companies" element={<Companies />} /> */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/verify-otp" element={<VerifyOTP />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password/:email" element={<ResetPassword />} />
                      <Route path="/applicant" element={<UserHome />} />
                      <Route path="/applicant/jobs" element={<UserJobs />} />
                      <Route path="/applicant/saved" element={<UserSaved />} />
                      <Route
                        path="/applicant/applications"
                        element={<UserApplications />}
                      />
                      <Route
                        path="/applicant/applications/:id"
                        element={<JobApplication />}
                      />
                      <Route path="/company" element={<CompanyHome />} />
                      <Route path="/company/jobs" element={<CompanyJobs />} />
                      <Route path="/company/jobs/jobsDashboard" element={<JobsDashboard />} />
                      <Route path="/company/jobs/:id" element={<SingleJob />} />

                      <Route
                        path="/company/talents"
                        element={<CompanyTalents />}
                      />
                      <Route path="/company/talents/TalentProfile/" element={<TalantProfile />} />
         

                      <Route path="/company/jobCreate" element={<JobCreate />} />
                      <Route path="/company/jobEdit/:jobId" element={<JobCreate />} />
                      {/* <Route path="/company/register" element={<RegisterCompany />} /> */}
                      <Route path="/applicant/jobs/:jobId" element={<UserSingleJob />} />
                      <Route path="/application-form" element={<ApplicationForm />} />


                      {/* Applicant Profile */}
                      <Route
                        path="/applicant/profile"
                        element={<UserProfile />}
                      />
                      <Route
                        path="/applicant/profile/edit-personal"
                        element={<EditPersonal />}
                      />
                      <Route
                        path="/applicant/profile/edit-education"
                        element={<EditEducation />}
                      />
                      <Route
                        path="/applicant/profile/edit-experience"
                        element={<EditExperience />}
                      />
                      <Route
                        path="/applicant/profile/edit-skills"
                        element={<EditSkills />}
                      />
                      <Route
                        path="/applicant/profile/edit-cv"
                        element={<EditCV />}
                      />
                      <Route 
                        path="/applicant/profile/recom" 
                        element={<RecommendedJobs />} 
                      />

                      {/* Company Profile */}
                      <Route 
                        path="/company/profile/" 
                        element={<ComProfile />} 
                      />
                      <Route
                        path="/company/profile/edit-personal"
                        element={<EditPersonalCom />}
                      />
                    </Routes>
                    
                  </Suspense>
                </div>
                <Footer />
              </AxiosProvider>
            </UserContextProvider>
            </ComProfileProvider>
          </ProfileProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
