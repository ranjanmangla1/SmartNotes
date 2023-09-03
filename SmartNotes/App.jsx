import React from 'react';

import SignUp from "./components/Authentication/SignUp";
import LogIN from "./components/Authentication/Login"; 
import {AuthProvider} from "./contexts/AuthContext";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Profile from "./components/Authentication/Profile";
import ForgotPassword from "./components/Authentication/ForgotPassword"
import PrivateRoutes from "./components/PrivateRoutes";
import UpdateProfile from "./components/Authentication/UpdateProfile";
import Main from './components/Main';
// import './index.css'
// import Dashboard from "./components/Drive/Dashboard";

const App = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Main Routes */}
            <Route element={ <PrivateRoutes/> }>
              <Route exact path="/" element={<Main />} />
              {/* creating a dynamic route */}
              {/* <Route exact path="/folder/:folderId" element={<Dashboard />} /> */}
            </Route>

            {/* Authentication */}
            <Route path="/login" element={<LogIN />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* <Route exact path="/" element={<Dashboard />} /> */}
            {/* the issue in react router v6 is we need to have Route as a direct children in Routes, so PrivateROute component can be the direct children  */}

            {/* Profile */}
            <Route element={ <PrivateRoutes/> }>
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/update-profile" element={<UpdateProfile />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
      {/* </Scrollbar> */}
  </>
  )
}

export default App;