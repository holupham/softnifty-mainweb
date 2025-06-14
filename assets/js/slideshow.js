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
        this.createSlides();
        this.setupDots();
        this.setupControls();
        this.startAutoPlay();
        this.setupKeyboardControls();
        this.setupTouchControls();
    }

    createSlides() {
        // Create slide data
        this.slides = [
            {
                title: "Unleash Innovation Together",
                subtitle: "Transform your business with cutting-edge technology solutions",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                icon: "fas fa-rocket"
            },
            {
                title: "AI-Powered Solutions",
                subtitle: "Harness artificial intelligence to drive unprecedented growth",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                icon: "fas fa-robot"
            },
            {
                title: "Cloud Infrastructure",
                subtitle: "Scalable and secure cloud solutions for modern businesses",
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                icon: "fas fa-cloud"
            },
            {
                title: "Digital Transformation",
                subtitle: "Complete modernization of your business operations",
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                icon: "fas fa-sync-alt"
            },
            {
                title: "Expert Consultation",
                subtitle: "Strategic guidance from industry-leading professionals",
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                icon: "fas fa-users"
            }
        ];

        // Update hero section with first slide
        this.updateHeroContent(0);
    }

    setupDots() {
        const dotsContainer = document.querySelector('.absolute.bottom-8');
        if (!dotsContainer) return;

        // Clear existing dots
        dotsContainer.innerHTML = '';
        
        // Create dots container
        const dotsWrapper = document.createElement('div');
        dotsWrapper.className = 'flex space-x-3';
        
        // Create dots
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `slideshow-dot w-3 h-3 rounded-full transition-all duration-300 ${i === 0 ? 'bg-white scale-125' : 'bg-white/50'}`;
            dot.setAttribute('data-slide', i);
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsWrapper.appendChild(dot);
        }
        
        dotsContainer.appendChild(dotsWrapper);
    }

    setupControls() {
        // Create navigation arrows
        const heroSection = document.querySelector('#home');
        if (!heroSection) return;

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-10';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => this.previousSlide());
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-10';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => this.nextSlide());
        
        heroSection.appendChild(prevBtn);
        heroSection.appendChild(nextBtn);

        // Play/Pause button
        const playPauseBtn = document.createElement('button');
        playPauseBtn.className = 'absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 z-10';
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playPauseBtn.addEventListener('click', () => this.toggleAutoPlay());
        playPauseBtn.id = 'slideshow-play-pause';
        
        heroSection.appendChild(playPauseBtn);
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
        const heroImage = heroSection.querySelector('.hero-image-container > div');
        const icon = heroImage.querySelector('i');

        if (title && subtitle && heroImage && icon) {
            // Apply transition effect
            const transition = this.transitions[slideIndex];
            this.applyTransition(heroSection, transition);

            // Update content
            setTimeout(() => {
                title.innerHTML = slide.title.split(' ').map((word, index) => {
                    if (index === slide.title.split(' ').length - 1) {
                        return `<span class="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">${word}</span>`;
                    }
                    return word;
                }).join(' ');
                
                subtitle.textContent = slide.subtitle;
                heroImage.style.background = slide.background;
                icon.className = `${slide.icon} text-8xl text-white opacity-80`;
            }, 250);
        }

        // Update background
        heroSection.style.background = slide.background;
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
            if (index === this.currentSlide) {
                dot.className = 'slideshow-dot w-3 h-3 rounded-full bg-white scale-125 transition-all duration-300';
            } else {
                dot.className = 'slideshow-dot w-3 h-3 rounded-full bg-white/50 transition-all duration-300';
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
    window.slideshowManager = new SlideshowManager();
    window.animationObserver = new AnimationObserver();
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (window.slideshowManager) {
            window.slideshowManager.handleVisibilityChange();
        }
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SlideshowManager, AnimationObserver };
}