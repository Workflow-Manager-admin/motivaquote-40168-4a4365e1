import React, { useState, useEffect } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [quote, setQuote] = useState(null);
  const [author, setAuthor] = useState(null);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(false);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch quote from backend
  // PUBLIC_INTERFACE
  const fetchQuote = async () => {
    setFade(false); // Start fade out
    setTimeout(async () => {
      setLoading(true);
      try {
        // Adjust for same-origin proxy if running locally in development
        const res = await fetch('/api/quote');
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        setQuote(data.quote || '');
        setAuthor(data.author || '');
      } catch (e) {
        setQuote('Could not fetch quote (backend unavailable?)');
        setAuthor('');
      } finally {
        setLoading(false);
        setFade(true); // Fade in
      }
    }, 180); // Duration of fade-out (must match CSS)
  };

  // Load on mount
  useEffect(() => {
    fetchQuote();
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div className="quote-container" style={{
          background: "var(--bg-secondary)",
          borderRadius: 14,
          maxWidth: 430,
          boxShadow: "0 2px 18px 0 rgba(20,28,41,0.06)",
          border: "1px solid var(--border-color)",
          padding: "40px 32px 32px 32px",
          minWidth: 320,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0 auto"
        }}>
          <div className={`motivational-quote${fade ? " fade-in" : " fade-out"}`}>
            <div style={{
              fontSize: '1.4rem',
              fontWeight: 500,
              marginBottom: 14,
              color: "var(--text-primary)"
            }}>
              {loading ? <span style={{ color: "var(--text-secondary)" }}>Loading...</span> : (quote || '')}
            </div>
            {author && <div style={{
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              fontStyle: 'italic',
              marginBottom: 18
            }}>
              — {author}
            </div>}
          </div>
          <button
            className="new-quote-btn"
            onClick={fetchQuote}
            disabled={loading}
          >
            {loading ? "…" : "New Quote"}
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
