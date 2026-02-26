"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideo = createVideo;
exports.searchVideos = searchVideos;
const video_model_1 = __importDefault(require("../models/video.model"));
async function createVideo(req, res) {
    try {
        const video = await video_model_1.default.create(req.body);
        res.status(201).json(video);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to create video", error });
    }
}
async function searchVideos(req, res) {
    try {
        const { keyword } = req.query;
        if (!keyword || typeof keyword !== "string") {
            return res.status(400).json({ message: "keyword query is required" });
        }
        const videos = await video_model_1.default.find({ $text: { $search: keyword } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
        res.json(videos);
    }
    catch (error) {
        res.status(400).json({ message: "Failed to search videos", error });
    }
}
