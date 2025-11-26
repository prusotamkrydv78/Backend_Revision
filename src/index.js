import express from "express";
import 'dotenv/config'
import cors from "cors";
import cookieParser from "cookie-parser";
import autRoute from "./route/autRoute.js";
import connectDB from "./lib/dbConnect.js";
import { protect } from "./middleware/auth.js";

const app = express();
connectDB();

// CORS configuration to allow frontend access
app.use(cors({
    origin: ['http://localhost:5173','https://backendrevision.vercel.app/'], // Vite default port
    credentials: true // Allow cookies to be sent
}));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", autRoute);
app.get("/dashboard", protect, (req, res) => {
    res.json({ message: "User Dashboard", user: req.user });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
