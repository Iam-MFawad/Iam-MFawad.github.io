(function () {
  const button = document.getElementById('themeToggle');
  let saved;
  try { saved = localStorage.getItem('theme'); } catch (_) {}
  const dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  function apply(value) {
    document.body.classList.toggle('dark', value);
    if (button) {
      button.textContent = value ? 'Light mode' : 'Dark mode';
      button.setAttribute('aria-pressed', String(value));
      button.setAttribute('aria-label', value ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }
  apply(dark);
  if (button) button.addEventListener('click', function () {
    const value = !document.body.classList.contains('dark');
    apply(value);
    try { localStorage.setItem('theme', value ? 'dark' : 'light'); } catch (_) {}
  });
})();
