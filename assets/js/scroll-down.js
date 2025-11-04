document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    let isTransitioning = false;
    let lastScrollY = window.scrollY;
    let ticking = false;

    function disableScrollTemporarily(duration = 700) {
        if (isTransitioning) return;
        isTransitioning = true;

        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            document.body.style.overflow = '';
            isTransitioning = false;
        }, duration);
    }

    function handleScroll() {
        const threshold = 0;

        // Vérifie si la page a assez de contenu pour scroller
        const hasEnoughContent = document.body.offsetHeight > window.innerHeight;

        // Le header est réduit SI :
        // 1. On a scrollé au-delà du seuil OU
        // 2. La page n'a pas assez de contenu (pour forcer la réduction)
        const isScrolled = window.scrollY > threshold || !hasEnoughContent;

        if (isScrolled && !header.classList.contains('header-scrolled')) {
            header.classList.add('header-scrolled');
            document.body.classList.add('scrolled');
            disableScrollTemporarily();

        } else if (!isScrolled && header.classList.contains('header-scrolled')) {
            header.classList.remove('header-scrolled');
            document.body.classList.remove('scrolled');
        }
    }

    function onScroll() {
        lastScrollY = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();
});