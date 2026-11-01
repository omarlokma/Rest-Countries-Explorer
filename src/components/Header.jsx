import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-border)] transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">

        {/* Left: Logo + Title */}
        <Link to="/" className="flex items-center gap-2.5 group">
          {/* Minimal Globe Icon */}
          <div className="w-7 h-7 rounded-md bg-[var(--color-ink)] flex items-center justify-center transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-[var(--color-accent-text)]">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-[15px] tracking-tight text-[var(--color-ink)] transition-colors">
              World Explorer
            </span>
            <span className="label-caps text-[var(--color-ink-tertiary)] hidden sm:inline transition-colors">
              Global Index
            </span>
          </div>
        </Link>

        {/* Right: Theme Toggle */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="h-8 px-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)] text-xs font-medium flex items-center gap-2 cursor-pointer transition-all duration-200 active:scale-[0.98]"
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              <span>Light</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <span>Dark</span>
            </>
          )}
        </button>

      </div>
    </header>
  );
}

export default Header;
