
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Package, Plus, Search, Pencil, Trash2,
  X, RefreshCw, Boxes, IndianRupee, AlertTriangle
} from "lucide-react";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api/products";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Electronics",
  image: "",
  stock: "0",
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load products.");
      const data = await response.json();
      setProducts(data);
    } catch {
      setError("Products load nahi hue. Backend aur MongoDB connection check karo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setModal(true);
  }

  function openEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      category: product.category || "Electronics",
      image: product.image || "",
      stock: String(product.stock ?? 0),
    });
    setModal(true);
  }

  async function saveProduct(event) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not save product.");

      setModal(false);
      setNotice(editingId ? "Product updated successfully." : "Product added successfully.");
      await loadProducts();
    } catch (err) {
      setNotice(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product) {
    const confirmed = window.confirm(`Delete "${product.name}"?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${product.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not delete product.");

      setProducts((current) => current.filter((p) => p.id !== product.id));
      setNotice("Product deleted successfully.");
    } catch (err) {
      setNotice(err.message || "Delete failed.");
    }
  }

  const filtered = products.filter((p) =>
    `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase().trim())
  );

  const inventoryValue = products.reduce(
    (sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0),
    0
  );
  const lowStock = products.filter((p) => Number(p.stock) <= 5).length;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="admin-brand">
          <span className="admin-brand-icon"><Package /></span>
          <span>Shop<span>Sphere</span><small>ADMIN STUDIO</small></span>
        </a>

        <p className="admin-nav-label">WORKSPACE</p>
        <div className="admin-nav-item active"><LayoutDashboard size={18} /> Dashboard</div>
        <div className="admin-nav-item"><Package size={18} /> Products</div>

        <div className="admin-sidebar-bottom">
          <div className="admin-avatar">A</div>
          <div><strong>Administrator</strong><small>Local dashboard</small></div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-breadcrumb">Workspace / Dashboard</span>
            <h1>Product dashboard</h1>
            <p>Manage your ShopSphere product collection.</p>
          </div>
          <button className="admin-primary" onClick={openAdd}>
            <Plus size={18} /> Add product
          </button>
        </header>

        {notice && (
          <div className="admin-notice" role="status">
            {notice}
            <button onClick={() => setNotice("")} aria-label="Dismiss message"><X size={16} /></button>
          </div>
        )}

        <section className="admin-stats">
          <article className="admin-stat">
            <span className="admin-stat-icon purple"><Package /></span>
            <div><small>Total products</small><strong>{products.length}</strong><span>In your catalogue</span></div>
          </article>
          <article className="admin-stat">
            <span className="admin-stat-icon blue"><Boxes /></span>
            <div><small>Units in stock</small><strong>{products.reduce((n, p) => n + Number(p.stock || 0), 0)}</strong><span>Across all products</span></div>
          </article>
          <article className="admin-stat">
            <span className="admin-stat-icon green"><IndianRupee /></span>
            <div><small>Inventory value</small><strong>₹{inventoryValue.toLocaleString("en-IN")}</strong><span>Price × stock estimate</span></div>
          </article>
          <article className="admin-stat">
            <span className="admin-stat-icon orange"><AlertTriangle /></span>
            <div><small>Low stock items</small><strong>{lowStock}</strong><span>5 units or fewer</span></div>
          </article>
        </section>

        <section className="admin-table-card">
          <div className="admin-table-heading">
            <div><h2>All products</h2><p>Review and manage your inventory.</p></div>
            <button className="admin-refresh" onClick={loadProducts} title="Refresh products"><RefreshCw size={17} /></button>
          </div>

          <label className="admin-search">
            <Search size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by product or category..." />
          </label>

          {loading ? (
            <div className="admin-empty">Loading products...</div>
          ) : error ? (
            <div className="admin-empty">{error} <button onClick={loadProducts}>Retry</button></div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">No products found. Try another search or add a product.</div>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr><th>PRODUCT</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th><th>STATUS</th><th>ACTIONS</th></tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-cell">
                          {product.image ? <img src={product.image} alt="" /> : <span className="admin-no-image"><Package /></span>}
                          <div><strong>{product.name}</strong><small>{product.description}</small></div>
                        </div>
                      </td>
                      <td><span className="admin-category">{product.category}</span></td>
                      <td className="admin-price">₹{Number(product.price).toLocaleString("en-IN")}</td>
                      <td>{product.stock}</td>
                      <td>
                        <span className={`admin-stock ${Number(product.stock) <= 5 ? "low" : "available"}`}>
                          {Number(product.stock) <= 5 ? "Low stock" : "In stock"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button onClick={() => openEdit(product)} title="Edit product" aria-label={`Edit ${product.name}`}><Pencil size={16} /></button>
                          <button className="delete" onClick={() => deleteProduct(product)} title="Delete product" aria-label={`Delete ${product.name}`}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <footer className="admin-footer">ShopSphere Admin Studio · Product inventory</footer>
      </main>

      {modal && (
        <div className="admin-modal-backdrop" onMouseDown={(e) => {
          if (e.target === e.currentTarget && !saving) setModal(false);
        }}>
          <section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-form-title">
            <div className="admin-modal-heading">
              <div><span>PRODUCT CATALOGUE</span><h2 id="admin-form-title">{editingId ? "Edit product" : "Add a product"}</h2></div>
              <button type="button" onClick={() => setModal(false)} disabled={saving} aria-label="Close"><X /></button>
            </div>

            <form onSubmit={saveProduct}>
              <label>Product name *
                <input required maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Everyday Backpack" />
              </label>
              <label>Description
                <textarea maxLength={1000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the product..." rows={3} />
              </label>
              <div className="admin-form-row">
                <label>Price (₹) *
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </label>
                <label>Stock *
                  <input required type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </label>
              </div>
              <label>Category *
                <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {["Electronics", "Fashion", "Accessories", "Home"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label>Image URL
                <input type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://example.com/image.jpg" />
              </label>
              <div className="admin-modal-actions">
                <button type="button" className="admin-cancel" onClick={() => setModal(false)} disabled={saving}>Cancel</button>
                <button type="submit" className="admin-primary" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Save changes" : "Add product"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
