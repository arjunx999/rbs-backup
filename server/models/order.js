import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  dishes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dish",
      required: true,
    },
  ],
  total_amount: {
    type: Number,
    required: true,
  },
  placed_at: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", OrderSchema);
