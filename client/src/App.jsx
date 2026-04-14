import { useState } from "react";
import Navbar from "./component/Navbar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RoleSelection from "./component/Getpopup";
import CustomerRegister from "./pages/Customersignup";
import ProRegister from "./pages/Professionalregister";
import Footer from "./component/Footer";
import ProfessionalDetail from "./component/professionalDetail";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/customerDashboard";
import AddressPicker from "./component/addressPicker";
import Checkout from "./component/checkout";
import ProfessionalProfile from "./pages/professionalDashboard";

function AppContent() {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />

      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/role" element={<RoleSelection />} />
        <Route path="/customer_signup" element={<CustomerRegister />} />
        <Route path="/pro_signup" element={<ProRegister />} />
        <Route path="/profile/customer" element={<Profile />} />
        <Route path="/profile/pro" element={<ProfessionalProfile/>} />
        <Route
          path="/profile/address/add_address"
          element={<AddressPicker />}
        />
        <Route path="/profile/:id" element={<ProfessionalDetail />} />
        <Route path="/checkout/:id" element={<Checkout />} />
      </Routes>

      {/* {state?.backgroundLocation && (
        <Routes>
        
        </Routes>
      )} */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      )}

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
