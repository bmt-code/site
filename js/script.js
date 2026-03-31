document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page || '';

    // Shared state — assigned later by workflow section
    let resetToGridView = () => {};
    let chapterObserver = null;

    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll'); // Optional: prevent scrolling when menu is open
        });

        // Close menu when a link is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('is-open')) {
                    menuToggle.classList.remove('is-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mainNav.classList.remove('is-open');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    // 2.5. Nav Dropdown (Products)
    const navDropdown = document.querySelector('.nav-dropdown');
    const dropdownTrigger = document.querySelector('.nav-dropdown__trigger');
    const dropdownMenu = document.querySelector('.nav-dropdown__menu');

    if (navDropdown && dropdownTrigger) {
        const isMobileNav = () => window.matchMedia('(max-width: 992px)').matches;

        // Desktop: hover to open
        navDropdown.addEventListener('mouseenter', () => {
            if (!isMobileNav()) {
                navDropdown.classList.add('is-open');
                dropdownTrigger.setAttribute('aria-expanded', 'true');
            }
        });

        navDropdown.addEventListener('mouseleave', () => {
            if (!isMobileNav()) {
                navDropdown.classList.remove('is-open');
                dropdownTrigger.setAttribute('aria-expanded', 'false');
            }
        });

        // Mobile + desktop click: toggle
        dropdownTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = navDropdown.classList.toggle('is-open');
            dropdownTrigger.setAttribute('aria-expanded', isOpen);
        });

        // Close dropdown when a dropdown link is clicked
        if (dropdownMenu) {
            dropdownMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navDropdown.classList.remove('is-open');
                    dropdownTrigger.setAttribute('aria-expanded', 'false');

                    // Also close mobile menu if open
                    if (mainNav && mainNav.classList.contains('is-open')) {
                        menuToggle.classList.remove('is-open');
                        menuToggle.setAttribute('aria-expanded', 'false');
                        mainNav.classList.remove('is-open');
                        document.body.classList.remove('no-scroll');
                    }
                });
            });
        }

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!navDropdown.contains(e.target)) {
                navDropdown.classList.remove('is-open');
                dropdownTrigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ── Orion-page only ──────────────────────────────────────────────
    if (page === 'orion') {

    // 3. Feature Videos Interaction (Autoplay on Mobile, Hover on Desktop)
    const handleFeatureVideos = () => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const featureRows = document.querySelectorAll('#funcionalidades .feature-row');

        if (isMobile) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target.querySelector('video');
                    const overlay = entry.target.querySelector('.play-overlay');
                    if (entry.isIntersecting) {
                        video.play().catch(error => console.error("Video autoplay failed:", error));
                        if (overlay) overlay.style.opacity = '0';
                    } else {
                        video.pause();
                        if (overlay) overlay.style.opacity = '1';
                    }
                });
            }, { rootMargin: '0px', threshold: 0.3 });

            featureRows.forEach(row => observer.observe(row));
        } else {
            featureRows.forEach(row => {
                const videoContainer = row.querySelector('.video-container');
                const video = row.querySelector('video');
                if (videoContainer && video) {
                    videoContainer.addEventListener('mouseenter', () => {
                        video.play().catch(error => console.error("Video hover-play failed:", error));
                    });
                    videoContainer.addEventListener('mouseleave', () => {
                        video.pause();
                    });
                }
            });
        }
    };
    handleFeatureVideos();

    // 3.5. Module Tabs (Brain / Spine / Hip)
    const moduleTabs = document.querySelectorAll('.module-tab');
    const modulePanels = document.querySelectorAll('.module-panel');

    if (moduleTabs.length > 0 && modulePanels.length > 0) {
        moduleTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-module');

                // Update tabs
                moduleTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update module panels
                modulePanels.forEach(panel => {
                    panel.classList.toggle('active', panel.getAttribute('data-panel') === target);
                });

                // Hip: show outdoor billboard, hide features+workflow sections
                const orionMain = document.querySelector('main');
                if (orionMain) orionMain.classList.toggle('hip-active', target === 'hip');

                // Brain/Spine: switch features and workflow groups
                document.querySelectorAll('.features-group').forEach(g => {
                    g.classList.toggle('active', g.getAttribute('data-features') === target);
                });
                document.querySelectorAll('.workflow-steps-group').forEach(g => {
                    g.classList.toggle('active', g.getAttribute('data-workflow') === target);
                });

                resetToGridView();

                // Re-trigger chapter observer for newly visible group
                if (chapterObserver) {
                    document.querySelectorAll('.workflow-chapter').forEach(ch => {
                        chapterObserver.unobserve(ch);
                        chapterObserver.observe(ch);
                    });
                }
            });
        });
    }

    // 4. Workflow Chapters — scroll-reveal + video autoplay
    resetToGridView = () => {
        document.querySelectorAll('.workflow-chapter .chapter-media video').forEach(v => {
            v.pause();
            v.currentTime = 0;
        });
    };

    // Expand (fullscreen) button on each chapter video
    const SVG_NS = 'http://www.w3.org/2000/svg';
    document.querySelectorAll('.workflow-chapter .chapter-media').forEach(media => {
        const btn = document.createElement('button');
        btn.className = 'chapter-media-expand';
        btn.setAttribute('aria-label', 'Expandir vídeo');

        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('width', '14');
        svg.setAttribute('height', '14');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2.5');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', 'M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3');
        svg.appendChild(path);
        btn.appendChild(svg);

        btn.addEventListener('click', () => {
            const video = media.querySelector('video');
            if (!video) return;
            const target = video.requestFullscreen ? video : media;
            const fsMethod = target.requestFullscreen
                || target.webkitRequestFullscreen
                || target.mozRequestFullScreen
                || target.msRequestFullscreen;
            if (fsMethod) fsMethod.call(target);
        });
        media.appendChild(btn);
    });

    if ('IntersectionObserver' in window) chapterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const chapter = entry.target;

            // Reveal animation
            chapter.classList.toggle('is-visible', entry.isIntersecting);

            // Only autoplay if the parent group is active
            const group = chapter.closest('.workflow-steps-group');
            if (group && !group.classList.contains('active')) return;

            const video = chapter.querySelector('.chapter-media video');
            if (!video) return;

            if (entry.isIntersecting) {
                const src = video.getAttribute('data-src');
                if (src && !video.src) {
                    const chapterMedia = video.closest('.chapter-media');
                    chapterMedia.classList.add('is-loading');
                    video.src = src;
                    video.addEventListener('canplay', () => {
                        chapterMedia.classList.remove('is-loading');
                    }, { once: true });
                }
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.4 });

    if (chapterObserver) {
        document.querySelectorAll('.workflow-chapter').forEach(ch => {
            chapterObserver.observe(ch);
        });
    }

    } // end orion-only block

    // 5. Client Logos Draggable Carousel
    const slider = document.querySelector('.logos-slider');
    const track = document.querySelector('.logos-track');

    // Garante que os elementos do carrossel existam antes de adicionar os eventos.
    if (slider && track) {
        // Para um loop infinito e suave, o conteúdo dentro de .logos-track
        // deve ser duplicado no seu arquivo HTML.
        // Ex: Se você tem 5 logos, coloque os mesmos 5 logos novamente, totalizando 10.

        let isDown = false;
        let startX;
        let scrollLeft;
        let isPaused = false;
        let animationFrameId;
        let lastTimestamp = null;
        const SCROLL_PX_PER_SECOND = 40; // device-independent speed

        track.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });

        // 1. Giro Automático — delta-time based (same speed on 60Hz and 120Hz)
        const autoScroll = (timestamp) => {
            if (!isPaused && lastTimestamp !== null) {
                const delta = timestamp - lastTimestamp;
                slider.scrollLeft += (SCROLL_PX_PER_SECOND * delta) / 1000;
                if (slider.scrollLeft >= track.scrollWidth / 2) {
                    slider.scrollLeft = 0;
                }
            }
            lastTimestamp = timestamp;
            animationFrameId = requestAnimationFrame(autoScroll);
        };

        // 3. Arrastar Manual (Desktop e Mobile)
        const startDragging = (e) => {
            isDown = true;
            slider.classList.add('active');
            // Unifica eventos de mouse e toque para obter a posição inicial.
            startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            cancelAnimationFrame(animationFrameId);
            lastTimestamp = null;

            // Adiciona os listeners no documento para que o arrasto continue
            // mesmo que o cursor saia da área do carrossel.
            document.addEventListener('mousemove', whileDragging);
            document.addEventListener('mouseup', stopDragging);
            document.addEventListener('touchmove', whileDragging);
            document.addEventListener('touchend', stopDragging);
        };

        // 4. Retomar Giro (após o arrasto)
        const stopDragging = () => {
            if (!isDown) return;
            isDown = false;
            slider.classList.remove('active');

            // Remove os listeners do documento para não afetar outras interações.
            document.removeEventListener('mousemove', whileDragging);
            document.removeEventListener('mouseup', stopDragging);
            document.removeEventListener('touchmove', whileDragging);
            document.removeEventListener('touchend', stopDragging);

            lastTimestamp = null;
            requestAnimationFrame(autoScroll);
        };

        const whileDragging = (e) => {
            if (!isDown) return;
            e.preventDefault(); // Previne seleção de texto e rolagem da página no mobile.
            const x = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
            const walk = (x - startX) * 2; // Multiplicador para sentir o arrasto mais rápido.
            slider.scrollLeft = scrollLeft - walk;
        };

        // 2. Pausar no Hover
        slider.addEventListener('mouseenter', () => { isPaused = true; });
        slider.addEventListener('mouseleave', () => { isPaused = false; });

        // 5. Responsividade: Adiciona listeners para mouse e toque.
        slider.addEventListener('mousedown', startDragging);
        slider.addEventListener('touchstart', startDragging);

        // Inicia o carrossel.
        autoScroll();
    }

    // 6. Cinematic Testimonials Carousel
    const initCinematicCarousel = () => {
        const slides = document.querySelectorAll('.cinematic-slide');
        const dots = document.querySelectorAll('.cinematic-dot');
        const prevBtn = document.querySelector('.cinematic-prev');
        const nextBtn = document.querySelector('.cinematic-next');

        if (!slides.length) return;

        let current = 0;
        let autoTimer = null;
        let touchStartX = 0;

        const goTo = (index) => {
            const prevSlide = slides[current];
            prevSlide.classList.remove('active');
            dots[current]?.classList.remove('active');
            const prevVideo = prevSlide.querySelector('.cinematic-bg');
            if (prevVideo) { prevVideo.pause(); prevVideo.currentTime = 0; }

            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current]?.classList.add('active');

            const newVideo = slides[current].querySelector('.cinematic-bg');
            if (newVideo) {
                const src = slides[current].getAttribute('data-video-src');
                if (src && (!newVideo.src || !newVideo.src.endsWith(src))) newVideo.src = src;
                newVideo.play().catch(() => {});
            }
        };

        const startAuto = () => {
            stopAuto();
            autoTimer = setInterval(() => goTo(current + 1), 7000);
        };

        const stopAuto = () => {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        };

        goTo(0);
        startAuto();

        prevBtn?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
        nextBtn?.addEventListener('click', () => { goTo(current + 1); startAuto(); });
        dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); startAuto(); }));

        // Swipe support
        const track = document.querySelector('.cinematic-track');
        if (track) {
            track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
            track.addEventListener('touchend', (e) => {
                const diff = touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
            });
        }

        // Play with sound → open modal
        document.querySelectorAll('.cinematic-play-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const slide = btn.closest('.cinematic-slide');
                const videoSrc = slide?.getAttribute('data-video-src');
                const modal = document.getElementById('videoModal');
                const modalPlayer = document.getElementById('modalVideoPlayer');
                if (modal && modalPlayer && videoSrc) {
                    modalPlayer.src = videoSrc;
                    modalPlayer.currentTime = 0;
                    modal.classList.add('is-visible');
                    modalPlayer.play().catch(() => {});
                }
            });
        });
    };
    initCinematicCarousel();

    // Video Modal
    const videoModal = document.getElementById('videoModal');
    const modalVideoPlayer = document.getElementById('modalVideoPlayer');
    const closeModalBtn = document.querySelector('.close-modal');
    if (videoModal) {
        const closeModal = () => {
            videoModal.classList.remove('is-visible');
            if (modalVideoPlayer) { modalVideoPlayer.pause(); modalVideoPlayer.src = ''; }
        };
        closeModalBtn?.addEventListener('click', closeModal);
        videoModal.addEventListener('click', (e) => { if (e.target === videoModal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    }

    // 7. Form Validation — Phone (DDI+DDD) and Email
    const VALIDATION_MSGS = {
        'pt-BR': {
            phoneFormat: 'Inclua o DDI e DDD. Ex: +55 11 99999-9999',
            emailInvalid: 'Insira um e-mail válido. Ex: nome@clinica.com'
        },
        'en': {
            phoneFormat: 'Include country code and area code. Ex: +1 (234) 56789',
            emailInvalid: 'Enter a valid email. Ex: name@clinic.com'
        },
        'es-LA': {
            phoneFormat: 'Incluya el código de país y área. Ej: +55 11 99999-9999',
            emailInvalid: 'Ingrese un correo válido. Ej: nombre@clinica.com'
        }
    };

    const getValidationMsgs = () => {
        const lang = localStorage.getItem('lang') || 'pt-BR';
        return VALIDATION_MSGS[lang] || VALIDATION_MSGS['pt-BR'];
    };

    const phoneInput = document.getElementById('telefone');
    const emailInput = document.getElementById('email');

    if (phoneInput) {
        phoneInput.addEventListener('invalid', () => {
            if (!phoneInput.validity.valueMissing) {
                phoneInput.setCustomValidity(getValidationMsgs().phoneFormat);
            }
        });
        phoneInput.addEventListener('input', () => phoneInput.setCustomValidity(''));
    }

    if (emailInput) {
        emailInput.addEventListener('invalid', () => {
            if (!emailInput.validity.valueMissing) {
                emailInput.setCustomValidity(getValidationMsgs().emailInvalid);
            }
        });
        emailInput.addEventListener('input', () => emailInput.setCustomValidity(''));
    }
});