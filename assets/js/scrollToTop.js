// Scroll to Top Functionality
class ScrollToTop {
    constructor() {
        this.button = null;
        this.init();
    }

    init() {
        this.createButton();
        this.setupEventListeners();
    }

    createButton() {
        // Remove existing button if any
        const existingButton = document.querySelector('.scroll-to-top');
        if (existingButton) {
            existingButton.remove();
        }

        // Create scroll to top button
        this.button = document.createElement('button');
        this.button.className = 'scroll-to-top';
        this.button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        this.button.setAttribute('aria-label', 'Scroll to top');
        this.button.setAttribute('title', 'Back to top');
        
        // Add click event
        this.button.addEventListener('click', () => this.scrollToTop());
        
        // Append to body
        document.body.appendChild(this.button);
    }

    setupEventListeners() {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.button.classList.remove('visible');
            } else {
                this.handleScroll();
            }
        });
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const showThreshold = 300; // Show button after scrolling 300px
        
        if (scrollTop > showThreshold) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    scrollToTop() {
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Alternative for browsers that don't support smooth scrolling
        if (!window.CSS || !CSS.supports('scroll-behavior', 'smooth')) {
            this.smoothScrollPolyfill();
        }
    }

    smoothScrollPolyfill() {
        const startPosition = window.pageYOffset;
        const startTime = performance.now();
        const duration = 800; // 800ms animation

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animateScroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition * (1 - ease));
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    }

    destroy() {
        if (this.button) {
            this.button.remove();
        }
        window.removeEventListener('scroll', this.handleScroll);
    }
}

// Initialize scroll to top when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollToTop();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollToTop;
}