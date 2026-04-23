/* =============================================
   THE RED CUP — script.js
   ============================================= */



// ── Mobile Menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
}
function closeMobileMenu() {
  if (hamburger) hamburger.classList.remove('open');
  if (mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Nav scroll ──
const nav = document.getElementById('navbar');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── Booking Modal ──
function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function handleOverlayClick(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}
function submitForm() {
  const btn = document.querySelector('.form-submit');
  btn.textContent = "✓ Request Sent — We'll Be In Touch!";
  btn.style.background = '#1a6b2a';
  setTimeout(() => {
    closeModal();
    btn.textContent = 'Send My Request';
    btn.style.background = '';
  }, 2500);
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── Online Ordering ──
function openOrderModal() {
  window.open('https://online.skytab.com/b68be6244f94015a8ece60906197687f', '_blank');
}

// Dynamically add "Order Now" buttons to all regular food cards
(function() {
  var cards = document.querySelectorAll('.food-card');
  if (!cards.length) return;
  cards.forEach(function(card) {
    if (card.dataset.orderCustom) return;
    var nameEl = card.querySelector('.food-name');
    if (!nameEl) return;
    var btn = document.createElement('button');
    btn.className = 'add-btn';
    btn.textContent = 'Order Now';
    btn.addEventListener('click', openOrderModal);
    card.appendChild(btn);
  });
})();

// ── Scroll fade-in ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.exp-card, .review-card, .event-row, .vip-perk, .food-card, .food-category'
).forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
