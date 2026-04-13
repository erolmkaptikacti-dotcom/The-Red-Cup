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
  if (e.key === 'Escape') { closeModal(); closeOrderModal(); }
});

// ── Order / Cart System ──
var cart = [];
var wingsQty = 6;
var birriaChickenQty = 2;
var birriaBeefQty = 2;

function addItem(name, price) {
  var existing = cart.find(function(i) { return i.name === name; });
  if (existing) { existing.qty++; }
  else { cart.push({ name: name, price: price, qty: 1 }); }
  updateCartUI();
  flashCart();
}

function changeQty(name, delta) {
  var idx = cart.findIndex(function(i) { return i.name === name; });
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartUI();
  renderCartItems();
}

function getCartTotal() {
  return cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
}

function updateCartUI() {
  var btn = document.getElementById('cartBtn');
  if (!btn) return;
  var count = cart.reduce(function(s, i) { return s + i.qty; }, 0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = getCartTotal().toFixed(2);
  btn.style.display = count > 0 ? 'flex' : 'none';
}

function flashCart() {
  var btn = document.getElementById('cartBtn');
  if (!btn) return;
  btn.classList.remove('pop');
  void btn.offsetWidth;
  btn.classList.add('pop');
}

function changeBirriaQty(type, delta) {
  var newChicken = birriaChickenQty;
  var newBeef = birriaBeefQty;
  if (type === 'chicken') {
    newChicken = birriaChickenQty + delta;
    newBeef = 4 - newChicken;
  } else {
    newBeef = birriaBeefQty + delta;
    newChicken = 4 - newBeef;
  }
  if (newChicken < 0 || newBeef < 0) return;
  birriaChickenQty = newChicken;
  birriaBeefQty = newBeef;
  var cEl = document.getElementById('birriaChickenQty');
  var bEl = document.getElementById('birriaBeefQty');
  if (cEl) cEl.textContent = birriaChickenQty;
  if (bEl) bEl.textContent = birriaBeefQty;
}

function addBirria() {
  var parts = [];
  if (birriaChickenQty > 0) parts.push(birriaChickenQty + ' Chicken');
  if (birriaBeefQty > 0) parts.push(birriaBeefQty + ' Beef');
  var name = 'Birria Tacos (' + parts.join(', ') + ')';
  addItem(name, 15);
  birriaChickenQty = 2;
  birriaBeefQty = 2;
  var cEl = document.getElementById('birriaChickenQty');
  var bEl = document.getElementById('birriaBeefQty');
  if (cEl) cEl.textContent = 2;
  if (bEl) bEl.textContent = 2;
}

function changeWingsQty(delta) {
  wingsQty = Math.max(1, wingsQty + delta);
  var el = document.getElementById('wingsQty');
  if (el) el.textContent = wingsQty;
}

function addWings() {
  var sauceEl = document.getElementById('wingsSauce');
  if (!sauceEl || !sauceEl.value) {
    alert('Please select a sauce for your wings.');
    return;
  }
  var name = 'Wings \u2014 ' + sauceEl.value;
  var existing = cart.find(function(i) { return i.name === name; });
  if (existing) { existing.qty += wingsQty; }
  else { cart.push({ name: name, price: 1, qty: wingsQty }); }
  updateCartUI();
  flashCart();
  sauceEl.value = '';
  wingsQty = 6;
  var wqEl = document.getElementById('wingsQty');
  if (wqEl) wqEl.textContent = wingsQty;
}

// Dynamically add "Add to Order" buttons to all regular food cards
(function() {
  var cards = document.querySelectorAll('.food-card');
  if (!cards.length) return;
  cards.forEach(function(card) {
    if (card.style.visibility === 'hidden') return;
    if (card.dataset.orderCustom) return;
    var nameEl = card.querySelector('.food-name');
    var priceEl = card.querySelector('.food-price');
    if (!nameEl || !priceEl) return;
    var match = priceEl.textContent.match(/\$(\d+)/);
    if (!match) return;
    var name = nameEl.textContent.trim();
    var price = parseInt(match[1], 10);
    var btn = document.createElement('button');
    btn.className = 'add-btn';
    btn.textContent = '+ Add to Order';
    btn.addEventListener('click', function() { addItem(name, price); });
    card.appendChild(btn);
  });
})();

// Order Modal
function openOrderModal() {
  var overlay = document.getElementById('orderOverlay');
  if (!overlay) return;
  renderCartItems();
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  goToStep(1);
}

function closeOrderModal() {
  var overlay = document.getElementById('orderOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function handleOrderOverlayClick(e) {
  if (e.target === document.getElementById('orderOverlay')) closeOrderModal();
}

function goToStep(n) {
  [1, 2, 3, 4].forEach(function(i) {
    var el = document.getElementById('orderStep' + i);
    if (el) el.style.display = i === n ? 'block' : 'none';
  });
  if (n === 1) renderCartItems();
  if (n === 3) {
    var pd = document.getElementById('payTotalDisp');
    if (pd) pd.textContent = getCartTotal().toFixed(2);
  }
}

function renderCartItems() {
  var el = document.getElementById('cartItems');
  var continueBtn = document.getElementById('cartContinueBtn');
  var totalDisp = document.getElementById('orderTotalDisp');
  if (!el) return;
  if (!cart.length) {
    el.innerHTML = '<p style="color:rgba(245,239,230,0.4);text-align:center;padding:28px 0">Your cart is empty \u2014 add items from the menu above.</p>';
    if (continueBtn) continueBtn.style.display = 'none';
    return;
  }
  if (continueBtn) continueBtn.style.display = 'block';
  el.innerHTML = cart.map(function(item) {
    var safeName = item.name.replace(/'/g, '&#39;');
    return '<div class="cart-item-row">' +
      '<div class="cart-item-info">' +
        '<span class="cart-item-name">' + item.name + '</span>' +
        '<span class="cart-item-detail">$' + item.price.toFixed(2) + ' each</span>' +
      '</div>' +
      '<div class="cart-item-qty">' +
        '<button onclick="changeQty(\'' + safeName + '\', -1)">&#8722;</button>' +
        '<span>' + item.qty + '</span>' +
        '<button onclick="changeQty(\'' + safeName + '\', 1)">+</button>' +
      '</div>' +
      '<span class="cart-item-total">$' + (item.price * item.qty).toFixed(2) + '</span>' +
    '</div>';
  }).join('');
  if (totalDisp) totalDisp.textContent = getCartTotal().toFixed(2);
}

function fmtCard(input) {
  var v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function fmtExp(input) {
  var v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + ' / ' + v.substring(2);
  input.value = v;
}

function placeOrder() {
  var name = (document.getElementById('pickupName') || {}).value || '';
  var phone = (document.getElementById('pickupPhone') || {}).value || '';
  if (!name.trim() || !phone.trim()) { goToStep(2); return; }
  var cardNum = ((document.getElementById('cardNumber') || {}).value || '').replace(/\s/g, '');
  var cardExp = ((document.getElementById('cardExp') || {}).value || '').trim();
  var cardCvv = ((document.getElementById('cardCvv') || {}).value || '').trim();
  if (cardNum.length < 16 || !cardExp || cardCvv.length < 3) {
    alert('Please complete all payment fields.');
    return;
  }
  var btn = document.getElementById('placeOrderBtn');
  if (btn) { btn.textContent = 'Processing...'; btn.disabled = true; }
  setTimeout(function() {
    var orderNum = 'RC-' + Math.floor(1000 + Math.random() * 9000);
    var pickupTime = (document.getElementById('pickupTime') || {}).value || 'ASAP';
    var total = getCartTotal().toFixed(2);
    var cnEl = document.getElementById('confirmOrderNum');
    var ctEl = document.getElementById('confirmPickupTime');
    var totalEl = document.getElementById('confirmTotal');
    if (cnEl) cnEl.textContent = orderNum;
    if (ctEl) ctEl.textContent = pickupTime;
    if (totalEl) totalEl.textContent = '$' + total;
    cart = [];
    updateCartUI();
    if (btn) { btn.textContent = 'Place Order \u2192'; btn.disabled = false; }
    goToStep(4);
  }, 1200);
}

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
