import { apiClient } from "./client";

export async function searchVideos(keyword: string) {
  const { data } = await apiClient.get("/videos/search", { params: { keyword } });
  return data;
}

export async function createVideo(body: { title: string; description?: string; url: string; tags?: string[] }) {
  const { data } = await apiClient.post("/videos", body);
  return data;
}