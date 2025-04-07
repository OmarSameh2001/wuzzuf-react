import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import JobCreate from './components/job/JobCreate';
import { ProfileProvider } from "./context/ProfileContext";
import { UserContextProvider } from "./context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AxiosProvider from "./services/AxiosProvider";
import Login from './pages/login/Login';


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
  const ReviewProfile = React.lazy(() =>
    import("./pages/user/profile/edit-profile/review")
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
  const SingleJob = React.lazy(() => import("./pages/company/jobs/singleJob"));
  const UserSingleJob = React.lazy(() => import("./pages/user/jobs/UserSingleJob"));
  const ApplicationForm = React.lazy(() => import("./pages/user/jobs/ApplicationForm"));
  // // const RegisterCompany = React.lazy(() => import("./pages/register/RegisterCompany"));

  return (
    <>
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <ProfileProvider>
            <UserContextProvider>
              <AxiosProvider>
                <Navbar />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    maxWidth: "100vw",
                  }}
                >
                  <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
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
                      <Route path="/company/jobs/:id" element={<SingleJob />} />
                      <Route
                        path="/company/talents"
                        element={<CompanyTalents />}
                      />
                      <Route path="/company/jobCreate" element={<JobCreate />} />
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
                        path="/applicant/profile/review"
                        element={<ReviewProfile />}
                      />
                    </Routes>
                  </Suspense>
                </div>
                <Footer />
              </AxiosProvider>
            </UserContextProvider>
          </ProfileProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
