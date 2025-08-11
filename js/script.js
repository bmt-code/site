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
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('is-active');
            document.body.classList.toggle('no-scroll'); // Optional: prevent scrolling when menu is open
        });

        // Close menu when a link is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('is-active')) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    mainNav.classList.remove('is-active');
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

    // 4. Workflow Video Modal
    const videoModal = document.getElementById('videoModal');
    const modalVideoPlayer = document.getElementById('modalVideoPlayer');
    const closeModalBtn = document.querySelector('.close-modal');
    const workflowSteps = document.querySelectorAll('.workflow-step .step-number');

    if (videoModal && modalVideoPlayer && closeModalBtn && workflowSteps.length > 0) {
        workflowSteps.forEach(button => {
            button.addEventListener('click', () => {
                const videoSrc = button.getAttribute('data-video-src');
                if (videoSrc) {
                    modalVideoPlayer.src = videoSrc;
                    videoModal.style.display = 'flex';
                    modalVideoPlayer.play();
                    document.body.classList.add('no-scroll'); // Prevent background scroll
                }
            });
        });

        const closeModal = () => {
            videoModal.style.display = 'none';
            modalVideoPlayer.pause();
            modalVideoPlayer.src = ''; // Unload the video
            document.body.classList.remove('no-scroll');
        };

        closeModalBtn.addEventListener('click', closeModal);
        
        // Close modal if user clicks outside the video content
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.style.display === 'flex') {
                closeModal();
            }
        });
    }
});