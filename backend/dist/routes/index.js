"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_route_1 = __importDefault(require("./product.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const video_route_1 = __importDefault(require("./video.route"));
const router = (0, express_1.Router)();
router.use("/auth", auth_route_1.default);
router.use("/products", product_route_1.default);
router.use("/videos", video_route_1.default);
exports.default = router;
