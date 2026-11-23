import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

/**
 * Safely register the offline PWA Service Worker only on real HTTPS/localhost origins.
 * Skipped cleanly inside file://, single-file offline bundles, or strict <iframe sandbox="allow-scripts">.
 */
if (typeof window !== 'undefined') {
  try {
    const proto = window.location?.protocol;
    const host = window.location?.hostname;
    const isSecureOrigin =
      proto === 'https:' || host === 'localhost' || host === '127.0.0.1';
    if (
      isSecureOrigin &&
      'serviceWorker' in navigator &&
      typeof navigator.serviceWorker?.register === 'function'
    ) {
      window.addEventListener('load', () => {
        try {
          void navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => {
            // Silently ignore if Service Worker is blocked by browser privacy/sandbox mode
          });
        } catch {
          // Ignore sandbox registration restrictions
        }
      });
    }
  } catch {
    // Ignore restricted window.location / navigator access in strict sandboxes
  }
}
