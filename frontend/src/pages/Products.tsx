import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProducts, createProduct, deleteProduct } from "../api/product";

export default function Products() {
  const [products, setProducts] = useState<{ _id: string; name: string; price: number; createdBy?: string }[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) return;
    try {
      const newProduct = await createProduct({ name, price: Number(price) });
      setProducts((prev) => [newProduct, ...prev]);
      setName("");
      setPrice("");
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("삭제할까요?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="page-container page-container--wide">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <h1 className="card-title" style={{ marginBottom: 0 }}>상품 목록</h1>
          <div className="nav-buttons">
            <button className="secondary" onClick={() => navigate("/videos")}>비디오 검색</button>
            <button className="secondary" onClick={() => { logout(); navigate("/login"); }}>로그아웃</button>
          </div>
        </div>
        <form onSubmit={handleAdd} style={{ marginTop: 24 }}>
          <div className="form-row">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="상품명" />
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="가격" style={{ maxWidth: 120 }} />
            <button type="submit">추가</button>
          </div>
        </form>
        <ul style={{ listStyle: "none", padding: 0, margin: "24px 0 0 0" }}>
          {products.map((p) => (
            <li key={p._id} className="list-item">
              <span>{p.name} - {p.price.toLocaleString()}원</span>
              {p.createdBy === user?.id && (
                <button className="danger" onClick={() => handleDelete(p._id)} style={{ padding: "8px 16px", fontSize: "0.875rem" }}>삭제</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}