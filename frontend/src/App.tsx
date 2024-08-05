import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import NotFound from './pages/NotFound';
import TravelPlanShow from "./pages/TravelPlanShow";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import {AuthProvider, useAuth} from "./contexts/AuthContext";
import AuthenticatedRoute from "./components/routes/AuthenticatedRoute";

const AppContent: React.FC = () => {
    const { username } = useAuth();

    return (
        <>
            {username && <Navbar />}
            <Routes>
                <Route path="/" element={<Navigate to={username ? "/home" : "/signin"} />} />
                <Route path="/home" element={<AuthenticatedRoute element={<Home />} />} />
                <Route path="/travel-plan/:id" element={<AuthenticatedRoute element={<TravelPlanShow />} />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            {username && <Footer />}
        </>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

export default App;
