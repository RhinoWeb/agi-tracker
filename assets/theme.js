/* AGI Watch — theme toggle (shared by all pages). Runs before paint via defer-less include. */
(function () {
  'use strict';
  const KEY = 'agiwatch-theme';
  const saved = localStorage.getItem(KEY);
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.setAttribute('data-theme', saved);
  }
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const current = () =>
      document.documentElement.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const label = () => { btn.textContent = current() === 'dark' ? 'Light mode' : 'Dark mode'; };
    btn.addEventListener('click', function () {
      const next = current() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(KEY, next);
      label();
    });
    label();
  });
})();
