// src/components/Layout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Overview", end: true },
  { to: "/products", label: "Products" },
  { to: "/suppliers", label: "Suppliers" },
  { to: "/sales", label: "Sales" },
  { to: "/reports", label: "Reports" },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">Store Managment</div>
          <div className="brand-sub">Stockroom &amp; Sales</div>
        </div>

        <nav className="nav-group">
          <div className="nav-label">Register</div>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              <span className="dot" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <span>{user?.username || user?.email || "store_manager"}</span>
            <button className="logout-btn" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
