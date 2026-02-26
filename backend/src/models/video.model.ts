// backend/src/models/video.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  title: string;
  description?: string;
  url: string;
  tags: string[];
  createdAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: String,
    url: { type: String, required: true },
    tags: { type: [String], default: [] }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

// 텍스트 검색 인덱스
videoSchema.index({ title: "text", description: "text", tags: "text" });

const Video = mongoose.model<IVideo>("Video", videoSchema);

export default Video;