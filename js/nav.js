document.addEventListener('DOMContentLoaded', function () {
  var bar = document.createElement('a');
  bar.className = 'book-bar';
  bar.href = 'https://airbnb.com/h/pinegrovebigbear';
  bar.target = '_blank';
  bar.rel = 'noopener';
  bar.textContent = 'Check availability';
  document.body.appendChild(bar);
  function updateBar() { bar.classList.toggle('is-visible', window.scrollY > 500); }
  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
});

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.mobile-toggle');
  var nav = document.querySelector('nav.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.textContent = isOpen ? '✕' : '☰';
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = '☰';
    });
  });
});
