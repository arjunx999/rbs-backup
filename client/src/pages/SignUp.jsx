import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://rbs-backup.onrender.com/auth/signup",
        {
          name,
          restaurant,
          email,
          password,
        }
      );

      console.log(res.data);
      alert("Signup successful, Login to continue");
      Navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error check console");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-80 bg-white p-6 rounded-xl shadow"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Restaurant Name"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

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
          className="w-full bg-green-600 cursor-pointer text-white p-2 rounded hover:bg-green-700"
        >
          Create Account
        </button>
        <span
          onClick={() => Navigate("/")}
          className="text-xs text-blue-500 underline cursor-pointer"
        >
          Already have an account? Login
        </span>
      </form>
    </div>
  );
};

export default SignUp;
