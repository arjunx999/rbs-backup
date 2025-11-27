import express from "express";
import { addDish, deleteDish, getDishes } from "../controllers/dishController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", verifyToken, addDish);

router.get("/get-all", verifyToken, getDishes);

router.delete("/delete/:id", verifyToken, deleteDish);

export default router;
