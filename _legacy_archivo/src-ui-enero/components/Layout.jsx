import React from "react";
import "./Layout.css";

const Layout = ({ children }) => (
  <div className="main-layout">
    <header>
      <h2>FutPro 2.0</h2>
    </header>
    <main>{children}</main>
    <footer>
      <small>© 2025 FutPro</small>
    </footer>
  </div>
);

export default Layout;
