import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchVideos, createVideo } from "../api/video";

export default function VideoSearch() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<{ _id: string; title: string; url?: string; description?: string }[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [addError, setAddError] = useState("");
  const navigate = useNavigate();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    try {
      const data = await searchVideos(keyword.trim());
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setResults([]);
    }
  }

  async function handleAddVideo(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    if (!title.trim() || !url.trim()) {
      setAddError("제목과 URL은 필수입니다.");
      return;
    }
    try {
      const tags = tagsInput.trim() ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean) : undefined;
      await createVideo({
        title: title.trim(),
        description: description.trim() || undefined,
        url: url.trim(),
        tags,
      });
      setTitle("");
      setDescription("");
      setUrl("");
      setTagsInput("");
    } catch (err) {
      setAddError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "비디오 등록 실패");
    }
  }

  return (
    <div className="page-container page-container--wide">
      <div className="nav-buttons" style={{ marginBottom: 16 }}>
        <button className="secondary" onClick={() => navigate("/products")}>상품 목록</button>
      </div>

      <div className="card">
        <h1 className="card-title">비디오 검색</h1>

        <div style={{ marginBottom: 28, padding: 24, background: "var(--color-bg)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
          <h2 style={{ margin: "0 0 20px 0", fontSize: "1.125rem", fontWeight: 600 }}>비디오 등록</h2>
          <form onSubmit={handleAddVideo}>
            <div className="form-group">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목 *"
                required
              />
            </div>
            <div className="form-group">
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="설명"
              />
            </div>
            <div className="form-group">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL *"
                required
              />
            </div>
            <div className="form-group">
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="태그 (쉼표로 구분, 예: react, nodejs)"
              />
            </div>
            {addError && <p className="error-msg">{addError}</p>}
            <button type="submit" style={{ width: "100%" }}>등록</button>
          </form>
        </div>

        <h2 style={{ margin: "0 0 16px 0", fontSize: "1.125rem", fontWeight: 600 }}>검색</h2>
        <form onSubmit={handleSearch}>
          <div className="form-row" style={{ marginBottom: 0 }}>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어"
            />
            <button type="submit" style={{ flexShrink: 0 }}>검색</button>
          </div>
        </form>

        <ul style={{ listStyle: "none", padding: 0, margin: "24px 0 0 0" }}>
          {results.map((v) => (
            <li key={v._id} className="list-item">
              <div>
                <strong>{v.title}</strong>
                {v.url && <div style={{ marginTop: 4 }}><a href={v.url} target="_blank" rel="noreferrer">보기</a></div>}
              </div>
            </li>
          ))}
        </ul>
        {results.length === 0 && keyword && <p className="link-text" style={{ marginTop: 20 }}>결과 없음</p>}
      </div>
    </div>
  );
}