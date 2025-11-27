import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [name, setName] = useState("");
  const [restaurant, setRestaurant] = useState("");

  // popup states
  const [showPopup, setShowPopup] = useState(false);
  const [dishName, setDishName] = useState("");
  const [photo, setPhoto] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");

  const Navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("Login to access");
      Navigate("/");
      return;
    }

    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setName(parsed.name);
      setRestaurant(parsed.restaurant.name);
    }

    fetchDishes(token);
  }, []);

  const fetchDishes = async (token) => {
    try {
      const res = await axios.get("https://rbs-backup.onrender.com/dish/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDishes(res.data.dishes);
    } catch (err) {
      console.log(err);
      alert("Unable to fetch dishes");
    }
  };

  const handleAddDish = async () => {
    const token = sessionStorage.getItem("token");

    if (!dishName || !desc || !price || !photo) {
      alert("All fields required");
      return;
    }

    try {
      await axios.post(
        "https://rbs-backup.onrender.com/dish/add",
        {
          name: dishName,
          description: desc,
          price: Number(price),
          photo_url: photo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Dish added!");
      setShowPopup(false);

      fetchDishes(token);

      setDishName("");
      setPrice("");
      setDesc("");
      setPhoto("");
    } catch (error) {
      console.log(error);
      alert("Error adding dish");
    }
  };

  const handleDeleteDish = async (id) => {
    const confirmDelete = window.confirm("Delete this dish?");
    if (!confirmDelete) return;

    const token = sessionStorage.getItem("token");

    try {
      await axios.delete(`https://rbs-backup.onrender.com/dish/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Dish deleted!");
      fetchDishes(token);
    } catch (err) {
      console.log(err);
      alert("Error deleting");
    }
  };

  const handleLogout = () => {
    const yes = window.confirm("Logout?");
    if (!yes) return;
    sessionStorage.clear();
    Navigate("/");
  };

  return (
    <div className="h-screen w-full bg-gray-300 p-5 flex flex-col gap-6">
      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <div onClick={() => Navigate(-1)} className="cursor-pointer bg-white px-4 py-2 rounded-lg shadow font-semibold">
          {restaurant?.toUpperCase()}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setShowPopup(true)}
            className="px-4 py-2 rounded-lg shadow bg-blue-200 hover:bg-blue-300"
          >
            ADD ITEM
          </button>

          <button
            onClick={() => Navigate("/bill-order")}
            className="px-4 py-2 rounded-lg shadow bg-green-200 hover:bg-green-300"
          >
            BILL ORDER
          </button>
        </div>
      </div>

      {/* MENU GRID */}
      <div className="grid grid-cols-3 gap-6 px-10 mt-4">
        {dishes.length === 0 && (
          <h1 className="col-span-3 text-center text-xl text-gray-600">
            No dishes added yet.
          </h1>
        )}

        {dishes.map((dish) => (
          <div
            key={dish._id}
            className="relative bg-white rounded-lg shadow p-3 flex flex-col items-center"
          >
            {/* DELETE BUTTON */}
            <button
              onClick={() => handleDeleteDish(dish._id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs hover:bg-red-600"
            >
              X
            </button>

            <img
              src={dish.photo_url}
              alt={dish.name}
              className="w-32 h-32 object-cover rounded-md mb-2"
            />
            <h2 className="text-lg font-medium text-gray-700">{dish.name}</h2>
            <p className="text-gray-700 text-lg">₹ {dish.price}</p>
          </div>
        ))}
      </div>

      {/* BOTTOM BAR */}
      <div className="mt-auto flex justify-between">
        <div className="bg-white px-6 py-3 rounded-lg shadow w-60 text-center font-medium">
          {name?.toUpperCase()}
        </div>

        <button
          onClick={handleLogout}
          className="bg-white px-6 py-3 rounded-lg shadow w-60 text-center font-medium text-red-600 hover:bg-red-100"
        >
          LOGOUT
        </button>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-700 text-center">
              Add New Dish
            </h2>

            <input
              type="text"
              placeholder="Dish Name"
              className="border p-2 rounded"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Photo URL"
              className="border p-2 rounded"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
            />

            <input
              type="number"
              placeholder="Price"
              className="border p-2 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <textarea
              placeholder="Description"
              className="border p-2 rounded"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <div className="flex gap-3 mt-2">
              <button
                className="flex-1 p-2 bg-green-500 text-white rounded-lg"
                onClick={handleAddDish}
              >
                Add
              </button>

              <button
                className="flex-1 p-2 bg-red-500 text-white rounded-lg"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
