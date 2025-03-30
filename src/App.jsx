import React, { useState, Suspense } from 'react'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import JobCreate from './components/job/JobCreate';

function App() {
  const Home = React.lazy(() => import("./pages/home/Home"));
  const UserJobs = React.lazy(() => import("./pages/user/jobs/Jobs"));
  const CompanyJobs = React.lazy(() => import("./pages/company/jobs/Jobs"));
  const UserHome = React.lazy(() => import("./pages/user/home/Home"));
  const CompanyHome = React.lazy(() => import("./pages/company/home/Home"));
  const UserSaved = React.lazy(() => import("./pages/user/saved/Saved"));
  const UserApplications = React.lazy(() => import("./pages/user/applications/Applications"));
  const UserSingleApplications = React.lazy(() => import("./pages/user/singleApplication/SingleApplication"));
  const Login = React.lazy(() => import("./pages/login/Login"));
  const Register = React.lazy(() => import("./pages/register/Register"));
  const CompanyTalents = React.lazy(() => import("./pages/company/talents/Talents"));
  return (
    <>
      <BrowserRouter>
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
              <Route path='/applicant/applications/:id' element={<UserSingleApplications />} />
              <Route path="/company" element={<CompanyHome />} />
              <Route path="/company/jobs" element={<CompanyJobs />} />
              <Route path="/company/talents" element={<CompanyTalents />} />
              <Route path="/jobCreate" element={<JobCreate />} />

            </Routes>
          </Suspense>
        </div>
        <Footer />

      </BrowserRouter>
    </>
  )
}

export default App
