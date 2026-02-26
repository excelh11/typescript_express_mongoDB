// backend/src/routes/video.route.ts
import { Router } from "express";
import { createVideo, searchVideos } from "../controllers/video.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// 예: 비디오 등록은 로그인한 사용자만 가능
router.post("/", authMiddleware, createVideo);

// 검색은 공개로 둘 수도, Private로 둘 수도 있음 (지금은 공개)
router.get("/search", searchVideos);

export default router;