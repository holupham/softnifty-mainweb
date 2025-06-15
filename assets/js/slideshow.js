// Advanced Slideshow Manager
class SlideshowManager {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 5;
        this.isPlaying = true;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        this.transitions = ['fade', 'slide-left', 'slide-up', 'zoom-in', 'flip-card'];
        this.slides = [];
        this.init();
    }

    init() {
        // Clean up any existing slideshow elements
        this.cleanup();

        this.createSlides();
        this.setupDots();
        this.setupControls();
        this.startAutoPlay();
        this.setupKeyboardControls();
        this.setupTouchControls();
    }

    cleanup() {
        // Remove existing indicators
        const existingIndicators = document.querySelector('.slideshow-indicators');
        if (existingIndicators) {
            existingIndicators.remove();
        }

        // Remove existing navigation buttons
        const existingNavBtns = document.querySelectorAll('.slideshow-nav-btn');
        existingNavBtns.forEach(btn => btn.remove());

        // Remove old slideshow dots container
        const oldDotsContainer = document.querySelector('.absolute.bottom-8');
        if (oldDotsContainer) {
            oldDotsContainer.innerHTML = '';
        }
    }

    createSlides() {
        // Create slide data with enhanced backgrounds
        this.slides = [
            {
                title: "Unleash Innovation Together",
                subtitle: "Transform your business with cutting-edge technology solutions that drive unprecedented growth",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                image: "assets/images/slide_01.png"
            },
            {
                title: "AI-Powered Solutions",
                subtitle: "Harness artificial intelligence to drive unprecedented growth and competitive advantage",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                image: "assets/images/slide_02.png"
            },
            {
                title: "Cloud Infrastructure",
                subtitle: "Scalable and secure cloud solutions for modern businesses and digital transformation",
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                image: "assets/images/slide_03.png"
            },
            {
                title: "Digital Transformation",
                subtitle: "Complete modernization of your business operations with cutting-edge technology",
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                image: "assets/images/slide_04.png"
            },
            {
                title: "Expert Consultation",
                subtitle: "Strategic guidance from industry-leading professionals and technology experts",
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                image: "assets/images/slide_05.png"
            }
        ];

        // Preload images for better performance
        this.preloadImages();

        // Update hero section with first slide
        this.updateHeroContent(0);
    }

    preloadImages() {
        this.slides.forEach((slide, index) => {
            const img = new Image();
            img.onload = () => {
                console.log(`Slide ${index + 1} image loaded successfully`);
            };
            img.onerror = () => {
                console.warn(`Failed to load slide ${index + 1} image: ${slide.image}`);
                // Use a fallback gradient background
                slide.fallback = true;
            };
            img.src = slide.image;
        });
    }

    setupDots() {
        // Remove existing indicators container
        const existingContainer = document.querySelector('.slideshow-indicators');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Create new scrolling indicators container
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'slideshow-indicators';

        // Create dots
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `slideshow-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('data-slide', i);
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            indicatorsContainer.appendChild(dot);
        }

        // Append to hero section instead of body for scrolling behavior
        const heroSection = document.querySelector('#home');
        if (heroSection) {
            heroSection.appendChild(indicatorsContainer);
        }
    }

    setupControls() {
        // Remove existing controls
        const existingControls = document.querySelectorAll('.slideshow-nav-btn');
        existingControls.forEach(control => control.remove());

        const heroSection = document.querySelector('#home');
        if (!heroSection) return;

        // Previous button with improved styling
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slideshow-nav-btn prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.setAttribute('aria-label', 'Previous slide');
        prevBtn.addEventListener('click', () => this.previousSlide());

        // Next button with improved styling
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slideshow-nav-btn next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.setAttribute('aria-label', 'Next slide');
        nextBtn.addEventListener('click', () => this.nextSlide());

        // Append buttons to hero section
        heroSection.appendChild(prevBtn);
        heroSection.appendChild(nextBtn);
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
                case ' ': // Spacebar
                    e.preventDefault();
                    this.toggleAutoPlay();
                    break;
            }
        });
    }

    setupTouchControls() {
        const heroSection = document.querySelector('#home');
        if (!heroSection) return;

        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        heroSection.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        heroSection.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        });
    }

    handleSwipe(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        // Horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.previousSlide();
            } else {
                this.nextSlide();
            }
        }
    }

    updateHeroContent(slideIndex) {
        const slide = this.slides[slideIndex];
        const heroSection = document.querySelector('#home');
        const title = heroSection.querySelector('h1');
        const subtitle = heroSection.querySelector('p');
        const heroImageContainer = heroSection.querySelector('.hero-image-container');

        if (title && subtitle && heroImageContainer) {
            // Apply transition effect
            const transition = this.transitions[slideIndex];
            this.applyTransition(heroSection, transition);

            // Update content with enhanced styling
            setTimeout(() => {
                // Enhanced title with gradient effect on last word
                const words = slide.title.split(' ');
                const lastWordIndex = words.length - 1;
                title.innerHTML = words.map((word, index) => {
                    if (index === lastWordIndex) {
                        return `<span class="gradient-text">${word}</span>`;
                    }
                    return word;
                }).join(' ');

                subtitle.textContent = slide.subtitle;

                // Enhanced image loading with fallback
                if (slide.fallback) {
                    // Use gradient background as fallback
                    heroImageContainer.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center" style="background: ${slide.background}">
                            <i class="fas fa-laptop-code text-8xl text-white opacity-60"></i>
                        </div>
                    `;
                } else {
                    // Load actual image
                    heroImageContainer.innerHTML = `
                        <img src="${slide.image}"
                             alt="${slide.title}"
                             class="slideshow-image w-full h-full object-cover object-top-right"
                             style="opacity: 0; transition: opacity 0.5s ease-in-out;"
                             onload="this.style.opacity='0.7'; this.classList.add('loaded')"
                             onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center\\' style=\\'background: ${slide.background}\\'><i class=\\'fas fa-laptop-code text-8xl text-white opacity-60\\'></i></div>'">
                    `;
                }
            }, 250);
        }

        // Update background with enhanced gradient and overlay
        if (heroSection) {
            heroSection.style.background = slide.background;
            // Add subtle overlay for better text contrast
            const overlay = heroSection.querySelector('.hero-overlay') || document.createElement('div');
            if (!heroSection.querySelector('.hero-overlay')) {
                overlay.className = 'hero-overlay absolute inset-0 bg-black bg-opacity-20 pointer-events-none';
                overlay.style.zIndex = '5';
                heroSection.appendChild(overlay);
            }
        }
    }

    applyTransition(element, transition) {
        const content = element.querySelector('.grid');
        if (!content) return;

        switch(transition) {
            case 'fade':
                content.style.opacity = '0';
                setTimeout(() => {
                    content.style.transition = 'opacity 0.5s ease';
                    content.style.opacity = '1';
                }, 50);
                break;

            case 'slide-left':
                content.style.transform = 'translateX(-100%)';
                setTimeout(() => {
                    content.style.transition = 'transform 0.5s ease';
                    content.style.transform = 'translateX(0)';
                }, 50);
                break;

            case 'slide-up':
                content.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    content.style.transition = 'transform 0.5s ease';
                    content.style.transform = 'translateY(0)';
                }, 50);
                break;

            case 'zoom-in':
                content.style.transform = 'scale(0.8)';
                content.style.opacity = '0';
                setTimeout(() => {
                    content.style.transition = 'all 0.5s ease';
                    content.style.transform = 'scale(1)';
                    content.style.opacity = '1';
                }, 50);
                break;

            case 'flip-card':
                content.style.transform = 'rotateY(90deg)';
                setTimeout(() => {
                    content.style.transition = 'transform 0.6s ease';
                    content.style.transform = 'rotateY(0deg)';
                }, 50);
                break;
        }

        // Reset transition after animation
        setTimeout(() => {
            content.style.transition = '';
        }, 600);
    }

    updateDots() {
        const dots = document.querySelectorAll('.slideshow-dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === this.currentSlide) {
                dot.classList.add('active');
            }
        });
    }

    goToSlide(slideIndex) {
        if (slideIndex === this.currentSlide) return;
        
        this.currentSlide = slideIndex;
        this.updateHeroContent(slideIndex);
        this.updateDots();
        
        // Reset auto-play timer
        if (this.isPlaying) {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
        
        this.isPlaying = true;
        this.updatePlayPauseButton();
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        
        this.isPlaying = false;
        this.updatePlayPauseButton();
    }

    toggleAutoPlay() {
        if (this.isPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }

    updatePlayPauseButton() {
        const button = document.getElementById('slideshow-play-pause');
        if (button) {
            button.innerHTML = this.isPlaying ? 
                '<i class="fas fa-pause"></i>' : 
                '<i class="fas fa-play"></i>';
        }
    }

    // Pause slideshow when page is not visible
    handleVisibilityChange() {
        if (document.hidden) {
            this.stopAutoPlay();
        } else if (this.isPlaying) {
            this.startAutoPlay();
        }
    }

    destroy() {
        this.stopAutoPlay();
        // Remove event listeners and clean up
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
}

// Intersection Observer for animations
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        // Set up intersection observer for scroll animations
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.fade-in, .animate-on-scroll');
        animatedElements.forEach(el => this.observer.observe(el));
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'animated');
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const slideshowManager = new SlideshowManager();
    const animationObserver = new AnimationObserver();

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (slideshowManager) {
            slideshowManager.handleVisibilityChange();
        }
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SlideshowManager, AnimationObserver };
}
