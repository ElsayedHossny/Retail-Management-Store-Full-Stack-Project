// src/pages/Sales.jsx
import { useEffect, useState } from 'react';
import { salesApi, productsApi } from '../api/resources';
import Modal from '../components/Modal';

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = { ProductID: '', QuantitySold: '', SaleDate: today() };

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filterProduct, setFilterProduct] = useState('');

  async function loadAll() {
    setLoading(true);
    setError('');
    try {
      const [s, p] = await Promise.all([salesApi.list(), productsApi.list()]);
      setSales(s);
      setProducts(p);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function productName(id) {
    return products.find((p) => p.ProductID === id)?.ProductName || `#${id}`;
  }

  async function handleFilter(id) {
    setFilterProduct(id);
    setLoading(true);
    try {
      setSales(id ? await salesApi.byProduct(id) : await salesApi.list());
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await salesApi.create({
        ProductID: Number(form.ProductID),
        QuantitySold: Number(form.QuantitySold),
        SaleDate: form.SaleDate,
      });
      setModalOpen(false);
      setForm(emptyForm);
      await handleFilter(filterProduct);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Sales log</div>
          <h1>Sales</h1>
          <div className="page-desc">Every sale rung up, and what's sold before.</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          + Record sale
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="field" style={{ maxWidth: 260, marginBottom: 16 }}>
        <label>Filter by product</label>
        <select value={filterProduct} onChange={(e) => handleFilter(e.target.value)}>
          <option value="">All products</option>
          {products.map((p) => (
            <option key={p.ProductID} value={p.ProductID}>
              {p.ProductName}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="loading-line" style={{ padding: 20 }}>Loading sales…</div>
        ) : sales.length === 0 ? (
          <div className="empty-state">
            <div className="eyebrow">No sales recorded</div>
            Record your first sale to see it here.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sale #</th>
                <th>Product</th>
                <th>Qty sold</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.SaleID}>
                  <td className="num">{s.SaleID}</td>
                  <td>{productName(s.ProductID)}</td>
                  <td className="num">{s.QuantitySold}</td>
                  <td className="num">{s.SaleDate?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title="Record a sale" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Product</label>
              <select
                value={form.ProductID}
                onChange={(e) => setForm({ ...form, ProductID: e.target.value })}
                required
                autoFocus
              >
                <option value="">Select a product…</option>
                {products.map((p) => (
                  <option key={p.ProductID} value={p.ProductID}>
                    {p.ProductName} ({p.StockQuantity} in stock)
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Quantity sold</label>
              <input
                type="number"
                min="1"
                value={form.QuantitySold}
                onChange={(e) => setForm({ ...form, QuantitySold: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Sale date</label>
              <input
                type="date"
                value={form.SaleDate}
                onChange={(e) => setForm({ ...form, SaleDate: e.target.value })}
                required
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Recording…' : 'Record sale'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
