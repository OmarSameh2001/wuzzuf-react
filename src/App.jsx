import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from './components/navbar/Navbar';
import ErrorBoundary from "./pages/company/profile/ErrorBoundary";
import Footer from './components/footer/Footer';
import JobCreate from './components/job/JobCreate';
import { ProfileProvider } from "./context/ProfileContext";
import { UserContextProvider } from "./context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AxiosProvider from "./services/AxiosProvider";

// Lazy-loaded components
const Home = React.lazy(() => import("./pages/home/Home"));
const UserJobs = React.lazy(() => import("./pages/user/jobs/Jobs"));
const CompanyJobs = React.lazy(() => import("./pages/company/jobs/Jobs"));
const UserHome = React.lazy(() => import("./pages/user/home/Home"));
const CompanyHome = React.lazy(() => import("./pages/company/home/Home"));
const UserProfile = React.lazy(() => import("./pages/user/profile/userProfile"));
const EditPersonal = React.lazy(() => import("./pages/user/profile/edit-profile/edit-personal"));
const EditEducation = React.lazy(() => import("./pages/user/profile/edit-profile/edit-education"));
const EditExperience = React.lazy(() => import("./pages/user/profile/edit-profile/edit-experience"));
const EditSkills = React.lazy(() => import("./pages/user/profile/edit-profile/edit-skills"));
const EditCV = React.lazy(() => import("./pages/user/profile/edit-profile/edit-cv"));
const ReviewProfile = React.lazy(() => import("./pages/user/profile/edit-profile/review"));
const UserSaved = React.lazy(() => import("./pages/user/saved/Saved"));
const UserApplications = React.lazy(() => import("./pages/user/applications/Applications"));
const JobApplication = React.lazy(() => import("./pages/user/applications/Applications"));
const Login = React.lazy(() => import("./pages/login/Login"));
const Register = React.lazy(() => import("./pages/register/Register"));
const CompanyTalents = React.lazy(() => import("./pages/company/talents/Talents"));
const SingleJob = React.lazy(() => import("./pages/company/jobs/SingleJob"));
const UserSingleJob = React.lazy(() => import("./pages/user/jobs/UserSingleJob"));
const ApplicationForm = React.lazy(() => import("./pages/user/jobs/ApplicationForm"));
const AboutCompany = React.lazy(() => import("./pages/company/profile/AboutCompany"));
const BasicInfo = React.lazy(() => import("./pages/company/profile/BasicInfo"));
const ContactInfo = React.lazy(() => import("./pages/company/profile/ContactInfo"));
const ReviewProfileC = React.lazy(() => import("./pages/company/profile/ReviewProfile"));
const CompanyProfile = React.lazy(() => import("./pages/company/profile/CompanyProfile"));
const CompanyProfileView = React.lazy(() => import("./pages/company/profile/ProfileView"));
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ProfileProvider>
          <UserContextProvider>
            <AxiosProvider>
              <ErrorBoundary>
                <Navbar />
                <div className="container" style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minHeight: "calc(100vh - 120px)"
                }}>
                  <Suspense fallback={<div className="text-center py-5">Loading...</div>}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      
                      {/* Applicant Routes */}
                      <Route path="/applicant" element={<UserHome />} />
                      <Route path="/applicant/jobs" element={<UserJobs />} />
                      <Route path="/applicant/jobs/:jobId" element={<UserSingleJob />} />
                      <Route path="/applicant/saved" element={<UserSaved />} />
                      <Route path="/applicant/applications" element={<UserApplications />} />
                      <Route path="/applicant/applications/:id" element={<JobApplication />} />
                      <Route path="/application-form" element={<ApplicationForm />} />
                      
                      {/* Applicant Profile Routes */}
                      <Route path="/applicant/profile" element={<UserProfile />}>
                        <Route path="edit-personal" element={<EditPersonal />} />
                        <Route path="edit-education" element={<EditEducation />} />
                        <Route path="edit-experience" element={<EditExperience />} />
                        <Route path="edit-skills" element={<EditSkills />} />
                        <Route path="edit-cv" element={<EditCV />} />
                        <Route path="review" element={<ReviewProfile />} />
                      </Route>
                      
                      {/* Company Routes */}
                      <Route path="/company" element={<CompanyHome />} />
                      <Route path="/company/jobs" element={<CompanyJobs />} />
                      <Route path="/company/jobs/:id" element={<SingleJob />} />
                      <Route path="/company/talents" element={<CompanyTalents />} />
                      <Route path="/company/jobCreate" element={<JobCreate />} />
                      
                      {/* Company Profile Routes */}
                      <Route path="/company/profile" element={<CompanyProfile />}>
                        <Route path="about" element={<AboutCompany />} />
                        <Route path="basic-info" element={<BasicInfo />} />
                        <Route path="contact-info" element={<ContactInfo />} />
                        <Route path="review" element={<ReviewProfileC />} />
                      </Route>
                      
                      {/* Company Profile View - Moved outside nested routes */}
                      <Route path="/company/:companyId" element={<CompanyProfileView />} />
                    </Routes>
                  </Suspense>
                </div>
                <Footer />
              </ErrorBoundary>
            </AxiosProvider>
          </UserContextProvider>
        </ProfileProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;