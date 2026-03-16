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