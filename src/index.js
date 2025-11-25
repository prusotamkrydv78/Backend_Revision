import express from "express";
import 'dotenv/config'
import autRoute from "./route/autRoute.js";
import connectDB from "./lib/dbConnect.js";
import { protect } from "./middleware/auth.js";
const app = express();
connectDB();

app.use(express.json());
app.use("/api/auth", autRoute);
app.get("/dashboard", protect, (req, res) => {
    res.json({ message: "User Dashboard", user: req.user });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
