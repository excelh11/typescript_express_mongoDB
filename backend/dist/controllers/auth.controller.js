"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
async function register(req, res) {
    try {
        const { email, password } = req.body;
        const existing = await user_model_1.default.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Email already in use" });
        }
        const hashed = await bcrypt_1.default.hash(password, 10);
        const user = await user_model_1.default.create({
            email,
            password: hashed,
            role: "user"
        });
        res.status(201).json({
            id: user._id,
            email: user.email,
            role: user.role
        });
    }
    catch (error) {
        res.status(400).json({ message: "Failed to register", error });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
        res.json({
            token,
            user: { id: user._id, email: user.email, role: user.role }
        });
    }
    catch (error) {
        res.status(400).json({ message: "Failed to login", error });
    }
}
