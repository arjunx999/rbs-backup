import { Dish } from "../models/dish.js";
import { Restaurant } from "../models/restaurant.js";

export const addDish = async (req, res) => {
  try {
    const { name, description, price, photo_url } = req.body;

    if (!name || !description || !price || !photo_url) {
      return res.status(400).json({ msg: "Incomplete data" });
    }

    const restaurantId = req.user.restaurant._id;

    const newDish = new Dish({
      restaurant: restaurantId,
      name,
      description,
      price,
      photo_url: photo_url || "",
    });

    await newDish.save();

    await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $push: { dishes: newDish._id } },
      { new: true }
    );

    res.status(201).json({
      msg: "Dish added successfully",
      dish: newDish,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;

    const dish = await Dish.findById(id);
    if (!dish) {
      return res.status(404).json({ msg: "Dish not found" });
    }

    await Dish.findByIdAndDelete(id);

    res.status(200).json({ msg: "Dish deleted successfully" });
  } catch (error) {
    console.error("Error deleting dish:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getDishes = async (req, res) => {
  try {
    const restaurant = req.user.restaurant;

    const dishes = await Dish.find({ restaurant });

    return res.status(200).json({ dishes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
