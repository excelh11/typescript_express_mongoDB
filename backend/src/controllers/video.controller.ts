// backend/src/controllers/video.controller.ts
import { Request, Response } from "express";
import Video from "../models/video.model";

export async function createVideo(req: Request, res: Response) {
  try {
    const video = await Video.create(req.body);
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: "Failed to create video", error });
  }
}

export async function searchVideos(req: Request, res: Response) {
  try {
    const { keyword } = req.query;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({ message: "keyword query is required" });
    }

    const videos = await Video.find(
      { $text: { $search: keyword } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    res.json(videos);
  } catch (error) {
    res.status(400).json({ message: "Failed to search videos", error });
  }
}