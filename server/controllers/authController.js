import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { Restaurant } from "../models/restaurant.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, restaurant } = req.body;

    const existingMail = await User.findOne({ email });
    if (existingMail) {
      return res.status(409).json({ msg: "User already exists" });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: passwordHash,
    });
    const savedUser = await newUser.save();

    const newRestaurant = new Restaurant({
      name: restaurant,
      owner: savedUser._id,
    });

    const savedRestaurant = await newRestaurant.save();

    savedUser.restaurant = savedRestaurant._id;
    await savedUser.save();

    res.status(201).json({
      success: true,
      message: "User successfully created",
      user: savedUser,
      restaurant: savedRestaurant,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("restaurant");
    if (!user) {
      return res.status(404).json({ msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
