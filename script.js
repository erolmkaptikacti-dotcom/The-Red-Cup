/* =============================================
   THE RED CUP — script.js
   ============================================= */

// ── Custom Cursor ──
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .exp-card, .review-card, .event-row, .food-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '20px'; cursor.style.height = '20px';
    ring.style.width    = '60px'; ring.style.height   = '60px';
    ring.style.borderColor = 'rgba(200,16,46,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '12px'; cursor.style.height = '12px';
    ring.style.width    = '40px'; ring.style.height   = '40px';
    ring.style.borderColor = 'rgba(200,16,46,0.5)';
  });
});

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
