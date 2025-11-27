import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://rbs-backup.onrender.com/auth/login", {
        email,
        password,
      });

      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Login successful");
      Navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-80 bg-white p-6 rounded-xl shadow"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 cursor-pointer text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
