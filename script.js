// Добавьте в конец body или в отдельный файл script.js

const navMenu = document.querySelector('.nav-menu')



// Smooth scroll animation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer для анимации появления элементов
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми элементами с классами анимации
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});


// Custom Scroll Progress Bar
function initCustomScrollbar() {
    // Create scroll progress bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);
    

    
 
    
    // Update scroll progress
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
        
        // Update active dot based on scroll position
        const dots = document.querySelectorAll('.scroll-dot');
        const currentSection = Math.floor((scrollPercent / 100) * sections.length);
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSection);
        });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', updateScrollProgress);
    
    // Initial update
    updateScrollProgress();
}

// Initialize custom scrollbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCustomScrollbar();
});

// Интерактивные изображения для секции services
// Carousel functionality for service images
function initServiceCarousels() {
    const serviceImages = document.querySelectorAll('.service-image');
    console.log('Found service images:', serviceImages.length);
    
    serviceImages.forEach((serviceImage, serviceIndex) => {
        const carousel = serviceImage.querySelector('.carousel-container');
        if (!carousel) {
            console.log(`No carousel found for service ${serviceIndex}`);
            return;
        }
        
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.dot');
        
        console.log(`Service ${serviceIndex}: Found ${slides.length} slides, ${dots.length} dots`);
        
        // Берём текст из соответствующей услуги (слева) и применяем ко всем слайдам этой карусели
        const serviceKey = serviceImage.dataset.service;
        const sourceOverlay = document.querySelector(`.service-tab-vertical[data-service="${serviceKey}"] .image-overlay`);
        if (sourceOverlay) {
            const titleText = sourceOverlay.querySelector('h3')?.textContent?.trim() || '';
            const descText = sourceOverlay.querySelector('p')?.textContent?.trim() || '';
            slides.forEach(slide => {
                const overlay = slide.querySelector('.image-overlay');
                if (!overlay) return;
                const h3 = overlay.querySelector('h3');
                const p = overlay.querySelector('p');
                if (h3 && titleText) h3.textContent = titleText;
                if (p && descText) p.textContent = descText;
            });
        } else {
            console.warn(`No source overlay found for service "${serviceKey}"`);
        }
        
        // Поддержка обеихх структур кнопок
        let prevBtn = carousel.querySelector('.carousel-nav-side.prev-btn');
        let nextBtn = carousel.querySelector('.carousel-nav-side.next-btn');
        
        console.log(`Service ${serviceIndex}: Found prev button:`, !!prevBtn, 'next button:', !!nextBtn);
        
        // Если не найдены новые кнопки, ищем старые
        if (!prevBtn) {
            prevBtn = carousel.querySelector('.carousel-btn.prev-btn');
            console.log(`Service ${serviceIndex}: Fallback prev button found:`, !!prevBtn);
        }
        if (!nextBtn) {
            nextBtn = carousel.querySelector('.carousel-btn.next-btn');
            console.log(`Service ${serviceIndex}: Fallback next button found:`, !!nextBtn);
        }
        
        // Проверяем что кнопки найдены
        if (!prevBtn || !nextBtn) {
            console.warn(`Carousel buttons not found for service ${serviceIndex}:`, {
                prevBtn: !!prevBtn,
                nextBtn: !!nextBtn,
                service: serviceImage.dataset.service
            });
            return;
        }
        
        // Берём трек карусели и валидируем
        const track = carousel.querySelector('.carousel-track');
        if (!track || slides.length === 0) {
            console.warn(`Carousel track or slides not found for service ${serviceIndex}`);
            return;
        }
        
        let currentSlide = 0; // убрали переменные для автослайда
        
        // Функция показа нужного слайда + сдвиг трека
        function showSlide(slideIndex) {
            const normalizedIndex = ((slideIndex % slides.length) + slides.length) % slides.length;
            console.log(`Service ${serviceIndex}: Showing slide ${normalizedIndex}`);
            
            // Полное перелистывание: каждый индекс = 100% ширины
            track.style.transform = `translateX(-${normalizedIndex * 100}%)`;
            
            // Обновляем классы
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === normalizedIndex);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === normalizedIndex);
            });
            currentSlide = normalizedIndex;
        }
        
        // Инициализация: показываем первый слайд
        showSlide(0);
        
        // Функции навигации
        function nextSlide() {
            const next = currentSlide + 1;
            console.log(`Service ${serviceIndex}: Next slide ${currentSlide} -> ${next}`);
            showSlide(next);
        }
        function prevSlide() {
            const prev = currentSlide - 1;
            console.log(`Service ${serviceIndex}: Prev slide ${currentSlide} -> ${prev}`);
            showSlide(prev);
        }
        
        // Кнопки навигации (без автослайда)
        prevBtn.addEventListener('click', (e) => {
            console.log(`Service ${serviceIndex}: Prev button clicked`);
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
        });
        nextBtn.addEventListener('click', (e) => {
            console.log(`Service ${serviceIndex}: Next button clicked`);
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
        });
        
        // Точки (без автослайда)
        dots.forEach((dot, dotIndex) => {
            dot.addEventListener('click', (e) => {
                console.log(`Service ${serviceIndex}: Dot ${dotIndex} clicked`);
                e.preventDefault();
                e.stopPropagation();
                showSlide(dotIndex);
            });
        });
        
        // Свайпы (без автослайда)
        let touchStartX = 0;
        let touchEndX = 0;
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
        
        // Клавиатура (без автослайда)
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        });
        
        // Делаем карусель фокусируемой
        carousel.setAttribute('tabindex', '0');
        
        console.log(`Service ${serviceIndex}: Carousel initialized without auto-play`);
    });
}

// Updated initServicesImages function to work with carousel
function initServicesImages() {
    const serviceTabs = document.querySelectorAll('.service-tab-vertical');
    const serviceImages = document.querySelectorAll('.services-images .service-image');
    
    if (!serviceTabs.length || !serviceImages.length) return;
    
    // Initialize carousels
    initServiceCarousels();
    
    // Проверяем, мобильное ли устройство
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Мобильная логика - клик для показа/скрытия
        serviceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const service = tab.getAttribute('data-service');
                const targetImage = tab.querySelector('.service-image');
                
                // Проверяем, активен ли уже этот таб
                const isActive = tab.classList.contains('mobile-active');
                
                // Закрываем все активные табы и изображения
                serviceTabs.forEach(t => {
                    t.classList.remove('mobile-active');
                    const img = t.querySelector('.service-image');
                    if (img) img.classList.remove('mobile-active');
                });
                
                // Если таб не был активен, открываем его
                if (!isActive && targetImage) {
                    tab.classList.add('mobile-active');
                    targetImage.classList.add('mobile-active');
                }
            });
        });
    }
    else {
        // Desktop логика - hover для показа изображений
        serviceTabs.forEach(tab => {
            tab.addEventListener('mouseenter', () => {
                const service = tab.getAttribute('data-service');
                
                // Скрыть все изображения
                serviceImages.forEach(img => {
                    img.classList.remove('active');
                });
                
                // Показать соответствующее изображение
                const targetImage = document.querySelector(`.services-images .service-image[data-service="${service}"]`);
                if (targetImage) {
                    setTimeout(() => {
                        targetImage.classList.add('active');

                        // Сброс карусели на первый слайд для показанного изображения
                        const carousel = targetImage.querySelector('.carousel-container');
                        if (carousel && typeof carousel.resetToFirst === 'function') {
                            carousel.resetToFirst();
                        } else if (carousel) {
                            // Фолбэк: прямое обновление DOM
                            const track = carousel.querySelector('.carousel-track');
                            const slides = carousel.querySelectorAll('.carousel-slide');
                            const dots = carousel.querySelectorAll('.dot');
                            if (track && slides.length) {
                                track.style.transform = 'translateX(0%)';
                                slides.forEach((s, i) => s.classList.toggle('active', i === 0));
                                dots.forEach((d, i) => d.classList.toggle('active', i === 0));
                            }
                        }
                    }, 100);
                }
            });
        });
        
        // Скрыть все изображения только при полном уходе курсора из всей секции services-tabs
        const servicesSection = document.querySelector('.services-tabs');
        if (servicesSection) {
            servicesSection.addEventListener('mouseleave', () => {
                serviceImages.forEach(img => {
                    img.classList.remove('active');
                });
            });
        }
    }
    
    // Обновляем логику при изменении размера окна
    window.addEventListener('resize', () => {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
            location.reload();
        }
    });
}


// Параллакс эффект для секции services-tabs
function initServicesParallax() {
    const servicesSection = document.querySelector('.services-tabs');
    const servicesTabs = document.querySelectorAll('.service-tab-vertical');
    const servicesContainer = document.querySelector('.services-container');
    const servicesImages = document.querySelector('.services-images');
    
    if (!servicesSection) return;
    
    function updateParallax() {
        const rect = servicesSection.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        
        // Параллакс для контейнера
        const containerOffset = (scrollProgress - 0.5) * 50;
        if (servicesContainer) {
            servicesContainer.style.transform = `translateZ(0) translateY(${containerOffset}px)`;
        }
        
        // Параллакс для изображений
        if (servicesImages) {
            const imageOffset = (scrollProgress - 0.5) * 30;
            servicesImages.style.transform = `translateZ(30px) scale(0.95) translateY(${imageOffset}px)`;
        }
        
        // Параллакс для отдельных табов
        servicesTabs.forEach((tab, index) => {
            const tabOffset = (scrollProgress - 0.5) * (20 + index * 5);
            const currentTransform = tab.style.transform || '';
            
            if (!tab.matches(':hover')) {
                const baseTransform = `translateZ(${25 + index * 5}px) scale(${0.975 - index * 0.005})`;
                tab.style.transform = `${baseTransform} translateY(${tabOffset}px)`;
            }
        });
    }
    
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll);
    updateParallax();
}

// Улучшенная анимация для секции FEATURES WORKS
function initProjectsScrollAnimation() {
    const projectsSection = document.querySelector('.projects-section');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!projectsSection || !projectCards.length) return;
    
    // Добавляем класс для анимации при скролле
    projectCards.forEach(card => {
        card.classList.add('animate-on-scroll');
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Запускаем анимацию карточек с задержками
                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 200);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(projectsSection);
}

// Анимация появления текста в секции services при скролле
function initServicesScrollAnimation() {
    // Полностью отключаем анимацию при скролле для сервисов
    // Элементы будут видны сразу
    return;
    
    /* Закомментированный код анимации
    const servicesSection = document.querySelector('.services-tabs');
    const servicesHeader = document.querySelector('.services-header');
    const servicesSubtitle = document.querySelector('.services-subtitle');
    const servicesTitle = document.querySelector('.services-main-title');
    const viewAllBtn = document.querySelector('.view-all-btn');
    const servicesTabs = document.querySelector('.services-tabs-vertical');
    const servicesImages = document.querySelector('.services-images');
    const serviceTabItems = document.querySelectorAll('.service-tab-vertical');
    
    if (servicesSection) {
        // Добавляем классы для анимации к элементам сервисов
        serviceTabItems.forEach(tab => {
            tab.classList.add('animate-on-scroll');
        });
        
        // Добавляем класс анимации к контейнеру табов
        if (servicesTabs) {
            servicesTabs.classList.add('animate-on-scroll');
        }
        
        // Создаем observer для отслеживания видимости
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Сначала показываем контейнер табов
                    setTimeout(() => {
                        if (servicesTabs) servicesTabs.classList.add('animate-in');
                    }, 200);
                    
                    // Запускаем анимации текстовых элементов с задержками
                    setTimeout(() => {
                        if (servicesSubtitle) servicesSubtitle.classList.add('animate-in');
                    }, 100);
                    
                    setTimeout(() => {
                        if (servicesTitle) servicesTitle.classList.add('animate-in');
                    }, 300);
                    
                    setTimeout(() => {
                        if (viewAllBtn) viewAllBtn.classList.add('animate-in');
                    }, 400);
                    
                    // Анимируем каждое название сервиса с задержкой
                    serviceTabItems.forEach((tab, index) => {
                        setTimeout(() => {
                            tab.classList.add('animate-in');
                        }, 600 + (index * 150)); // Задержка 150ms между каждым элементом
                    });
                    
                    // Отключаем observer после срабатывания
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });
        
        observer.observe(servicesSection);
    }
    */
}

// Инициализируем анимацию при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initServicesImages();
    initServicesParallax();
    initProjectsScrollAnimation();
    initServicesScrollAnimation(); // Добавляем вызов функции анимации services
});

// Scroll to Top Button Functionality
function initScrollToTop() {
	const scrollToTopBtn = document.getElementById('scrollToTop');
	
	if (!scrollToTopBtn) return;
	
	// Show/hide button based on scroll position
	function toggleScrollButton() {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			const showThreshold = 300; // Show button after scrolling 300px
			
			if (scrollTop > showThreshold) {
					scrollToTopBtn.classList.add('visible');
			} else {
					scrollToTopBtn.classList.remove('visible');
			}
	}
	
	// Smooth scroll to top
	function scrollToTop() {
			window.scrollTo({
					top: 0,
					behavior: 'smooth'
			});
	}
	
	// Event listeners
	window.addEventListener('scroll', toggleScrollButton);
	scrollToTopBtn.addEventListener('click', scrollToTop);
	
	// Initial check
	toggleScrollButton();
}

// Initialize scroll to top when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {

	initScrollToTop();
});


// Testimonials Slider
function initTestimonialsSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const textSlides = document.querySelectorAll('.testimonial-text-slide');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    // Добавляем мобильные кнопки
    const prevBtnMobile = document.getElementById('prevTestimonialMobile');
    const nextBtnMobile = document.getElementById('nextTestimonialMobile');
    const sliderContainer = document.querySelector('.testimonials-center');
    let currentSlide = 0;
    let autoSlideInterval;
    let isHovered = false;
    
    // Touch/Swipe variables
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    let threshold = 50; // minimum distance for swipe
    let restraint = 100; // maximum distance perpendicular to swipe direction
    let allowedTime = 300; // maximum time allowed to travel that distance
    let elapsedTime = 0;
    let startTime = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        textSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = slides.length - 1;
        }
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        if (!isHovered) {
            autoSlideInterval = setInterval(() => {
                nextSlide();
            }, 5000);
        }
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Touch event handlers
    function handleTouchStart(e) {
        const touchobj = e.changedTouches[0];
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime();
        stopAutoSlide();
    }

    function handleTouchMove(e) {
        e.preventDefault(); // prevent scrolling when inside DIV
    }

    function handleTouchEnd(e) {
        const touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        
        if (elapsedTime <= allowedTime) {
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                if (distX > 0) {
                    // Swipe right - previous slide
                    prevSlide();
                } else {
                    // Swipe left - next slide
                    nextSlide();
                }
            }
        }
        startAutoSlide();
    }

    // Функция для добавления обработчиков к кнопкам
    function addButtonListeners(prevButton, nextButton) {
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                stopAutoSlide();
                nextSlide();
                setTimeout(startAutoSlide, 1000);
            });
            nextButton.addEventListener('mouseenter', () => {
                isHovered = true;
                stopAutoSlide();
            });
            nextButton.addEventListener('mouseleave', () => {
                isHovered = false;
                startAutoSlide();
            });
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                stopAutoSlide();
                prevSlide();
                setTimeout(startAutoSlide, 1000);
            });
            prevButton.addEventListener('mouseenter', () => {
                isHovered = true;
                stopAutoSlide();
            });
            prevButton.addEventListener('mouseleave', () => {
                isHovered = false;
                startAutoSlide();
            });
        }
    }

    // Добавляем обработчики для десктопных кнопок
    addButtonListeners(prevBtn, nextBtn);
    
    // Добавляем обработчики для мобильных кнопок
    addButtonListeners(prevBtnMobile, nextBtnMobile);

    // Touch event listeners for swipe functionality
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
        sliderContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        sliderContainer.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    // Initialize
    showSlide(currentSlide);
    startAutoSlide();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTestimonialsSlider();
});


// Hero Arrow Click Handler
function initHeroArrow() {
    const heroArrow = document.querySelector('.hero-arrow');
    const aboutSection = document.querySelector('.about-section');
    
    if (heroArrow && aboutSection) {
        heroArrow.addEventListener('click', function() {
            aboutSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

// Initialize hero arrow on page load
document.addEventListener('DOMContentLoaded', function() {
    initHeroArrow();
});


// Dropdown functionality for mobile
function initDropdown() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    
    if (dropdown && dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
}

// Initialize dropdown on page load
document.addEventListener('DOMContentLoaded', function() {
    initDropdown();
});

// SMS Consent Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const openConsentModal = document.getElementById('openConsentModal');
    const consentModal = document.getElementById('consentModal');
    const closeConsentModal = document.getElementById('closeConsentModal');
    const acceptConsent = document.getElementById('acceptConsent');
    const declineConsent = document.getElementById('declineConsent');
    const consentCheckbox = document.getElementById('consent');

    // Open modal
    if (openConsentModal) {
        openConsentModal.addEventListener('click', function(e) {
            e.preventDefault();
            consentModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal function
    function closeModal() {
        consentModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Close modal events
    if (closeConsentModal) {
        closeConsentModal.addEventListener('click', closeModal);
    }

    // Close on backdrop click
    consentModal.addEventListener('click', function(e) {
        if (e.target === consentModal) {
            closeModal();
        }
    });

    // Accept consent
    if (acceptConsent) {
        acceptConsent.addEventListener('click', function() {
            consentCheckbox.checked = true;
            closeModal();
        });
    }

    // Decline consent
    if (declineConsent) {
        declineConsent.addEventListener('click', function() {
            consentCheckbox.checked = false;
            closeModal();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && consentModal.classList.contains('show')) {
            closeModal();
        }
    });
});
