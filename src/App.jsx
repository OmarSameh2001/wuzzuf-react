import React, { useState, Suspense } from 'react'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Login from "./pages/user/authentication/Login";
import Signup from "./pages/user/authentication/Signup";
import Profile from "./pages/user/home/Profile";

function App() {
  const Home = React.lazy(() => import("./pages/home/Home"));
  const UserJobs = React.lazy(() => import("./pages/user/jobs/Jobs"));
  const CompanyJobs = React.lazy(() => import("./pages/company/jobs/Jobs"));
  const UserHome = React.lazy(() => import("./pages/user/home/Profile"));
  const CompanyHome = React.lazy(() => import("./pages/company/home/Home"));
  const UserSaved = React.lazy(() => import("./pages/user/saved/Saved"));
  const UserApplications = React.lazy(() => import("./pages/user/applications/Applications"));
  const UserSingleApplications = React.lazy(() => import("./pages/user/singleApplication/SingleApplication"));
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/applicant" element={<UserHome />} />
              <Route path="/applicant/jobs" element={<UserJobs />} />
              <Route path="/applicant/saved" element={<UserSaved />} />
              <Route path="/applicant/applications" element={<UserApplications />} />
              <Route path='/applicant/applications/:id' element={<UserSingleApplications />} />
              <Route path="/company" element={<CompanyHome />} />
              <Route path="/company/jobs" element={<CompanyJobs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />

      </BrowserRouter>
    </>
  )
}

export default App
