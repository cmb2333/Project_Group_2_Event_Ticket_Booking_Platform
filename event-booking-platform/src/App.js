import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from './context/UserContext';
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Events from "./pages/events";
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import SeatingChart from './components/seatingChart';
import ConfirmationPage from './pages/confirmation';
import EventForm from './pages/eventForm';

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/events" element={<Events />} />
          <Route path="/seating-chart/:eventId" element={<SeatingChart />} />
          <Route path="/confirmation" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} />
          <Route path="/event-form" element={<ProtectedRoute><EventForm /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
