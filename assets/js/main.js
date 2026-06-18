// ===== PRELOADER =====
(function() {
  const preloader = document.getElementById('preloader');
  const preloaderText = document.getElementById('preloaderText');
  if (!preloader || !preloaderText) return;

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const target = 'BOSTIC3D';
  const totalFrames = 22;
  let frame = 0;

  const tick = setInterval(() => {
    let out = '';
    for (let i = 0; i < target.length; i++) {
      const revealAt = Math.floor((i / target.length) * totalFrames * 0.55);
      out += (frame >= revealAt + 8) ? target[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    preloaderText.textContent = out;
    if (++frame > totalFrames) {
      clearInterval(tick);
      preloaderText.textContent = target;
      setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 550);
      }, 300);
    }
  }, 26);
})();

gsap.registerPlugin(ScrollTrigger);

// ===== PROJECT DATA =====
const projects = {
  fallingthings: {
    title: 'Falling Things',
    category: 'Motion',
    desc: 'A short 3D animation built around object dynamics, timing, and scene composition. Physics-driven motion — focused on how things actually fall, collide, and settle.',
    software: ['3D Animation', 'Motion'],
    video: 'Renders/Fallingthings.mp4',
    images: []
  },
  thunder: {
    title: 'Thunder',
    category: 'Character',
    desc: 'An original design taken through a full body sculpt. The focus was athletic male anatomy, the way fabric wraps under tension, and a silhouette that reads clean from any angle. Includes a separate head study pushed to high-poly — front, 3/4, and side turnaround.',
    software: ['ZBrush'],
    images: [
      'Renders/Thunder_TA.jpg',
      'Renders/Turnder_TA_OG.jpg',
      'Renders/Thunder_Head_ TA.jpg',
      'Renders/Thunder_HeadHP_ TA.jpg'
    ]
  },
  pug: {
    title: 'Pug',
    category: 'Character',
    desc: 'Stylized female sculpt rooted in street fashion. Oversized shirt, tactical cargos, platform boots, braided hair — every clothing choice tells you something about the character. The challenge was keeping the proportions pushed while maintaining a clean read at every angle.',
    software: ['ZBrush'],
    images: [
      'Renders/Pug_TA.jpg',
      'Renders/Pug_Head_TA.jpg'
    ]
  },
  gachiakuta: {
    title: 'Gachiakuta',
    category: 'Stylized',
    desc: 'Fan art from the manga Gachiakuta by Naoki Yamakawa. The challenge was translating a high-energy 2D design into 3D without losing what makes it work — the exaggerated proportions, oversized limbs, street-worn aesthetic. Polypainted to stay faithful to the source.',
    software: ['ZBrush', 'Polypaint'],
    images: ['Renders/Gachiakuta_TA.jpg']
  },
  huey: {
    title: 'Huey',
    category: 'Stylized',
    desc: 'Cartoon-to-3D adaptation of Huey Freeman from The Boondocks. The design is deliberately flat — all style, minimal volume. The challenge was giving the model real 3D presence without losing the silhouette and attitude that make the character instantly recognizable.',
    software: ['ZBrush'],
    images: [
      'Renders/Huey_TA.jpg',
      'Renders/Huey_CA_TA.jpg'
    ]
  },
  jester: {
    title: 'Jester',
    category: 'Character',
    desc: 'A head sculpt study in grotesque character expression. Exaggerated anatomy, intricate braided hair, proportions pushed past realism into caricature. The focus was surface detail, skin texture, and the kind of controlled asymmetry that makes a face feel lived-in.',
    software: ['ZBrush', 'Marmoset Toolbag'],
    images: ['Renders/Jester_TA.jpg']
  },
  portrait: {
    title: 'Portrait Study',
    category: 'Study',
    desc: 'Realistic bust study grounded in anatomy. Bone structure, facial planes, skin surface — the work underneath that makes a face read as real. This is the foundation everything else builds on.',
    software: ['ZBrush'],
    images: ['Renders/Portrait_TA.jpg']
  },
  milk: {
    title: 'Milk',
    category: 'Motion',
    desc: 'A 3D animation project exploring fluid motion, timing, and material behavior. Built and rendered as a standalone motion piece.',
    software: ['3D Animation', 'Motion'],
    video: 'Renders/Milk.mp4',
    images: []
  }
};

// ===== MODAL =====
const modal = document.getElementById('modal');
const backdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalVideo = document.getElementById('modalVideo');
const modalVideoSrc = document.getElementById('modalVideoSrc');
const modalThumbs = document.getElementById('modalThumbs');
const marmosetContainer = document.getElementById('marmosetContainer');

let activeMarmosetViewer = null;
const projectOrder = ['fallingthings', 'thunder', 'pug', 'gachiakuta', 'huey', 'jester', 'portrait', 'milk'];
let currentProjectIndex = -1;

function updateModalNav() {
  const prevBtn = document.getElementById('modalPrev');
  const nextBtn = document.getElementById('modalNext');
  if (prevBtn) prevBtn.disabled = currentProjectIndex <= 0;
  if (nextBtn) nextBtn.disabled = currentProjectIndex >= projectOrder.length - 1;
}

function showImage(src, alt) {
  modalImg.src = src;
  modalImg.alt = alt;
  modalImg.style.display = 'block';
  modalVideo.style.display = 'none';
  marmosetContainer.style.display = 'none';
  destroyMarmoset();
}

function showMarmoset(mviewPath) {
  modalImg.style.display = 'none';
  modalVideo.style.display = 'none';
  marmosetContainer.style.display = 'block';
  destroyMarmoset();

  const w = marmosetContainer.clientWidth || 800;
  const h = Math.min(500, window.innerHeight * 0.55);
  const viewer = new marmoset.WebViewer(w, h, mviewPath);
  marmosetContainer.appendChild(viewer.dom);
  activeMarmosetViewer = viewer;
}

function destroyMarmoset() {
  if (activeMarmosetViewer) {
    activeMarmosetViewer.unload();
    activeMarmosetViewer = null;
  }
  marmosetContainer.innerHTML = '';
}

function openModal(projectId) {
  const p = projects[projectId];
  if (!p) return;

  const isAlreadyOpen = modal.classList.contains('active');
  currentProjectIndex = projectOrder.indexOf(projectId);

  document.getElementById('modalCategory').textContent = p.category;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.desc;

  const meta = document.getElementById('modalMeta');
  meta.innerHTML = p.software.map(s => `<span class="meta-tag">${s}</span>`).join('');

  // Default featured media
  if (p.video) {
    modalImg.style.display = 'none';
    marmosetContainer.style.display = 'none';
    modalVideo.style.display = 'block';
    modalVideoSrc.src = p.video;
    modalVideo.load();
    modalVideo.play();
  } else {
    modalVideo.style.display = 'none';
    modalVideo.pause();
    marmosetContainer.style.display = 'none';
    destroyMarmoset();
    modalImg.style.display = 'block';
    modalImg.src = p.images[0];
    modalImg.alt = p.title;
  }

  // Thumbnails
  modalThumbs.innerHTML = '';

  if (p.images.length > 0) {
    p.images.forEach((src, i) => {
      const thumb = document.createElement('div');
      const isFirst = i === 0 && !p.video;
      thumb.className = 'modal-thumb' + (isFirst ? ' active' : '');
      thumb.innerHTML = `<img src="${src}" alt="${p.title} view ${i + 1}" loading="lazy" />`;
      thumb.addEventListener('click', () => {
        document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        showImage(src, `${p.title} view ${i + 1}`);
      });
      modalThumbs.appendChild(thumb);
    });
  }

  // 3D viewer thumb if mview exists
  if (p.mview) {
    const thumb3d = document.createElement('div');
    thumb3d.className = 'modal-thumb modal-thumb--3d';
    thumb3d.innerHTML = `<span>3D</span>`;
    thumb3d.title = 'Interactive 3D viewer';
    thumb3d.addEventListener('click', () => {
      document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
      thumb3d.classList.add('active');
      showMarmoset(p.mview);
    });
    modalThumbs.appendChild(thumb3d);
  }

  updateModalNav();

  if (isAlreadyOpen) {
    gsap.fromTo('.modal-inner', { opacity: 0.6 }, { opacity: 1, duration: 0.2, ease: 'power2.out' });
  } else {
    modal.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    gsap.fromTo(modal,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', onStart: () => modal.classList.add('active') }
    );
  }
}

function closeModal() {
  gsap.to(modal, {
    opacity: 0, y: 20, duration: 0.28, ease: 'power2.in',
    onComplete: () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      modalVideo.pause();
      destroyMarmoset();
    }
  });
}

// Card click → open modal
document.querySelectorAll('.work-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const id = card.dataset.project;
    if (id) openModal(id);
  });
});

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

document.getElementById('modalPrev').addEventListener('click', () => {
  if (currentProjectIndex > 0) openModal(projectOrder[currentProjectIndex - 1]);
});
document.getElementById('modalNext').addEventListener('click', () => {
  if (currentProjectIndex < projectOrder.length - 1) openModal(projectOrder[currentProjectIndex + 1]);
});

document.addEventListener('keydown', e => {
  if (!modal.classList.contains('active')) return;
  if (e.key === 'Escape') { closeModal(); return; }
  if (e.key === 'ArrowLeft' && currentProjectIndex > 0) openModal(projectOrder[currentProjectIndex - 1]);
  if (e.key === 'ArrowRight' && currentProjectIndex < projectOrder.length - 1) openModal(projectOrder[currentProjectIndex + 1]);
});

// ===== NAV SCROLL =====
ScrollTrigger.create({
  start: 'top -60',
  onUpdate: () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
  }
});

// ===== HERO ENTRANCE =====
gsap.from('.hero-label', { y: 16, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.2 });

gsap.from('.hero-line', {
  y: '110%', opacity: 0,
  duration: 1, ease: 'power3.out',
  stagger: 0.1, delay: 0.4
});

gsap.from('.hero-tagline', { y: 14, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.65 });
gsap.from('.hero-sub',  { y: 16, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.75 });
gsap.from('.hero-cta',  { y: 16, opacity: 0, duration: 0.7, ease: 'power2.out', delay: 0.9 });
gsap.from('.hero-visual', { x: 50, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.35 });
gsap.from('.hero-scroll', { opacity: 0, duration: 1, ease: 'power2.out', delay: 1.4 });

// ===== SCROLL ANIMATIONS =====
gsap.utils.toArray('.work-card').forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 88%' },
    y: 44, opacity: 0, scale: 0.97, duration: 0.72, ease: 'power2.out',
    delay: (i % 3) * 0.1
  });
});

// About: text from left, stack from right — split reveal
gsap.from('.about-text', {
  scrollTrigger: { trigger: '#about', start: 'top 75%' },
  x: -45, opacity: 0, duration: 0.95, ease: 'power3.out'
});
gsap.from('.about-stack', {
  scrollTrigger: { trigger: '#about', start: 'top 75%' },
  x: 45, opacity: 0, duration: 0.95, ease: 'power3.out', delay: 0.1
});

gsap.from('.skill-item', {
  scrollTrigger: { trigger: '#skills', start: 'top 78%' },
  y: 32, opacity: 0, scale: 0.95, duration: 0.6, ease: 'power2.out', stagger: 0.07
});

gsap.from('.service-card', {
  scrollTrigger: { trigger: '#services', start: 'top 78%' },
  y: 32, opacity: 0, scale: 0.96, duration: 0.6, ease: 'power2.out', stagger: 0.1
});

gsap.from('.contact-inner', {
  scrollTrigger: { trigger: '#contact', start: 'top 78%' },
  y: 55, opacity: 0, scale: 0.96, duration: 1.05, ease: 'power3.out'
});

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((window.scrollY / total) * 100) + '%';
  }, { passive: true });
}

// ===== BACK TO TOP + HERO SCROLL FADE =====
const backToTop = document.getElementById('backToTop');
const heroScrollEl = document.querySelector('.hero-scroll');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
  if (heroScrollEl) heroScrollEl.style.opacity = window.scrollY > 80 ? '0' : '1';
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== MOBILE NAV =====
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinksEl.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinksEl.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== NAV ACTIVE STATE =====
const navSections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

navSections.forEach(s => sectionObserver.observe(s));

// ===== HERO TEXT SCRAMBLE =====
(function() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!';
  const heroLines = document.querySelectorAll('.hero-line');

  function scramble(el, delay) {
    const target = el.textContent.trim();
    const totalFrames = 42;
    let frame = 0;
    setTimeout(() => {
      const tick = setInterval(() => {
        let out = '';
        for (let i = 0; i < target.length; i++) {
          const revealAt = Math.floor((i / target.length) * totalFrames * 0.65);
          if (frame >= revealAt + 12) {
            out += target[i];
          } else {
            out += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        el.textContent = out;
        if (++frame > totalFrames) {
          clearInterval(tick);
          el.textContent = target;
        }
      }, 28);
    }, delay);
  }

  // Fire after GSAP hero entrance animation finishes (~1.6s)
  setTimeout(() => {
    heroLines.forEach((el, i) => scramble(el, i * 230));
  }, 1600);
})();

// ===== MAGNETIC HERO BUTTONS =====
document.querySelectorAll('.hero-cta .btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.22;
    const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.28;
    gsap.to(btn, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });
});

// ===== CUSTOM CURSOR =====
if (window.matchMedia('(pointer: fine)').matches) {
  const cursorDot  = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;

  document.body.classList.add('has-cursor');

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .work-card, .filter-btn, .service-card, .skill-item').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorDot.classList.add('cursor-hover'); cursorRing.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', () => { cursorDot.classList.remove('cursor-hover'); cursorRing.classList.remove('cursor-hover'); });
  });

  document.addEventListener('mouseleave', () => { cursorDot.classList.add('cursor-hidden'); cursorRing.classList.add('cursor-hidden'); });
  document.addEventListener('mouseenter', () => { cursorDot.classList.remove('cursor-hidden'); cursorRing.classList.remove('cursor-hidden'); });
}

// ===== HERO IMAGE PARALLAX =====
(function() {
  const heroSection = document.getElementById('hero');
  const heroImg = document.querySelector('.hero-visual img');
  if (!heroSection || !heroImg || !window.matchMedia('(pointer: fine)').matches) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const dx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2; // -1 to 1
    const dy = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    gsap.to(heroImg, {
      x: dx * 10,
      y: dy * 7,
      duration: 0.9,
      ease: 'power2.out'
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    gsap.to(heroImg, { x: 0, y: 0, duration: 0.9, ease: 'power2.out' });
  });
})();

// ===== WORK CARD NUMBERS =====
document.querySelectorAll('.work-card').forEach((card, i) => {
  const numEl = document.createElement('span');
  numEl.className = 'card-num';
  numEl.setAttribute('aria-hidden', 'true');
  numEl.textContent = String(i + 1).padStart(2, '0');
  card.prepend(numEl);
});

// ===== PORTFOLIO FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        gsap.fromTo(card,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      } else {
        card.classList.add('hidden');
      }
    });

    // Let CSS handle responsive columns; clear any inline override
    document.getElementById('workGrid').style.gridTemplateColumns = '';
  });
});
