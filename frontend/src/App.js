import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import XSSDemo from './components/XSSDemo';
import SensitiveDataDemo from './components/SensitiveDataDemo';

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>TEHNIKE SIGURNOSNIH NAPADA</h1>
      <p>Odabir ranjivosti:</p>

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <Link to="/xss" style={buttonStyle}>XSS (Cross-site scripting)</Link>
        <Link to="/sensitive" style={buttonStyle}>Sensitive Data Exposure</Link>
      </div>

    </div>
  );
}

const buttonStyle = {
  display: 'inline-block',
  padding: '10px 16px',
  background: '#007bff',
  color: '#fff',
  borderRadius: 6,
  textDecoration: 'none',
  fontWeight: 600
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/xss" element={<PageContainer title="Cross-site scripting (XSS)"><XSSDemo /></PageContainer>} />
      <Route path="/sensitive" element={<PageContainer title="Nesigurna pohrana osjetljivih podataka (Sensitive Data Exposure)"><SensitiveDataDemo /></PageContainer>} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

function PageContainer({ title, children }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{title}</h2>
        <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>Natrag</Link>
      </div>

      <div style={{ marginTop: 12 }}>
        {children}
      </div>
    </div>
  );
}
