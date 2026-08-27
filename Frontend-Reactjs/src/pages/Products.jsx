// src/pages/Products.jsx
import { useEffect, useState } from 'react';
import { productsApi, suppliersApi } from '../api/resources';
import Modal from '../components/Modal';

const emptyForm = { ProductName: '', Price: '', StockQuantity: '', SupplierID: '' };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [p, s] = await Promise.all([productsApi.list(), suppliersApi.list()]);
      setProducts(p);
      setSuppliers(s);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function supplierName(id) {
    return suppliers.find((s) => s.SupplierID === id)?.SupplierName || '—';
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      ProductName: product.ProductName || '',
      Price: product.Price,
      StockQuantity: product.StockQuantity,
      SupplierID: product.SupplierID || '',
    });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ProductName: form.ProductName,
        Price: Number(form.Price),
        StockQuantity: Number(form.StockQuantity),
        SupplierID: form.SupplierID ? Number(form.SupplierID) : null,
      };
      if (editing) {
        await productsApi.update(editing.ProductID, payload);
      } else {
        await productsApi.create(payload);
      }
      setModalOpen(false);
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Remove "${product.ProductName}" from the register?`)) return;
    try {
      await productsApi.remove(product.ProductID);
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Stock register</div>
          <h1>Products</h1>
          <div className="page-desc">Every item on the shelf, its price, and what's left.</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add product
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="table-wrap">
        {loading ? (
          <div className="loading-line" style={{ padding: 20 }}>Loading products…</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="eyebrow">Shelf is empty</div>
            Add your first product to start the register.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.ProductID}>
                  <td className="num">{p.ProductID}</td>
                  <td>{p.ProductName}</td>
                  <td>{supplierName(p.SupplierID)}</td>
                  <td className="num">${Number(p.Price).toFixed(2)}</td>
                  <td>
                    <span className={`tag-pill num${p.StockQuantity <= 10 ? ' low' : ''}`}>
                      {p.StockQuantity} units
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit product' : 'Add product'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Product name</label>
              <input
                value={form.ProductName}
                onChange={(e) => setForm({ ...form, ProductName: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="field">
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.Price}
                onChange={(e) => setForm({ ...form, Price: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Stock quantity</label>
              <input
                type="number"
                min="0"
                value={form.StockQuantity}
                onChange={(e) => setForm({ ...form, StockQuantity: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Supplier</label>
              <select
                value={form.SupplierID}
                onChange={(e) => setForm({ ...form, SupplierID: e.target.value })}
              >
                <option value="">— none —</option>
                {suppliers.map((s) => (
                  <option key={s.SupplierID} value={s.SupplierID}>
                    {s.SupplierName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add product'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
