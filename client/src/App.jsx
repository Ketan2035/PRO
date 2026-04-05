import { useState } from 'react';
import Navbar from "./component/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login'
import RoleSelection from './component/Getpopup';
import CustomerRegister from './pages/Customersignup';
import ProRegister from './pages/Professionalregister';
import Footer from './component/Footer';
import ProfessionalDetail from './component/professionalDetail';
import {Toaster} from "react-hot-toast";
import Profile from './pages/user';
// import HomeSections from './pages/About';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/role" element={<RoleSelection/>} />
          <Route path="/customer_signup" element={<CustomerRegister/>} />
          <Route path="/pro_signup" element={<ProRegister/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/profile/:id" element={<ProfessionalDetail/>} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
