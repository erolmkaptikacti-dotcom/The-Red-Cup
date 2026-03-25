/* =============================================
   THE RED CUP — script.js
   ============================================= */



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
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

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
