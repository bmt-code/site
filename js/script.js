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
    const workflowSteps = document.querySelectorAll('#como-usar .workflow-step');
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

        workflowSteps.forEach(step => {
            step.addEventListener('click', () => {
                const isAlreadyActive = step.classList.contains('active');

                if (isAlreadyActive) {
                    // Se o passo clicado já está ativo, redefine para a grade
                    resetToGridView();
                } else {
                    // Caso contrário, mostra o vídeo selecionado
                    // Busca o botão dentro do passo para pegar o atributo do vídeo
                    const numberButton = step.querySelector('.step-number');
                    if (!numberButton) return; // Segurança: não faz nada se não encontrar o botão

                    const videoSrc = numberButton.getAttribute('data-video-src');
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
                        step.classList.add('active');
                        currentActiveStep = step; // Atualiza a referência do passo ativo
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

        // Previne o comportamento padrão de arrastar imagens, que pode interferir.
        track.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });

        // 1. Giro Automático
        const autoScroll = () => {
            // A rolagem só acontece se não estiver pausada (pelo hover)
            if (!isPaused) {
                slider.scrollLeft += 1; // Ajuste este valor para mudar a velocidade
                // Quando o carrossel rolar metade do seu conteúdo, reseta para o início,
                // criando a ilusão de um loop infinito.
                if (slider.scrollLeft >= track.scrollWidth / 2) {
                    slider.scrollLeft = 0;
                }
            }
            // Continua o loop de animação para uma rolagem suave.
            animationFrameId = requestAnimationFrame(autoScroll);
        };

        // 3. Arrastar Manual (Desktop e Mobile)
        const startDragging = (e) => {
            isDown = true;
            slider.classList.add('active');
            // Unifica eventos de mouse e toque para obter a posição inicial.
            startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            // Pausa o giro automático ao iniciar o arrasto.
            cancelAnimationFrame(animationFrameId);

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

            // Reinicia o loop de animação quando o arrasto termina.
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
});