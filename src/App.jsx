import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import DashBoard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePayment from "./pages/CreatePayment";

function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar />
        <Routes>
          {/* Other routes (if any) */}
          <Route path="/" element={<LandingPage />} />
            <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/create-payment" element={<CreatePayment />} />
            </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
