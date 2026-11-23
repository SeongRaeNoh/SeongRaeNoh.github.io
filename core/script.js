document.addEventListener('DOMContentLoaded', () => {
  const burgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  burgers.forEach(el => {
    el.addEventListener('click', () => {
      const target = document.getElementById(el.dataset.target);
      el.classList.toggle('is-active');
      if (target) target.classList.toggle('is-active');
    });
  });
  const btn = document.getElementById('copyBib');
  if (btn) btn.addEventListener('click', () => {
    const text = document.getElementById('bibtex').innerText;
    navigator.clipboard.writeText(text).then(() => {
      btn.querySelector('span:last-child').textContent = 'Copied';
      setTimeout(() => { btn.querySelector('span:last-child').textContent = 'Copy'; }, 1500);
    });
  });
});
