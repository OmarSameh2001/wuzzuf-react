import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import { ProfileProvider } from "./context/ProfileContext"; 
import AOS from "aos";
import "aos/dist/aos.css";
AOS.init();


function App() {
  const Home = React.lazy(() => import("./pages/home/Home"));
  const UserJobs = React.lazy(() => import("./pages/user/jobs/Jobs"));
  const CompanyJobs = React.lazy(() => import("./pages/company/jobs/Jobs"));
  const UserHome = React.lazy(() => import("./pages/user/home/Home"));
  const CompanyHome = React.lazy(() => import("./pages/company/home/Home"));
  const CompanySchedule = React.lazy(() => import("./pages/company/Schedule/Schedule"));
  const UserProfile = React.lazy(() => import("./pages/user/profile/userProfile"));
  const EditPersonal = React.lazy(() => import("./pages/user/profile/edit-profile/edit-personal"));
  const EditEducation = React.lazy(() => import("./pages/user/profile/edit-profile/edit-education"));
  const EditExperience = React.lazy(() => import("./pages/user/profile/edit-profile/edit-experience"));
  const EditSkills = React.lazy(() => import("./pages/user/profile/edit-profile/edit-skills"));
  const EditCV = React.lazy(() => import("./pages/user/profile/edit-profile/edit-cv"));
  const ReviewProfile = React.lazy(() => import("./pages/user/profile/edit-profile/review"));
  const UserSaved = React.lazy(() => import("./pages/user/saved/Saved"));
  const UserApplications = React.lazy(() => import("./pages/user/applications/Applications"));
  const UserSingleApplications = React.lazy(() => import("./pages/user/singleApplication/SingleApplication"));
  const JobApplication = React.lazy(() => import("./pages/user/applications/Applications"));
  const Login = React.lazy(() => import("./pages/login/Login"));
  const Register = React.lazy(() => import("./pages/register/Register"));

  return (
    <BrowserRouter>
     <ProfileProvider>  
        <Navbar />
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/applicant" element={<UserHome />} />
              <Route path="/applicant/jobs" element={<UserJobs />} />
              <Route path="/applicant/saved" element={<UserSaved />} />
              <Route path="/applicant/applications" element={<UserApplications />} />
              <Route path="/applicant/applications/:id" element={<UserSingleApplications />} />
              <Route path="/applicant/applications" element={<JobApplication />} /> 
              <Route path="/company/Schedule" element={<CompanySchedule />} />
              <Route path="/company" element={<CompanyHome />} />
              <Route path="/company/jobs" element={<CompanyJobs />} />
              
              {/* User Profile */}
              <Route path="/user/profile" element={<UserProfile />} />
              <Route path="/user/profile/edit-personal" element={<EditPersonal />} />
              <Route path="/user/profile/edit-education" element={<EditEducation />} />
              <Route path="/user/profile/edit-experience" element={<EditExperience />} />
              <Route path="/user/profile/edit-skills" element={<EditSkills />} />
              <Route path="/user/profile/edit-cv" element={<EditCV />} />
              <Route path="/user/profile/review" element={<ReviewProfile />} />

            </Routes>
          </Suspense>
        </div>
        <Footer />
      </ProfileProvider>
    </BrowserRouter>
  );
}

export default App;
