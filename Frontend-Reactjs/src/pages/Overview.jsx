// src/pages/Overview.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi, suppliersApi, reportsApi } from '../api/resources';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [products, suppliers, topStock, neverSold] = await Promise.all([
          productsApi.list(),
          suppliersApi.list(),
          reportsApi.highestStockProduct().catch(() => null),
          reportsApi.neverSoldProducts().catch(() => []),
        ]);
        if (cancelled) return;
        const totalStockValue = products.reduce((sum, p) => sum + Number(p.Price) * p.StockQuantity, 0);
        const lowStock = products.filter((p) => p.StockQuantity <= 10);
        setStats({
          productCount: products.length,
          supplierCount: suppliers.length,
          totalStockValue,
          lowStock,
          topStock,
          neverSoldCount: neverSold.length,
        });
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error || err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">Today at the register</div>
          <h1>Overview</h1>
          <div className="page-desc">A quick read of stock, suppliers, and what's moving.</div>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loading-line">Loading ledger…</div>}

      {stats && (
        <>
          <div className="stat-grid">
            <div className="stat-tag">
              <div className="stat-label">Products on shelf</div>
              <div className="stat-value">{stats.productCount}</div>
              <div className="stat-sub">
                <Link to="/products">view register →</Link>
              </div>
            </div>
            <div className="stat-tag">
              <div className="stat-label">Suppliers on file</div>
              <div className="stat-value">{stats.supplierCount}</div>
              <div className="stat-sub">
                <Link to="/suppliers">view suppliers →</Link>
              </div>
            </div>
            <div className="stat-tag">
              <div className="stat-label">Stock on hand, valued</div>
              <div className="stat-value amber">${stats.totalStockValue.toFixed(2)}</div>
              <div className="stat-sub">price × quantity, all products</div>
            </div>
            <div className="stat-tag">
              <div className="stat-label">Low stock (&le;10 units)</div>
              <div className="stat-value" style={{ color: stats.lowStock.length ? 'var(--brick)' : undefined }}>
                {stats.lowStock.length}
              </div>
              <div className="stat-sub">needs reordering soon</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
            <div className="card" style={{ padding: '18px 20px' }}>
              <div className="stat-label" style={{ marginBottom: 10 }}>Best stocked product</div>
              {stats.topStock ? (
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 2 }}>
                    {stats.topStock.ProductName}
                  </div>
                  <div className="num" style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
                    {stats.topStock.StockQuantity} units on hand · ${Number(stats.topStock.Price).toFixed(2)} each
                  </div>
                </div>
              ) : (
                <div className="page-desc">No products yet.</div>
              )}
            </div>

            <div className="card" style={{ padding: '18px 20px' }}>
              <div className="stat-label" style={{ marginBottom: 10 }}>Never sold</div>
              <div className="stat-value" style={{ fontSize: 22 }}>{stats.neverSoldCount}</div>
              <div className="page-desc" style={{ marginTop: 4 }}>
                <Link to="/reports">see which ones →</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
