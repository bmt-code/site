document.addEventListener('DOMContentLoaded', () => {

    // 1. Inicialização da biblioteca de animação (AOS)
    AOS.init({
        duration: 800, // Duração da animação em ms
        once: true,     // Animação acontece apenas uma vez
        offset: 50      // Deslocamento para iniciar a animação antes do elemento aparecer
    });

    // 2. Lógica do Menu Hambúrguer (Mobile)
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');
    const body = document.body;

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-open');
            mainNav.classList.toggle('is-open');
            body.classList.toggle('no-scroll'); // Impede o scroll do corpo quando o menu está aberto
        });
    }

    // Fecha o menu ao clicar em um link (útil no mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('is-open')) {
                menuToggle.classList.remove('is-open');
                mainNav.classList.remove('is-open');
                body.classList.remove('no-scroll');
            }
        });
    });

    // 3. Lógica para trocar imagem por GIF ao passar o mouse (hover)
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        const img = card.querySelector('img');
        if (img && img.dataset.gifSrc) {
            const staticSrc = img.src;
            const gifSrc = img.dataset.gifSrc;

            // Pré-carrega o GIF para uma transição suave
            const gifImage = new Image();
            gifImage.src = gifSrc;

            card.addEventListener('mouseenter', () => {
                img.src = gifSrc;
            });

            card.addEventListener('mouseleave', () => {
                img.src = staticSrc;
            });
        }
    });

    // 4. Lógica do Modal de Vídeo
    const videoModal = document.getElementById('videoModal');
    const modalVideoPlayer = document.getElementById('modalVideoPlayer');
    const openModalButtons = document.querySelectorAll('.step-number');
    const closeModalButton = document.querySelector('.close-modal');

    // Garante que todos os elementos do modal existem antes de adicionar os eventos
    if (videoModal && modalVideoPlayer && openModalButtons.length > 0 && closeModalButton) {

        // Abre o modal e toca o vídeo correspondente ao botão clicado
        openModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const videoSrc = button.dataset.videoSrc;
                if (videoSrc) {
                    modalVideoPlayer.src = videoSrc;
                    videoModal.style.display = 'flex'; // Usa flex para centralizar
                    modalVideoPlayer.play();
                    body.classList.add('no-scroll'); // Impede o scroll da página
                }
            });
        });

        // Função para fechar o modal
        const closeModal = () => {
            videoModal.style.display = 'none';
            modalVideoPlayer.pause();
            modalVideoPlayer.src = ''; // Limpa o src para parar o download do vídeo
            body.classList.remove('no-scroll');
        };

        // Eventos para fechar o modal
        closeModalButton.addEventListener('click', closeModal);

        // Fecha ao clicar fora do vídeo (na área do overlay)
        videoModal.addEventListener('click', (event) => {
            if (event.target === videoModal) {
                closeModal();
            }
        });

        // Fecha ao pressionar a tecla 'Escape'
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && videoModal.style.display === 'flex') {
                closeModal();
            }
        });
    }
});