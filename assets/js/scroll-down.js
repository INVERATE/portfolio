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
        const isScrolled = window.scrollY > threshold || !(window.innerHeight + window.scrollY < document.body.offsetHeight);

        if (isScrolled && !header.classList.contains('header-scrolled')) {
            header.classList.add('header-scrolled');
            document.body.classList.add('scrolled');
            disableScrollTemporarily();

        } else if (!isScrolled && header.classList.contains('header-scrolled')) {
            header.classList.remove('header-scrolled');
            document.body.classList.remove('scrolled');
        }

        else {
            header.classList.add('header-scrolled');
            document.body.classList.add('scrolled');
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