// Mobile Navigation Manager
class MobileNavManager {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        // Get DOM elements
        this.menuButton = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navLinks = document.querySelectorAll('#mobile-menu a');
        
        if (!this.menuButton || !this.mobileMenu) {
            console.warn('Mobile navigation elements not found');
            return;
        }

        // Add event listeners
        this.menuButton.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Set up active link highlighting
        this.setupActiveLinks();
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.mobileMenu.classList.remove('hidden');
        this.menuButton.innerHTML = '<i class="fas fa-times"></i>';
        
        // Add animation classes
        this.mobileMenu.style.opacity = '0';
        this.mobileMenu.style.transform = 'translateY(-10px)';
        
        // Trigger animation
        requestAnimationFrame(() => {
            this.mobileMenu.style.transition = 'all 0.3s ease';
            this.mobileMenu.style.opacity = '1';
            this.mobileMenu.style.transform = 'translateY(0)';
        });
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Set focus to first menu item for accessibility
        const firstLink = this.mobileMenu.querySelector('a');
        if (firstLink) {
            firstLink.focus();
        }
    }

    closeMenu() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Animate out
        this.mobileMenu.style.transition = 'all 0.3s ease';
        this.mobileMenu.style.opacity = '0';
        this.mobileMenu.style.transform = 'translateY(-10px)';
        
        // Hide after animation
        setTimeout(() => {
            this.mobileMenu.classList.add('hidden');
            this.mobileMenu.style.transition = '';
        }, 300);
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    handleOutsideClick(e) {
        if (this.isOpen && 
            !this.mobileMenu.contains(e.target) && 
            !this.menuButton.contains(e.target)) {
            this.closeMenu();
        }
    }

    handleResize() {
        // Close mobile menu if window becomes wide enough for desktop nav
        if (window.innerWidth >= 768 && this.isOpen) {
            this.closeMenu();
        }
    }

    setupActiveLinks() {
        // Get current page URL
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Update active states for both desktop and mobile nav
        const allNavLinks = document.querySelectorAll('.nav-link');
        
        allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Remove existing active class
            link.classList.remove('active');
            
            // Check if this link matches current page
            if ((href === '#home' && (currentPage === 'index.html' || currentPage === '')) ||
                href === currentPage ||
                (href.startsWith('#') && currentPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Method to programmatically set active link
    setActiveLink(href) {
        const allNavLinks = document.querySelectorAll('.nav-link');
        
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }

    // Method to add smooth scroll behavior to anchor links
    setupSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    if (this.isOpen) {
                        this.closeMenu();
                    }
                    
                    // Smooth scroll to target
                    const offsetTop = target.offsetTop - 80; // Account for fixed header
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    this.setActiveLink(href);
                }
            });
        });
    }
}

// Scroll spy functionality
class ScrollSpy {
    constructor() {
        this.sections = [];
        this.init();
    }

    init() {
        // Get all sections with IDs
        this.sections = Array.from(document.querySelectorAll('section[id]'));
        
        if (this.sections.length === 0) return;
        
        // Set up intersection observer
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                rootMargin: '-80px 0px -50% 0px', // Account for fixed header
                threshold: 0.1
            }
        );
        
        // Observe all sections
        this.sections.forEach(section => {
            this.observer.observe(section);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const navLink = document.querySelector(`a[href="#${id}"]`);
                
                if (navLink && window.mobileNavManager) {
                    window.mobileNavManager.setActiveLink(`#${id}`);
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mobileNavManager = new MobileNavManager();
    window.mobileNavManager.setupSmoothScroll();
    
    // Initialize scroll spy
    window.scrollSpy = new ScrollSpy();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MobileNavManager, ScrollSpy };
}