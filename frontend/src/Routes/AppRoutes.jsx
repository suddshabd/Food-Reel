import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import '../App.css'
import UserRegister from '../pages/UserRegister'
import Home from '../general/Home'
import CreateFood from '../food-partner/CreateFood'
import UserLogin from '../pages/UserLogin'
import PartnerRegister from '../pages/PartnerRegister'
import PartnerLogin from '../pages/PartnerLogin'
import Profile from '../food-partner/profile'
import LandingPage from '../pages/LandingPage'

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/user/register" element={< UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />

                <Route path="/foodpartner/register" element={<PartnerRegister />} />
                <Route path="/foodpartner/login" element={<PartnerLogin />} />
                <Route path="/home" element={< Home />} />
                <Route path="/food" element={<CreateFood />} />
                <Route path="/foodpartner/:id" element={<Profile />} />
            </Routes>
        </Router>
    )
}
