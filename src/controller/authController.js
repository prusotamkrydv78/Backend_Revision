import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

const register = async (req, res) => {
    const { name, password, email } = req.body;

    // Password will be hashed by Mongoose pre-save hook
    await User.create({ name, password, email });

    res.json({ message: "Registered successfully!" });
};

const login = async (req, res) => {
    const { name, password } = req.body;

    const user = await User.findOne({ name });
    if (!user) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/"
    });

    res.json({ accessToken });
};

const refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(403).json({ message: "No refresh token" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });

        const newAccessToken = generateAccessToken({ _id: user.id, role: user.role });

        res.json({ accessToken: newAccessToken });
    });
};

export { register, login, refreshToken };
