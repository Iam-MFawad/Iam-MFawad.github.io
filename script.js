(function () {
  const btn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    if (btn) btn.textContent = "☀️ Light";
  }

  if (btn) {
    btn.addEventListener("click", function () {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      btn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
})();
