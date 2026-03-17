const WA = '919092432647';
const waUrl = msg => `https://api.whatsapp.com/send?phone=${WA}&text=${encodeURIComponent(msg)}`;
const defaultMsg = "Hi Super J Travels! I'd like to book a cab.";

// Wire all WA links
['navWa','mobileWa','heroWa','svcWa','ctaWa','contactWa','footerWa','footerWa2','floatWa'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.href = waUrl(defaultMsg); el.target = '_blank'; el.rel = 'noopener noreferrer';
});

// Fleet buttons
document.querySelectorAll('.fleet-btn').forEach(btn => {
  btn.href = waUrl(`Hi Super J Travels! I'd like to book a ${btn.dataset.v}.`);
  btn.target = '_blank'; btn.rel = 'noopener noreferrer';
});

// Route cards
document.querySelectorAll('.route-card').forEach(card => {
  card.href = waUrl(`Hi! I'd like to book a cab from ${card.dataset.f} to ${card.dataset.t}.`);
  card.target = '_blank'; card.rel = 'noopener noreferrer';
});

// Hero inline form
document.getElementById('hcSubmit').addEventListener('click', () => {
  const n = document.getElementById('hcName').value.trim();
  const p = document.getElementById('hcPhone').value.trim();
  const pu= document.getElementById('hcPickup').value.trim();
  const d = document.getElementById('hcDrop').value.trim();
  const v = document.getElementById('hcVehicle').value.trim();
  if (!n || !p) { alert('Please enter your name and phone number.'); return; }
  const parts = [`Hi Super J Travels!`,`Name: ${n}`,`Phone: ${p}`,
    pu&&`Pickup: ${pu}`,d&&`Drop: ${d}`,v&&`Vehicle: ${v}`];
  window.open(waUrl(parts.filter(Boolean).join('\n')), '_blank', 'noopener,noreferrer');
});

// Contact form
document.getElementById('formBtn').addEventListener('click', () => {
  const n = document.getElementById('fName').value.trim();
  const p = document.getElementById('fPhone').value.trim();
  const pu= document.getElementById('fPickup').value.trim();
  const d = document.getElementById('fDrop').value.trim();
  const v = document.getElementById('fVehicle').value.trim();
  if (!n || !p) { alert('Please enter your name and phone number.'); return; }
  const parts = [`Hi Super J Travels!`,`Name: ${n}`,`Phone: ${p}`,
    pu&&`Pickup: ${pu}`,d&&`Drop: ${d}`,v&&`Vehicle: ${v}`];
  window.open(waUrl(parts.filter(Boolean).join('\n')), '_blank', 'noopener,noreferrer');
});

// Navbar scroll + active link
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  const pos = window.scrollY + 80;
  document.querySelectorAll('section[id]').forEach(s => {
    const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
    if (link) link.classList.toggle('active', pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight);
  });
}, {passive:true});

// Hamburger
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
function closeMenu() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded','false');
  mobileNav.setAttribute('aria-hidden','true');
}
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  mobileNav.setAttribute('aria-hidden', String(!open));
});
document.addEventListener('click', e => {
  if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) closeMenu();
});

// Testimonial carousel
let tIdx = 0;
const tCards = [...document.querySelectorAll('.t-card')];
const tTrack = document.getElementById('tTrack');
const tDots  = document.getElementById('tDots');
tCards.forEach((_, i) => {
  const d = document.createElement('button');
  d.className = 't-dot' + (i === 0 ? ' active' : '');
  d.setAttribute('aria-label', `Go to review ${i + 1}`);
  d.setAttribute('role', 'tab');
  d.onclick = () => goT(i);
  tDots.appendChild(d);
});
function goT(i) {
  tIdx = (i + tCards.length) % tCards.length;
  tCards.forEach((c, j) => c.classList.toggle('active', j === tIdx));
  const gap = 20;
  const cardW = tCards[0] ? tCards[0].offsetWidth : 340;
  tTrack.style.transform = `translateX(-${tIdx * (cardW + gap)}px)`;
  document.querySelectorAll('.t-dot').forEach((d, j) => d.classList.toggle('active', j === tIdx));
}
document.getElementById('tPrev').onclick = () => goT(tIdx - 1);
document.getElementById('tNext').onclick = () => goT(tIdx + 1);
setInterval(() => goT(tIdx + 1), 5500);
window.addEventListener('resize', () => goT(tIdx)); // recalc on resize

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }});
}, {threshold:0.08, rootMargin:'0px 0px -32px 0px'});
document.querySelectorAll('.reveal, .stagger').forEach(el => observer.observe(el));

/* ═══════════════════════════════════════════════════════
   FLEET SLIDESHOW — Add this block inside script.js
   (or paste at the bottom of your existing script.js)

   Also works standalone — just make sure it runs after DOM load.
   ═══════════════════════════════════════════════════════ */

(function initFleetSlideshows() {
  const WA_NUMBER = '919092432647';

  document.querySelectorAll('.fleet-cat-card').forEach(card => {
    const ss      = card.querySelector('.fcc-slideshow');
    const slides  = card.querySelectorAll('.fcc-slide');
    const track   = card.querySelector('.fcc-slides');
    const dotsWrap= card.querySelector('.fcc-dots');
    const prevBtn = card.querySelector('.fcc-prev');
    const nextBtn = card.querySelector('.fcc-next');
    const bookBtn = card.querySelector('.fcc-book-btn');

    let current = 0;
    let autoTimer = null;
    const total = slides.length;

    /* Build dots */
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'fcc-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });

    function goTo(idx) {
      slides[current].classList.remove('active');
      dotsWrap.children[current].classList.remove('active');
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      slides[current].classList.add('active');
      dotsWrap.children[current].classList.add('active');
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => goTo(current + 1), 3200);
    }
    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    ss.addEventListener('mouseenter', stopAuto);
    ss.addEventListener('mouseleave', startAuto);

    /* Touch / swipe support */
    let touchX = 0;
    ss.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    ss.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) { dx < 0 ? goTo(current + 1) : goTo(current - 1); startAuto(); }
    }, { passive: true });

    startAuto();

    /* WhatsApp booking */
    if (bookBtn) {
      bookBtn.addEventListener('click', e => {
        e.preventDefault();
        const vehicle = bookBtn.dataset.v || 'a vehicle';
        const msg = encodeURIComponent(
          `Hi Super J Travels! I'd like to book ${vehicle}. Please share availability and pricing.`
        );
        window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
      });
    }
  });
})();
/* ═══════════════════════════════════════════════════════════════
   FLEET SLIDESHOW JS — paste at bottom of script.js
   ═══════════════════════════════════════════════════════════════ */

(function initFleetSlideshows() {
  const WA = '919092432647';

  document.querySelectorAll('.fleet-cat-card').forEach(card => {
    const wrap   = card.querySelector('.fcc-slideshow');
    const strip  = card.querySelector('.fcc-slides');
    const slides = card.querySelectorAll('.fcc-slide');
    const dotsEl = card.querySelector('.fcc-dots');
    const prev   = card.querySelector('.fcc-prev');
    const next   = card.querySelector('.fcc-next');
    const bookBtn= card.querySelector('.fcc-book-btn');

    let cur = 0, timer = null;
    const total = slides.length;

    /* Build dots */
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'fcc-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.addEventListener('click', () => { go(i); resetAuto(); });
      dotsEl.appendChild(d);
    });

    function go(idx) {
      dotsEl.children[cur].classList.remove('active');
      cur = (idx + total) % total;
      strip.style.transform = `translateX(-${cur * 100}%)`;
      dotsEl.children[cur].classList.add('active');
    }

    function resetAuto() {
      clearInterval(timer);
      timer = setInterval(() => go(cur + 1), 3500);
    }

    prev.addEventListener('click', () => { go(cur - 1); resetAuto(); });
    next.addEventListener('click', () => { go(cur + 1); resetAuto(); });

    /* Pause on hover */
    wrap.addEventListener('mouseenter', () => clearInterval(timer));
    wrap.addEventListener('mouseleave', resetAuto);

    /* Touch swipe */
    let tx = 0;
    wrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) { dx < 0 ? go(cur + 1) : go(cur - 1); resetAuto(); }
    }, { passive: true });

    resetAuto();

    /* WhatsApp booking */
    if (bookBtn) {
      bookBtn.addEventListener('click', e => {
        e.preventDefault();
        const v   = bookBtn.dataset.v || 'a vehicle';
        const msg = encodeURIComponent(`Hi Super J Travels! I'd like to book ${v}. Please share availability and pricing. Thank you!`);
        window.open(`https://wa.me/${WA}?text=${msg}`, '_blank');
      });
    }
  });
})();
