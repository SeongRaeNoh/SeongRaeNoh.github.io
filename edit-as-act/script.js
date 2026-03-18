document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const anchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = anchors
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setScrolled = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 16);
  };

  const activateCurrentSection = () => {
    const current = sections.findLast((section) => {
      const top = section.getBoundingClientRect().top;
      return top <= 160;
    });

    anchors.forEach((link) => {
      const isActive = current && link.getAttribute("href") === `#${current.id}`;
      link.classList.toggle("active", Boolean(isActive));
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -48px 0px",
    }
  );

  document.querySelectorAll(".fade-in").forEach((element) => observer.observe(element));

  anchors.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      const offset = nav ? nav.offsetHeight + 18 : 18;
      const position = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: position, behavior: "smooth" });
    });
  });

  window.addEventListener("scroll", () => {
    setScrolled();
    activateCurrentSection();
  }, { passive: true });

  setScrolled();
  activateCurrentSection();
});
