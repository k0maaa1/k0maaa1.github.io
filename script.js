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
        // Убираем textArea - больше не нужен
        
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
            
            // Обновляем классы слайдов
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === normalizedIndex);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === normalizedIndex);
            });
            
            // Убираем обновление текста - его больше нет
            
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
    
    // Переменная для отслеживания последней активной услуги
    let lastActiveService = null;
    let firstTabActivated = false;
    
    // Функция для активации услуги
    function activateService(serviceKey, isAutoActivation = false) {
        // Скрыть все изображения
        serviceImages.forEach(img => {
            img.classList.remove('active');
        });
        
        // Убираем все активные классы со всех табов
        serviceTabs.forEach(tab => {
            tab.classList.remove('auto-active', 'permanently-active');
        });
        
        // Показать соответствующее изображение
        const targetImage = document.querySelector(`.services-images .service-image[data-service="${serviceKey}"]`);
        const targetTab = document.querySelector(`.service-tab-vertical[data-service="${serviceKey}"]`);
        
        if (targetImage) {
            targetImage.classList.add('active');
            lastActiveService = serviceKey;
            
            // Если это автоактивация первой услуги, добавляем специальный класс
            if (isAutoActivation && targetTab) {
                targetTab.classList.add('auto-active');
                firstTabActivated = true;
            } else if (targetTab) {
                // Для обычной активации добавляем permanently-active класс
                targetTab.classList.add('permanently-active');
            }

            // Сброс карусели на первый слайд для показанного изображения
            const carousel = targetImage.querySelector('.carousel-container');
            if (carousel) {
                const track = carousel.querySelector('.carousel-track');
                const slides = carousel.querySelectorAll('.carousel-slide');
                const dots = carousel.querySelectorAll('.dot');
                if (track && slides.length) {
                    track.style.transform = 'translateX(0%)';
                    slides.forEach((s, i) => s.classList.toggle('active', i === 0));
                    dots.forEach((d, i) => d.classList.toggle('active', i === 0));
                }
            }
        }
    }
    
    // Автоматическая активация первой услуги при появлении секции
    const servicesSection = document.querySelector('.services-tabs');
    if (servicesSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !lastActiveService) {
                    // Активируем первую услугу только если еще ничего не было активировано
                    const firstService = serviceTabs[0]?.getAttribute('data-service');
                    if (firstService) {
                        activateService(firstService, true); // true = автоактивация
                    }
                }
            });
        }, {
            threshold: 0.3 // Активируем когда 30% секции видно
        });
        
        observer.observe(servicesSection);
    }
    
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
                    lastActiveService = service;
                }
            });
        });
    }
    else {
        // Desktop логика - hover для показа изображений
        serviceTabs.forEach(tab => {
            tab.addEventListener('mouseenter', () => {
                const service = tab.getAttribute('data-service');
                // Убираем auto-active при наведении на любую услугу
                serviceTabs.forEach(t => t.classList.remove('auto-active'));
                activateService(service);
            });
        });
        
        // НЕ скрываем изображения при уходе курсора - оставляем последнюю выбранную
        // Убираем mouseleave обработчик для сохранения последней активной услуги
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
        
        // Убираем параллакс для контейнера (заголовок остается на месте)
        // const containerOffset = (scrollProgress - 0.5) * 50;
        // if (servicesContainer) {
        //     servicesContainer.style.transform = `translateZ(0) translateY(${containerOffset}px)`;
        // }
        
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


// Testimonials Grid Slider
function initTestimonialsSlider() {
    const groups = document.querySelectorAll('.testimonials-group');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentGroup = 0;
    let autoSlideInterval = null;
    let isHovered = false;
    let isInView = true; // Добавляем переменную для отслеживания видимости секции

    function showGroup(index) {
        groups.forEach((group, i) => {
            group.classList.toggle('active', i === index);
        });
        
        // Обновляем состояние кнопок
        if (prevBtn && nextBtn) {
            prevBtn.classList.toggle('active', false);
            nextBtn.classList.toggle('active', false);
            
            if (index === 0) {
                prevBtn.style.opacity = '0.5';
                nextBtn.style.opacity = '1';
                nextBtn.classList.add('active');
            } else if (index === groups.length - 1) {
                prevBtn.style.opacity = '1';
                nextBtn.style.opacity = '0.5';
                prevBtn.classList.add('active');
            } else {
                prevBtn.style.opacity = '1';
                nextBtn.style.opacity = '1';
            }
        }
    }

    function nextGroup() {
        if (currentGroup < groups.length - 1) {
            currentGroup++;
        } else {
            currentGroup = 0;
        }
        showGroup(currentGroup);
    }

    function prevGroup() {
        if (currentGroup > 0) {
            currentGroup--;
        } else {
            currentGroup = groups.length - 1;
        }
        showGroup(currentGroup);
    }

    function startAutoSlide() {
        // Сначала останавливаем существующий интервал
        stopAutoSlide();
        
        // Запускаем автослайд только если секция видна, не наведен курсор и есть группы
        if (isInView && !isHovered && groups.length > 1) {
            autoSlideInterval = setInterval(() => {
                if (isInView && !isHovered) { // Дополнительная проверка
                    nextGroup();
                }
            }, 6000);
        }
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    // Intersection Observer для отслеживания видимости секции с отзывами
    const testimonialsSection = document.querySelector('.testimonials-section');
    if (testimonialsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isInView = entry.isIntersecting;
                
                if (isInView) {
                    // Секция видна - запускаем автослайд
                    startAutoSlide();
                } else {
                    // Секция не видна - останавливаем автослайд
                    stopAutoSlide();
                }
            });
        }, {
            threshold: 0.3 // Останавливаем когда 70% секции скрыто
        });
        
        observer.observe(testimonialsSection);
    }

    // Обработчики кнопок
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextGroup();
            setTimeout(() => {
                if (!isHovered) {
                    startAutoSlide();
                }
            }, 2000);
        });
        
        nextBtn.addEventListener('mouseenter', () => {
            isHovered = true;
            stopAutoSlide();
        });
        
        nextBtn.addEventListener('mouseleave', () => {
            isHovered = false;
            setTimeout(startAutoSlide, 100); // Небольшая задержка
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevGroup();
            setTimeout(() => {
                if (!isHovered) {
                    startAutoSlide();
                }
            }, 2000);
        });
        
        prevBtn.addEventListener('mouseenter', () => {
            isHovered = true;
            stopAutoSlide();
        });
        
        prevBtn.addEventListener('mouseleave', () => {
            isHovered = false;
            setTimeout(startAutoSlide, 100); // Небольшая задержка
        });
    }

    // Обработчики для карточек отзывов
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            isHovered = true;
            stopAutoSlide();
        });
        
        card.addEventListener('mouseleave', () => {
            isHovered = false;
            setTimeout(startAutoSlide, 100); // Небольшая задержка
        });
    });

    // Touch/Swipe поддержка для мобильных
    const container = document.querySelector('.testimonials-grid-container');
    if (container) {
        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        const threshold = 50;
        const restraint = 100;
        const allowedTime = 300;
        let elapsedTime = 0;
        let startTime = 0;

        function handleTouchStart(e) {
            const touchobj = e.changedTouches[0];
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime();
            stopAutoSlide();
        }

        function handleTouchMove(e) {
            e.preventDefault();
        }

        function handleTouchEnd(e) {
            const touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX;
            distY = touchobj.pageY - startY;
            elapsedTime = new Date().getTime() - startTime;
            
            if (elapsedTime <= allowedTime) {
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                    if (distX > 0) {
                        prevGroup();
                    } else {
                        nextGroup();
                    }
                }
            }
            setTimeout(startAutoSlide, 2000);
        }

        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    // Инициализация
    if (groups.length > 0) {
        showGroup(currentGroup);
        startAutoSlide();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTestimonialsSlider();
});


// Hero Arrow Click Handler
function initHeroArrow() {
    const heroArrow = document.querySelector('.hero-arrow');
    const advantagesSection = document.querySelector('.advantages-section')
    
    if (heroArrow && advantagesSection) {
        heroArrow.addEventListener('click', function() {
            advantagesSection.scrollIntoView({
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



// Contact Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const openModalBtn = document.getElementById('openModalBtn');
    const contactModal = document.getElementById('contactModal');
    const closeModalBtn = contactModal?.querySelector('.modal-close');

    // Open contact modal
    if (openModalBtn && contactModal) {
        openModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            contactModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal function
    function closeContactModal() {
        if (contactModal) {
            contactModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    // Close modal on X button click
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeContactModal);
    }

    // Close on backdrop click
    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                closeContactModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && contactModal?.classList.contains('show')) {
            closeContactModal();
        }
    });
});

// Portfolio Modal Functionality
const portfolioData = {
	'herz-der-hauptstadt': {
		title: 'Wohnkomplex Herz der Hauptstadt',
		specs: ['72 m²', '3 Monate', 'Designer-Renovierung'],
		images: [
			'/assets/images/portfolio/card3/1.jpg',
			'/assets/images/portfolio/card3/2.jpg',
			'/assets/images/portfolio/card3/3.jpg',
			'/assets/images/portfolio/card3/4.jpg',
		],
	},
	oktoberfeld: {
		title: 'Wohnkomplex Oktoberfeld',
		specs: ['73 m²', '2 Monate', 'Komplettrenovierung'],
		images: [
			'/assets/images/portfolio/card1/1.png',
			'/assets/images/portfolio/card1/2.jpg',
			'/assets/images/portfolio/card1/3.jpg',
			'/assets/images/portfolio/card1/4.jpg',
			'/assets/images/portfolio/card1/5.png',
			'/assets/images/portfolio/card1/6.jpg',
			'/assets/images/portfolio/card1/7.jpg',
			'/assets/images/portfolio/card1/8.jpg',
			'/assets/images/portfolio/card1/9.jpg',
		],
	},
	'match-point': {
		title: 'Wohnkomplex Match Point',
		specs: ['87 m²', '3 Monate', 'Komplettrenovierung'],
		images: [
			'/assets/images/portfolio/card2/1.jpg',
			'/assets/images/portfolio/card2/5.jpg',
			'/assets/images/portfolio/card2/6.jpg',
			'/assets/images/portfolio/card2/7.jpg',
			'/assets/images/portfolio/card2/8.jpg',
		],
	},
}

let currentProject = null;
let currentImageIndex = 0;

// Initialize portfolio modal
function initPortfolioModal() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const modal = document.getElementById('portfolioModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.querySelector('.modal-overlay');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');

    // Add click handlers to portfolio cards
    portfolioCards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const projectKeys = Object.keys(portfolioData);
            const projectKey = projectKeys[index];
            if (projectKey) {
                openPortfolioModal(projectKey);
            }
        });
    });

    // Close modal handlers
    modalClose.addEventListener('click', closePortfolioModal);
    modalOverlay.addEventListener('click', closePortfolioModal);
    
    // Navigation handlers
    prevBtn.addEventListener('click', () => changeImage(-1));
    nextBtn.addEventListener('click', () => changeImage(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') closePortfolioModal();
            if (e.key === 'ArrowLeft') changeImage(-1);
            if (e.key === 'ArrowRight') changeImage(1);
        }
    });
}

function openPortfolioModal(projectKey) {
    const project = portfolioData[projectKey];
    if (!project) return;

    currentProject = project;
    currentImageIndex = 0;

    const modal = document.getElementById('portfolioModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalSpecs = document.getElementById('modalSpecs');
    
    // Update modal content
    modalTitle.textContent = project.title;
    modalSpecs.innerHTML = project.specs.map(spec => 
        `<span class="modal-spec">${spec}</span>`
    ).join('');

    // Generate thumbnails
    generateThumbnails();
    
    // Show first image
    updateMainImage();
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentProject = null;
    currentImageIndex = 0;
}

function generateThumbnails() {
    if (!currentProject) return;
    
    const thumbnailsContainer = document.getElementById('galleryThumbnails');
    thumbnailsContainer.innerHTML = '';
    
    currentProject.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="Thumbnail ${index + 1}" />`;
        
        thumbnail.addEventListener('click', () => {
            currentImageIndex = index;
            updateMainImage();
            updateThumbnailsActive();
        });
        
        thumbnailsContainer.appendChild(thumbnail);
    });
}

function updateMainImage() {
    if (!currentProject) return;
    
    const mainImage = document.getElementById('mainImage');
    mainImage.src = currentProject.images[currentImageIndex];
    mainImage.alt = `${currentProject.title} - Foto ${currentImageIndex + 1}`;
}

function updateThumbnailsActive() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
}

function changeImage(direction) {
    if (!currentProject) return;
    
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = currentProject.images.length - 1;
    } else if (currentImageIndex >= currentProject.images.length) {
        currentImageIndex = 0;
    }
    
    updateMainImage();
    updateThumbnailsActive();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initPortfolioModal();
});

// SMS Consent Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Consent Modal functionality
    const openConsentModal = document.getElementById('openConsentModal');
    const openConsentModalFooter = document.getElementById('openConsentModalFooter');
    const consentModal = document.getElementById('consentModal');
    const closeConsentModal = document.getElementById('closeConsentModal');
    const acceptConsent = document.getElementById('acceptConsent');
    const declineConsent = document.getElementById('declineConsent');
    const consentCheckbox = document.getElementById('consent');

    // Open modal function
    function openModal(e) {
        e.preventDefault();
        consentModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // Open modal events
    if (openConsentModal) {
        openConsentModal.addEventListener('click', openModal);
    }

    if (openConsentModalFooter) {
        openConsentModalFooter.addEventListener('click', openModal);
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
    if (consentModal) {
        consentModal.addEventListener('click', function(e) {
            if (e.target === consentModal) {
                closeModal();
            }
        });
    }

    // Accept consent
    if (acceptConsent) {
        acceptConsent.addEventListener('click', function() {
            if (consentCheckbox) {
                consentCheckbox.checked = true;
            }
            closeModal();
        });
    }

    // Decline consent
    if (declineConsent) {
        declineConsent.addEventListener('click', function() {
            closeModal();
        });
    }
});

// Hero Slideshow functionality
document.addEventListener('DOMContentLoaded', function() {
    let currentSlideIndex = 0;
    let slideInterval;
    
    // Получаем элементы после загрузки DOM
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    const heroSection = document.querySelector('.hero');

    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        if (slides[index]) {
            slides[index].classList.add('active');
        }
    }

    function nextSlide() {
        currentSlideIndex++;
        
        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = 0;
        }
        
        showSlide(currentSlideIndex);
    }

    function resetSlideInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Initialize slideshow
    function initHeroSlideshow() {
        if (slides.length > 0) {
            console.log('Initializing slideshow with', slides.length, 'slides');
            showSlide(0);
            resetSlideInterval();
        } else {
            console.log('No slides found');
        }
    }

    // Initialize slideshow
    initHeroSlideshow();

    // Pause slideshow on hover
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        heroSection.addEventListener('mouseleave', () => {
            resetSlideInterval();
        });
    }
});
