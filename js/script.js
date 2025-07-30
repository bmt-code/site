document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica do Menu Hambúrguer
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('is-open');
            menuToggle.classList.toggle('is-open');
            body.classList.toggle('no-scroll');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });

        // Fecha o menu ao clicar em um link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('is-open');
                menuToggle.classList.remove('is-open');
                body.classList.remove('no-scroll');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 2. Adiciona rolagem suave para todos os links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // A propriedade 'scroll-margin-top' no CSS já cuida do offset do header
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. Inicializa a biblioteca AOS (Animate On Scroll)
    AOS.init({
        duration: 800, // Duração da animação em milissegundos
        once: true,    // A animação acontece apenas uma vez
        offset: 50     // Inicia a animação um pouco antes do elemento aparecer
    });

    // 4. Lógica do Modal de Vídeo
    const stepButtons = document.querySelectorAll('.workflow-step .step-number');
    const videoModal = document.getElementById('videoModal');
    const modalVideoPlayer = document.getElementById('modalVideoPlayer');
    const closeModalButton = document.querySelector('.close-modal');

    if (videoModal && modalVideoPlayer && stepButtons.length > 0) {
        
        const openModal = (videoSrc) => {
            modalVideoPlayer.src = videoSrc;
            videoModal.classList.add('is-visible');
            body.classList.add('no-scroll'); // Reutiliza a classe que já trava o scroll
            modalVideoPlayer.play();
        };

        const closeModal = () => {
            videoModal.classList.remove('is-visible');
            body.classList.remove('no-scroll');
            modalVideoPlayer.pause();
            modalVideoPlayer.src = ""; // Para o download e libera recursos
        };

        stepButtons.forEach(button => {
            button.addEventListener('click', () => {
                const videoSrc = button.dataset.videoSrc;
                if (videoSrc) {
                    openModal(videoSrc);
                }
            });
        });

        // Fecha o modal ao clicar no botão 'X' ou no fundo do overlay
        closeModalButton.addEventListener('click', closeModal);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });
    }
});