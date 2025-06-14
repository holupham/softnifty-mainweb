// Dark Mode Toggle Functionality
class DarkModeManager {
    constructor() {
        this.init();
    }

    init() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (systemPrefersDark) {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }

        // Add event listener to toggle button
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        const html = document.documentElement;
        const toggleButton = document.getElementById('theme-toggle');
        
        if (theme === 'dark') {
            html.classList.add('dark');
            if (toggleButton) {
                toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
            }
        } else {
            html.classList.remove('dark');
            if (toggleButton) {
                toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
        
        localStorage.setItem('theme', theme);
        this.updateMetaThemeColor(theme);
    }

    toggleTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add a subtle animation to the toggle button
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.style.transform = 'scale(0.9)';
            setTimeout(() => {
                toggleButton.style.transform = 'scale(1)';
            }, 150);
        }
    }

    updateMetaThemeColor(theme) {
        // Update meta theme-color for mobile browsers
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#111827' : '#ffffff';
    }

    getCurrentTheme() {
        return localStorage.getItem('theme') || 'light';
    }
}

// Initialize dark mode manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.darkModeManager = new DarkModeManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkModeManager;
}