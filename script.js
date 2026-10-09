/* ===========================================
   SeongRae Noh — Academic Homepage Scripts
   Subtle animations and interactions
   =========================================== */

// --- Intersection Observer for fade-in animations ---
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // --- News: show the most recent items, expand the rest on demand ---
    // Must match the nth-child(n+6) rule in style.css
    const NEWS_VISIBLE = 5;
    const newsList = document.getElementById('news-list');
    const newsToggle = document.getElementById('news-toggle');

    if (newsList && newsToggle && newsList.querySelectorAll('.news-item').length > NEWS_VISIBLE) {
        const label = newsToggle.querySelector('.news-toggle-label');
        const icon = newsToggle.querySelector('.news-toggle-icon');
        newsToggle.hidden = false;

        newsToggle.addEventListener('click', () => {
            const expanded = newsList.classList.toggle('expanded');
            newsToggle.setAttribute('aria-expanded', String(expanded));
            label.textContent = expanded ? 'Show less' : 'Show more';
            icon.textContent = expanded ? '−' : '+';
        });
    }

    // --- Navigation scroll effect ---
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    const handleScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
