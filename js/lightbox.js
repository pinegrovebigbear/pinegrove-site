document.addEventListener('DOMContentLoaded', function () {
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.page-gallery .photo-block img'));
  if (!imgs.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Photo viewer');
  overlay.hidden = true;
  overlay.innerHTML =
    '<button type="button" class="lb-close" aria-label="Close photo viewer">&times;</button>' +
    '<button type="button" class="lb-prev" aria-label="Previous photo">&#8249;</button>' +
    '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button type="button" class="lb-next" aria-label="Next photo">&#8250;</button>';
  document.body.appendChild(overlay);

  var view = overlay.querySelector('img');
  var caption = overlay.querySelector('figcaption');
  var closeBtn = overlay.querySelector('.lb-close');
  var current = 0;
  var opener = null;

  function show(i) {
    current = (i + imgs.length) % imgs.length;
    view.src = imgs[current].currentSrc || imgs[current].src;
    view.alt = imgs[current].alt;
    caption.textContent = imgs[current].alt;
  }
  function open(i) {
    opener = document.activeElement;
    show(i);
    overlay.hidden = false;
    document.body.classList.add('lb-open');
    closeBtn.focus();
  }
  function close() {
    overlay.hidden = true;
    document.body.classList.remove('lb-open');
    if (opener && opener.focus) opener.focus();
  }

  imgs.forEach(function (img, i) {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'View larger: ' + img.alt);
    img.addEventListener('click', function () { open(i); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  closeBtn.addEventListener('click', close);
  overlay.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  overlay.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

  document.addEventListener('keydown', function (e) {
    if (overlay.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
    else if (e.key === 'Tab') {
      var focusable = overlay.querySelectorAll('button');
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  var startX = null;
  overlay.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  overlay.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
});
