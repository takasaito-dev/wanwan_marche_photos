/**
 * Theme management utilities for light/dark mode toggle
 */

const THEME_KEY = 'theme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';

/**
 * Get current theme from localStorage or system preference
 * @returns {string} Current theme ('light' or 'dark')
 */
function getCurrentTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
        return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return THEME_DARK;
    }
    
    return THEME_LIGHT;
}

/**
 * Apply theme to document
 * @param {string} theme - Theme to apply ('light' or 'dark')
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    
    // Update toggle button
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = theme === THEME_LIGHT ? '🌙' : '☀️';
        toggleBtn.setAttribute('aria-label', 
            theme === THEME_LIGHT ? 'ダークモードに切り替え' : 'ライトモードに切り替え'
        );
    }
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
    applyTheme(newTheme);
}

/**
 * Initialize theme on page load
 */
export function initTheme() {
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
            }
        });
    }
}