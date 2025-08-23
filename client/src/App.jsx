import { useState } from 'react'
import Navbar from "./component/Navbar"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login'
import RoleSelection from './component/Getpopup';
import CustomerRegister from './pages/Customersignup';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/role" element={<RoleSelection/>} />
          <Route path="/about" element={<CustomerRegister/>} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
