"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/video.route.ts
const express_1 = require("express");
const video_controller_1 = require("../controllers/video.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// 예: 비디오 등록은 로그인한 사용자만 가능
router.post("/", auth_middleware_1.authMiddleware, video_controller_1.createVideo);
// 검색은 공개로 둘 수도, Private로 둘 수도 있음 (지금은 공개)
router.get("/search", video_controller_1.searchVideos);
exports.default = router;
