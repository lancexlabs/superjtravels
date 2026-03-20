/* ═══════════════════════════════════════════════════════
   SUPER J TRAVELS — script.js
   Single, clean file. No duplicates.
═══════════════════════════════════════════════════════ */

/* ── Supabase config ── */
const SUPABASE_URL      = 'https://viunpmfhxomnvpepjgfh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpdW5wbWZoeG9tbnZwZXBqZ2ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMTIxMzgsImV4cCI6MjA4OTU4ODEzOH0.0qm7tPW2RHBMXXabCnDNkGJnP0IaIEG4hiY0pDRT080';
const HOME_LIMIT        = 6; // reviews shown in homepage slider
/* ── WhatsApp ── */
const WA          = '919092432647';
const waUrl = msg => `https://api.whatsapp.com/send?phone=${WA}&text=${encodeURIComponent(msg)}`;
const defaultMsg  = "Hi Super J Travels! I'd like to book a cab.";

// Wire all static WA links
['navWa','mobileWa','heroWa','svcWa','ctaWa','contactWa','footerWa','footerWa2','floatWa'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.href = waUrl(defaultMsg);
  el.target = '_blank';
  el.rel = 'noopener noreferrer';
});

// Fleet book buttons
document.querySelectorAll('.fleet-btn').forEach(btn => {
  btn.href   = waUrl(`Hi Super J Travels! I'd like to book a ${btn.dataset.v}.`);
  btn.target = '_blank';
  btn.rel    = 'noopener noreferrer';
});

// Route cards
document.querySelectorAll('.route-card').forEach(card => {
  card.href   = waUrl(`Hi! I'd like to book a cab from Chennai to ${card.dataset.t}.`);
  card.target = '_blank';
  card.rel    = 'noopener noreferrer';
});

// Hero inline booking form
document.getElementById('hcSubmit').addEventListener('click', () => {
  const n  = document.getElementById('hcName').value.trim();
  const p  = document.getElementById('hcPhone').value.trim();
  const pu = document.getElementById('hcPickup').value.trim();
  const d  = document.getElementById('hcDrop').value.trim();
  const v  = document.getElementById('hcVehicle').value.trim();
  if (!n || !p) { alert('Please enter your name and phone number.'); return; }
  const parts = [`Hi Super J Travels!`, `Name: ${n}`, `Phone: ${p}`,
    pu && `Pickup: ${pu}`, d && `Drop: ${d}`, v && `Vehicle: ${v}`];
  window.open(waUrl(parts.filter(Boolean).join('\n')), '_blank', 'noopener,noreferrer');
});

// Contact form
document.getElementById('formBtn').addEventListener('click', () => {
  const n  = document.getElementById('fName').value.trim();
  const p  = document.getElementById('fPhone').value.trim();
  const pu = document.getElementById('fPickup').value.trim();
  const d  = document.getElementById('fDrop').value.trim();
  const v  = document.getElementById('fVehicle').value.trim();
  if (!n || !p) { alert('Please enter your name and phone number.'); return; }
  const parts = [`Hi Super J Travels!`, `Name: ${n}`, `Phone: ${p}`,
    pu && `Pickup: ${pu}`, d && `Drop: ${d}`, v && `Vehicle: ${v}`];
  window.open(waUrl(parts.filter(Boolean).join('\n')), '_blank', 'noopener,noreferrer');
});

/* ── Navbar scroll + active link highlight ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  const pos = window.scrollY + 80;
  document.querySelectorAll('section[id]').forEach(s => {
    const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
    if (link) link.classList.toggle('active', pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight);
  });
}, { passive: true });

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
function closeMenu() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
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

/* ── Fleet slideshows ── */
(function initFleetSlideshows() {
  document.querySelectorAll('.fleet-cat-card').forEach(card => {
    const wrap    = card.querySelector('.fcc-slideshow');
    const strip   = card.querySelector('.fcc-slides');
    const slides  = card.querySelectorAll('.fcc-slide');
    const dotsEl  = card.querySelector('.fcc-dots');
    const prevBtn = card.querySelector('.fcc-prev');
    const nextBtn = card.querySelector('.fcc-next');
    const bookBtn = card.querySelector('.fcc-book-btn');
    if (!wrap || !strip || !slides.length) return;

    let cur = 0, timer = null;
    const total = slides.length;

    // Build dots
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

    prevBtn.addEventListener('click', () => { go(cur - 1); resetAuto(); });
    nextBtn.addEventListener('click', () => { go(cur + 1); resetAuto(); });
    wrap.addEventListener('mouseenter', () => clearInterval(timer));
    wrap.addEventListener('mouseleave', resetAuto);

    // Touch swipe
    let tx = 0;
    wrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) { dx < 0 ? go(cur + 1) : go(cur - 1); resetAuto(); }
    }, { passive: true });

    resetAuto();

    // WhatsApp book button
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

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
document.querySelectorAll('.reveal, .stagger').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════════════
   SUPABASE REVIEWS — Homepage Slider
   Fetches 6 latest approved reviews, injects into
   the .t-track slider, shows "View All" if total > 6.
═══════════════════════════════════════════════════════ */

async function supaGet(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

const AV_COLORS  = ['#1058C7','#7B1FA2','#2E7D32','#C62828','#E65100','#0277BD','#558B2F','#6A1B9A','#00695C','#D81B60'];
const TYPE_EMOJI = { outstation:'🗺️', airport:'✈️', pilgrimage:'🕌', wedding:'💍', corporate:'🏢', group:'🚌' };

function avColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return AV_COLORS[Math.abs(h) % AV_COLORS.length];
}

function buildTCard(r, isActive) {
  const init  = (r.name || 'A')[0].toUpperCase();
  const col   = avColor(r.name || 'A');
  const emoji = TYPE_EMOJI[r.trip_type] || '⭐';
  const stars = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
  const date  = new Date(r.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  return `
  <div class="t-card${isActive ? ' active' : ''}">
    <div class="t-header">
      <div class="t-stars">${stars}</div>
      <div class="t-quote">"</div>
    </div>
    <p class="t-text">${r.review_text}</p>
    ${r.route ? `<p style="font-size:.68rem;color:var(--blue);font-weight:600;margin-top:-.25rem">${emoji} ${r.route}</p>` : ''}
    <div class="t-author">
      <div class="t-avatar" style="background:${col}">${init}</div>
      <div>
        <div class="t-name">${r.name}</div>
        <div class="t-loc">📍 ${r.location || 'Chennai'} · ${date}</div>
      </div>
    </div>
  </div>`;
}

function renderAggBar(total, avg) {
  const bar = document.getElementById('homeAggBar');
  if (!bar) return;
  bar.innerHTML = `
    <div style="display:flex;align-items:center;gap:.625rem">
      <span style="font-family:'Inter',sans-serif;font-size:2rem;font-weight:900;color:var(--amber)">${avg}</span>
      <div>
        <div style="color:var(--amber);font-size:1rem;letter-spacing:2px">★★★★★</div>
        <div style="font-size:.72rem;color:var(--muted);font-weight:500">${total} verified reviews</div>
      </div>
    </div>
    <div style="width:1px;height:36px;background:var(--border)"></div>
    <a href="reviews.html"
       style="font-size:.78rem;font-weight:700;color:var(--blue);text-decoration:none;
              padding:.375rem .875rem;border:1.5px solid rgba(16,88,199,.2);border-radius:9999px;
              transition:all .2s;background:#fff"
       onmouseover="this.style.background='var(--blue)';this.style.color='#fff'"
       onmouseout="this.style.background='#fff';this.style.color='var(--blue)'">
      Read All ${total} Reviews →
    </a>`;
  bar.style.opacity = '1';
}

/* Slider init — called after Supabase cards are injected */
function initSlider() {
  const track  = document.getElementById('tTrack');
  const dotsEl = document.getElementById('tDots');
  const prev   = document.getElementById('tPrev');
  const next   = document.getElementById('tNext');
  if (!track || !dotsEl || !prev || !next) return;

  const cards = track.querySelectorAll('.t-card');
  if (cards.length === 0) return;

  let current = 0;
  let autoTimer;

  // Build dots
  dotsEl.innerHTML = '';
  cards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 't-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', `Review ${i + 1}`);
    d.addEventListener('click', () => go(i));
    dotsEl.appendChild(d);
  });

  function go(n) {
    cards[current].classList.remove('active');
    dotsEl.children[current].classList.remove('active');
    current = (n + cards.length) % cards.length;
    cards[current].classList.add('active');
    dotsEl.children[current].classList.add('active');
    const cardW = cards[0].offsetWidth + 20;
    track.style.transform = `translateX(-${current * cardW}px)`;
  }

  function startAuto() { autoTimer = setInterval(() => go(current + 1), 4500); }
  function stopAuto()  { clearInterval(autoTimer); }

  prev.addEventListener('click', () => { stopAuto(); go(current - 1); startAuto(); });
  next.addEventListener('click', () => { stopAuto(); go(current + 1); startAuto(); });
  window.addEventListener('resize', () => go(current)); // recalc on resize
  startAuto();
}

async function loadHomeReviews() {
  try {
    const [latest, allApproved, statsArr] = await Promise.all([
      supaGet(`reviews?approved=eq.true&order=created_at.desc&limit=${HOME_LIMIT}&select=*`),
      supaGet(`reviews?approved=eq.true&select=id`),
      supaGet(`review_stats?select=*`)
    ]);

    const totalCount = allApproved.length;
    const stats      = statsArr[0];
    const avg        = stats
      ? stats.avg_rating
      : (latest.reduce((s, r) => s + r.stars, 0) / Math.max(latest.length, 1)).toFixed(1);

    // Inject cards
    const track = document.getElementById('tTrack');
    if (track && latest.length > 0) {
      track.innerHTML = latest.map((r, i) => buildTCard(r, i === 0)).join('');
    }

    renderAggBar(totalCount, avg);

    // "View all" button
    if (totalCount > HOME_LIMIT) {
      const wrap = document.getElementById('viewAllWrap');
      const sub  = document.getElementById('viewAllSub');
      if (wrap) wrap.style.display = 'block';
      if (sub)  sub.textContent = `Showing ${HOME_LIMIT} of ${totalCount} reviews — see all on the reviews page`;
    }

    initSlider();

  } catch (err) {
    console.error('Home reviews load failed:', err);
    // On failure: init slider with whatever skeleton/fallback cards are in the DOM
    initSlider();
  }
}

loadHomeReviews();
