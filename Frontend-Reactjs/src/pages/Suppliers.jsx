// src/pages/Suppliers.jsx
import { useEffect, useState } from 'react';
import { suppliersApi } from '../api/resources';
import Modal from '../components/Modal';

const emptyForm = { SupplierName: '', ContactNumber: '' };

export default function Suppliers() {
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
      setSuppliers(await suppliersApi.list());
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(supplier) {
    setEditing(supplier);
    setForm({ SupplierName: supplier.SupplierName || '', ContactNumber: supplier.ContactNumber || '' });
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await suppliersApi.update(editing.SupplierID, form);
      } else {
        await suppliersApi.create(form);
      }
      setModalOpen(false);
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(supplier) {
    if (!confirm(`Remove supplier "${supplier.SupplierName}"?`)) return;
    try {
      await suppliersApi.remove(supplier.SupplierID);
      await loadAll();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Supplier file</div>
          <h1>Suppliers</h1>
          <div className="page-desc">Who brings in the stock, and how to reach them.</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add supplier
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="table-wrap">
        {loading ? (
          <div className="loading-line" style={{ padding: 20 }}>Loading suppliers…</div>
        ) : suppliers.length === 0 ? (
          <div className="empty-state">
            <div className="eyebrow">No suppliers yet</div>
            Add one to start assigning products.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Supplier</th>
                <th>Contact number</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.SupplierID}>
                  <td className="num">{s.SupplierID}</td>
                  <td>{s.SupplierName}</td>
                  <td className="num">{s.ContactNumber || '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-sm" onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit supplier' : 'Add supplier'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Supplier name</label>
              <input
                value={form.SupplierName}
                onChange={(e) => setForm({ ...form, SupplierName: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="field">
              <label>Contact number</label>
              <input
                value={form.ContactNumber}
                onChange={(e) => setForm({ ...form, ContactNumber: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add supplier'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
