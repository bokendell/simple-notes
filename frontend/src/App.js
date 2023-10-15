import React from "react";
import { Routes, Route } from 'react-router-dom';
import NavBar from "./Components/NavBar";
import Create from "./Components/Create/Create";
import Home from "./Components/Home/Home";
import Signup from "./Components/signup/Signup";
import Login from "./Components/login/Login";
import Dashboard from "./Components/dashboard/Dashboard";


export default function MyApp() {
  return (
    <>
      <NavBar />
      <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<Create />} />
          <Route exact path="/" element={<Home />} />
       </Routes>
    </>
  );
}