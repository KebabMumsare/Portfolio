const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
// Theme switching
function toggleTheme() {
    const isDark = body.hasAttribute('data-theme');
    if (isDark) {
        body.removeAttribute('data-theme');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
        localStorage.setItem('theme', 'dark');
    }
}
// Event listeners
themeToggle.addEventListener('click', toggleTheme);
// Load saved theme or default to dark
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        toggleTheme(); // Switch to light mode if saved preference is light
    }
    // Otherwise, keep dark mode as default
});