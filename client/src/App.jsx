import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Billing from "./pages/Billing.jsx";

const App = () => {
  return (
    <div className="w-[100vw] h-[100vh] bg-zinc-300">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu/add-item" element={<Menu />} />
        <Route path="/bill-order" element={<Billing />} />
      </Routes>
    </div>
  );
};

export default App;
