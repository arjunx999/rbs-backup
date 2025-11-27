import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [name, setName] = useState("");
  const [restaurant, setRestaurant] = useState("");

  const Navigate = useNavigate();

  useEffect(() => {
    const userToken = sessionStorage.getItem("token");

    if (!userToken) {
      alert("Login to access");
      Navigate("/");
    }

    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setName(parsed.name);
      setRestaurant(parsed.restaurant.name);
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      Navigate("/");
    }
  };

  return (
    <div className="h-screen w-full bg-gray-300 p-5 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="bg-white px-4 py-2 rounded-lg shadow font-semibold text-gray-700 tracking-wide">
          {restaurant ? restaurant.toUpperCase() : "RESTAURANT"}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => Navigate("/menu/add-item")}
            className="px-4 py-2 rounded-lg shadow border border-gray-400 bg-blue-100 text-gray-700 font-medium hover:border-blue-400 transition-all duration-200 cursor-pointer"
          >
            ADD DISHES
          </button>

          <button
            onClick={() => Navigate("/bill-order")}
            className="px-4 py-2 rounded-lg shadow border border-gray-400 bg-green-100 text-gray-700 font-medium hover:border-green-400 transition-all duration-200 cursor-pointer"
          >
            BILL ORDER
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[2vh] justify-center mt-[22vh] text-center text-5xl font-semibold">
        <h1>Welcome to your restaurant billing dashboard.</h1>

        <h1 className="text-3xl">
          Manage dishes, generate bills, and keep your daily workflow smooth.
        </h1>
      </div>

      <div className="mt-auto flex justify-between">
        <div className="bg-white px-6 py-3 rounded-lg shadow w-60 text-center font-medium text-gray-700">
          {name ? name.toUpperCase() : "USER"}
        </div>

        <button
          onClick={handleLogout}
          className="bg-white px-6 py-3 rounded-lg shadow w-60 text-center font-medium text-red-600 hover:bg-red-100 cursor-pointer transition"
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
};

export default Home;
