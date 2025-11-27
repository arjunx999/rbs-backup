import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Billing = () => {
  const [allDishes, setAllDishes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [total, setTotal] = useState(0);

  const Navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      Navigate("/");
      return;
    }

    fetchDishes(token);
  }, []);

  const fetchDishes = async (token) => {
    try {
      const res = await axios.get("http://localhost:9999/dish/get-all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllDishes(res.data.dishes);
    } catch (err) {
      console.log(err);
      alert("Error fetching dishes");
    }
  };

  const addToBill = (dish) => {
    setSelected((prev) => [...prev, dish]);
    setTotal((t) => t + dish.price);
  };

  const removeDish = (index) => {
    const dishToRemove = selected[index];
    setTotal((t) => t - dishToRemove.price);

    setSelected((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateBill = async () => {
    if (selected.length === 0) {
      alert("No dishes selected");
      return;
    }

    const token = sessionStorage.getItem("token");

    try {
      const dishIds = selected.map((d) => d._id);

      const res = await axios.post(
        "http://localhost:9999/order/bill-order",
        { dishes: dishIds },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      // PDF download
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      a.click();
    } catch (err) {
      console.log(err);
      alert("Billing error");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-gray-700 text-center">
        Billing Page
      </h1>

      <div>
        <h2 className="text-xl font-semibold mb-3">Select Items</h2>

        <div className="space-y-2">
          {allDishes.map((dish) => (
            <div
              key={dish._id}
              className="flex items-center justify-between bg-white p-3 rounded shadow-sm border border-gray-200"
            >
              <div>
                <h3 className="font-medium text-gray-800 text-sm">
                  {dish.name}
                </h3>
                <p className="text-gray-600 text-xs">₹ {dish.price}</p>
              </div>

              <button
                onClick={() => addToBill(dish)}
                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
              >
                + Add
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow p-5 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Selected Items</h2>

        {selected.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No items added yet.</p>
        ) : (
          <>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Dish</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Remove</th>
                </tr>
              </thead>

              <tbody>
                {selected.map((dish, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{dish.name}</td>
                    <td className="p-2 border">₹ {dish.price}</td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => removeDish(index)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right text-xl font-bold mt-4">
              Total: ₹ {total}
            </div>

            <button
              onClick={handleGenerateBill}
              className="mt-4 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 float-right"
            >
              Generate Bill
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Billing;
