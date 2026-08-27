// src/pages/Reports.jsx
import { useEffect, useState } from 'react';
import { reportsApi } from '../api/resources';

export default function Reports() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [totalSold, highestStock, suppliersF, neverSold, salesDetails] = await Promise.all([
          reportsApi.totalSoldPerProduct(),
          reportsApi.highestStockProduct().catch(() => null),
          reportsApi.suppliersStartingF(),
          reportsApi.neverSoldProducts(),
          reportsApi.salesDetails(),
        ]);
        if (!cancelled) {
          setData({ totalSold, highestStock, suppliersF, neverSold, salesDetails });
        }
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
          <div className="eyebrow">End of week</div>
          <h1>Reports</h1>
          <div className="page-desc">What's moving, what isn't, and who's supplying it.</div>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}
      {loading && <div className="loading-line">Running the numbers…</div>}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <ReportSection title="Total quantity sold per product">
            <table>
              <thead>
                <tr><th>Product</th><th>Total sold</th></tr>
              </thead>
              <tbody>
                {data.totalSold.map((row) => (
                  <tr key={row.ProductID}>
                    <td>{row.ProductName}</td>
                    <td className="num">{row.TotalQuantitySold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>

          <ReportSection title="Highest stock product">
            {data.highestStock ? (
              <div style={{ padding: '4px 4px 12px' }}>
                <strong>{data.highestStock.ProductName}</strong>{' '}
                <span className="num" style={{ color: 'var(--ink-soft)' }}>
                  — {data.highestStock.StockQuantity} units
                </span>
              </div>
            ) : (
              <div className="page-desc" style={{ padding: '4px 4px 12px' }}>No data.</div>
            )}
          </ReportSection>

          <ReportSection title="Suppliers starting with 'F'">
            <table>
              <thead>
                <tr><th>Supplier</th><th>Contact</th></tr>
              </thead>
              <tbody>
                {data.suppliersF.length === 0 ? (
                  <tr><td colSpan={2} style={{ color: 'var(--ink-soft)' }}>None found.</td></tr>
                ) : (
                  data.suppliersF.map((s) => (
                    <tr key={s.SupplierID}>
                      <td>{s.SupplierName}</td>
                      <td className="num">{s.ContactNumber || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ReportSection>

          <ReportSection title="Products never sold">
            <table>
              <thead>
                <tr><th>Product</th><th>Price</th><th>Stock</th></tr>
              </thead>
              <tbody>
                {data.neverSold.length === 0 ? (
                  <tr><td colSpan={3} style={{ color: 'var(--ink-soft)' }}>Everything has sold at least once.</td></tr>
                ) : (
                  data.neverSold.map((p) => (
                    <tr key={p.ProductID}>
                      <td>{p.ProductName}</td>
                      <td className="num">${Number(p.Price).toFixed(2)}</td>
                      <td className="num">{p.StockQuantity}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ReportSection>

          <ReportSection title="Sales, with product detail (JOIN)">
            <table>
              <thead>
                <tr><th>Sale #</th><th>Product</th><th>Qty</th><th>Date</th></tr>
              </thead>
              <tbody>
                {data.salesDetails.map((row) => (
                  <tr key={row.SaleID}>
                    <td className="num">{row.SaleID}</td>
                    <td>{row.ProductName}</td>
                    <td className="num">{row.QuantitySold}</td>
                    <td className="num">{row.SaleDate?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportSection>
        </div>
      )}
    </div>
  );
}

function ReportSection({ title, children }) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', background: 'var(--awning-tint)' }}>
        <div className="stat-label" style={{ margin: 0 }}>{title}</div>
      </div>
      <div className="table-wrap" style={{ border: 'none' }}>{children}</div>
    </div>
  );
}
