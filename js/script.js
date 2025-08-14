document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800, // values from 0 to 3000, with step 50ms
        once: true, // whether animation should happen only once - while scrolling down
    });

    // 2. Mobile Menu Toggle
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

    // 3. Feature Videos Interaction (Autoplay on Mobile, Hover on Desktop)
    const handleFeatureVideos = () => {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const featureCards = document.querySelectorAll('#funcionalidades .feature-card');

        if (isMobile) {
            // On mobile, autoplay videos when they scroll into view.
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target.querySelector('video');
                    const overlay = entry.target.querySelector('.play-overlay');
                    if (entry.isIntersecting) {
                        video.play().catch(error => console.error("Video autoplay failed:", error));
                        if (overlay) overlay.style.opacity = '0'; // Esconde o overlay no mobile
                    } else {
                        video.pause();
                        if (overlay) overlay.style.opacity = '1'; // Mostra o overlay novamente
                    }
                });
            }, {
                rootMargin: '0px',
                threshold: 0.5 // Trigger when 50% of the card is visible
            });

            featureCards.forEach(card => observer.observe(card));
        } else {
            // On desktop, play videos on hover for a better user experience.
            featureCards.forEach(card => {
                const video = card.querySelector('video');
                card.addEventListener('mouseenter', () => {
                    video.play().catch(error => console.error("Video hover-play failed:", error));
                });
                card.addEventListener('mouseleave', () => {
                    video.pause();
                });
            });
        }
    };
    handleFeatureVideos(); // Run the function on page load

    // 4. Workflow Video and Steps Interaction
    const workflowContainer = document.querySelector('.workflow-container');
    const workflowSteps = document.querySelectorAll('#como-usar .step-number');
    const workflowVideoPlayer = document.getElementById('workflowVideoPlayer');

    if (workflowContainer && workflowSteps.length > 0 && workflowVideoPlayer) {
        let currentActiveStep = null; // Variável para rastrear o passo ativo

        // Função reutilizável para redefinir a seção para o estado de grade
        const resetToGridView = () => {
            workflowContainer.classList.remove('video-is-active');
            workflowVideoPlayer.pause();
            workflowVideoPlayer.src = ''; // Descarrega o vídeo para economizar recursos
            if (currentActiveStep) {
                currentActiveStep.classList.remove('active');
                currentActiveStep = null;
            }
        };

        workflowSteps.forEach(button => {
            button.addEventListener('click', () => {
                const parentStep = button.parentNode;
                const isAlreadyActive = parentStep.classList.contains('active');

                if (isAlreadyActive) {
                    // Se o passo clicado já está ativo, redefine para a grade
                    resetToGridView();
                } else {
                    // Caso contrário, mostra o vídeo selecionado
                    const videoSrc = button.getAttribute('data-video-src');
                    if (videoSrc) {
                        workflowVideoPlayer.src = videoSrc;
                        // Garante que o vídeo só toque quando estiver pronto, evitando erros
                        const playPromise = workflowVideoPlayer.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                console.error("Erro ao tentar reproduzir o vídeo:", error);
                            });
                        }

                        workflowContainer.classList.add('video-is-active');

                        // Remove a classe do passo ativo anterior (se houver)
                        if (currentActiveStep) {
                            currentActiveStep.classList.remove('active');
                        }
                        parentStep.classList.add('active');
                        currentActiveStep = parentStep; // Atualiza a referência do passo ativo
                    }
                }
            });
        });

        // Observador para redefinir a seção quando ela sai da tela
        const workflowObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Se o container não estiver visível e o modo de vídeo estiver ativo
                if (!entry.isIntersecting && workflowContainer.classList.contains('video-is-active')) {
                    resetToGridView();
                }
            });
        }, { threshold: 0.1 }); // Aciona quando menos de 10% da seção está visível

        workflowObserver.observe(workflowContainer);
    } else {
        console.warn('Workflow section elements not found. Interaction will be disabled.');
    }
});