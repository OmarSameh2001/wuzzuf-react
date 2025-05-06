import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import { ProfileProvider } from "./context/ProfileContext";

import { ComProfileProvider } from "./context/ComProfileContext";
import { UserContextProvider } from "./context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AxiosProvider from "./services/AxiosProvider";
import { Toaster } from "react-hot-toast";
import PopupChatBot from "./components/chatbot/PopUpChatBot.jsx";
import Loading from "./pages/helpers/Loading.jsx";
import CustomPopup from "./components/Popup/CustomPopup.jsx";
import CompanyProtected from "./ProtectedRoute/CompanyProtected.jsx";
import UserProtected from "./ProtectedRoute/UserProtected.jsx";
import AdminProtected from "./ProtectedRoute/AdminProtected.jsx";
import AccountProtected from "./ProtectedRoute/AccountProtected.jsx";

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
  const EditITI = React.lazy(() =>
    import("./pages/user/profile/edit-profile/edit-iti")
  );
  const UserSaved = React.lazy(() => import("./pages/user/saved/Saved"));
  const UserApplications = React.lazy(() =>
    import("./pages/user/applications/Applications")
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
  const UserSingleJob = React.lazy(() =>
    import("./pages/user/jobs/UserSingleJob")
  );
  const ApplicationForm = React.lazy(() =>
    import("./pages/user/jobs/ApplicationForm")
  );
  // // const RegisterCompany = React.lazy(() => import("./pages/register/RegisterCompany"));
  const RecommendedJobs = React.lazy(() =>
    import("./pages/user/jobs/RecomJobs")
  );
  const TalantProfile = React.lazy(() =>
    import("./pages/company/talents/TalentProfile")
  );
  // const JobsDashboard  = React.lazy(() =>
  //   import("./pages/company/jobs/JobsDashboard")
  // );
  const AdminCompany = React.lazy(() => import("./pages/admin/Companies.jsx"));
  const AdminItian = React.lazy(() => import("./pages/admin/Itian.jsx"));
  const ItiInfo = React.lazy(() => import("./pages/admin/ItiInfo.jsx"));

  const AdminRag = React.lazy(() => import("./pages/admin/Rag.jsx"));
  const VerifyOTP = React.lazy(() => import("./pages/otp/VerifyOTP"));
  const ForgotPassword = React.lazy(() =>
    import("./pages/login/ForgotPassword")
  );
  const ResetPassword = React.lazy(() => import("./pages/login/ResetPassword"));
  const ComProfile = React.lazy(() =>
    import("./pages/company/profile/ComProfile")
  );
  const EditPersonalCom = React.lazy(() =>
    import("./pages/company/profile/edit-profile/EditPersonalCom")
  );
  // const Users = React.lazy(() => import("./pages/admin/Users.jsx"));
  const JobCreate = React.lazy(() => import("./components/job/JobCreate"));
  const Accounts = React.lazy(() => import("./components/accounts/Accounts"));
  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <Toaster position="top-right" reverseOrder={false} />

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
                      position: "relative",
                      overflowX: "hidden",
                    }}
                  >
                    <Suspense fallback={<Loading />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                     
                        <Route
                          path="/forgot-password"
                          element={<AccountProtected><ForgotPassword /></AccountProtected>}
                        />
                        <Route path="/login" element={<AccountProtected><Login /></AccountProtected>} />
                        <Route
                          path="/reset-password/:email"
                          element={<AccountProtected><ResetPassword /></AccountProtected>}
                        />
                        <Route path="/register" element={<AccountProtected><Register /></AccountProtected>} />
                        <Route path="/verify-otp" element={<AccountProtected><VerifyOTP /></AccountProtected>} />
                        

                        <Route
                          path="/admin/companies"
                          element={<AdminProtected><AdminCompany /></AdminProtected>}
                        />
                        <Route path="/admin/rag" element={<AdminProtected><AdminRag /></AdminProtected>} />

                        <Route path="/admin/itians" element={<AdminProtected><AdminItian /></AdminProtected>} />
                        <Route path="/admin/iti-info" element={<AdminProtected><ItiInfo /></AdminProtected>} />

                        {/* User Dashboard */}
                        <Route path="/applicant" element={<UserProtected><UserHome /></UserProtected>} />
                        <Route path="/applicant/jobs" element={<UserProtected><UserJobs /></UserProtected>} />
                        <Route
                          path="/applicant/saved"
                          element={<UserProtected><UserSaved /></UserProtected>}
                        />
                        <Route
                          path="/applicant/applications"
                          element={<UserProtected><UserApplications /></UserProtected>}
                        />
                        <Route
                          path="/applicant/applications/:id"
                          element={<UserProtected><JobApplication /></UserProtected>}
                        />
                        <Route
                          path="/applicant/profile/edit-accounts"
                          element={<UserProtected><Accounts /></UserProtected>}
                        />
                        <Route
                          path="/applicant/jobs/:jobId"
                          element={<UserProtected><UserSingleJob /></UserProtected>}
                        />
                        {/* Applicant Profile */}
                        <Route
                          path="/applicant/profile"
                          element={<UserProtected><UserProfile /></UserProtected>}
                        />
                        <Route
                          path="/applicant/profile/edit-personal"
                          element={<UserProtected><EditPersonal /></UserProtected>}
                        />
                        <Route
                          path="/applicant/profile/edit-education"
                          element={<UserProtected><EditEducation /></UserProtected>}
                        />
                        <Route
                          path="/applicant/profile/edit-experience"
                          element={<UserProtected><EditExperience /></UserProtected>}
                        />
                        <Route
                          path="/applicant/profile/edit-skills"
                          element={<UserProtected><EditSkills /></UserProtected>}
                        />
                        <Route
                          path="/applicant/profile/edit-cv"
                          element={<UserProtected><EditCV /></UserProtected>}
                        />
                        <Route
                          path="/applicant/profile/edit-iti"
                          element={<UserProtected><EditITI /></UserProtected>}
                        />
                        <Route
                          path="/applicant/recommended"
                          element={<UserProtected><RecommendedJobs /></UserProtected>}
                        />
                        
                        
                        {/* Company Dashboard */}
                        <Route path="/company" element={<CompanyProtected><CompanyHome /> </CompanyProtected>} />
                        <Route path="/company/jobs" element={<CompanyProtected><CompanyJobs /> </CompanyProtected>} />
                        <Route
                          path="/company/jobs/:id"
                          element={<CompanyProtected><SingleJob /> </CompanyProtected>}
                        />
                        <Route
                          path="/company/talents"
                          element={<CompanyProtected><CompanyTalents /> </CompanyProtected>}
                        />
                        <Route
                          path="/company/talents/:id/"
                          element={<CompanyProtected><TalantProfile /> </CompanyProtected>}
                        />

                        <Route
                          path="/company/jobCreate"
                          element={<CompanyProtected><JobCreate /> </CompanyProtected>}
                        />
                        <Route
                          path="/company/jobEdit/:jobId"
                          element={<CompanyProtected><JobCreate /> </CompanyProtected>}
                        />

                        <Route
                          path="/company/profile/edit-accounts"
                          element={<CompanyProtected> <Accounts /> </CompanyProtected>}
                        />

                        <Route
                          path="/company/profile/"
                          element={<CompanyProtected><ComProfile /> </CompanyProtected>}
                        />
                        <Route
                          path="/company/profile/edit-personal"
                          element={<CompanyProtected><EditPersonalCom /> </CompanyProtected>}
                        />
                       
                        {/* <Route path="/company/register" element={<RegisterCompany />} /> */}

                        {/* Company Profile */}
                      </Routes>
                    </Suspense>
                    <PopupChatBot />
                    <CustomPopup />
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
