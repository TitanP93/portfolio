gsap.registerPlugin(ScrollTrigger);

// ===== PROJECT DATA =====
const projects = {
  fallingthings: {
    title: 'Falling Things',
    category: 'Motion',
    desc: '3D animation piece exploring object dynamics, motion, and timing. Demonstrates understanding of 3D animation principles, physics simulation, and scene composition.',
    software: ['3D Animation', 'Motion'],
    video: 'Renders/Fallingthings.mp4',
    images: []
  },
  thunder: {
    title: 'Thunder',
    category: 'Character',
    desc: 'Full-body character sculpt built on an original design. Focused on athletic male anatomy, clothing wraps, and a strong readable silhouette. Includes a detailed head study with high-poly surface pass. Turnaround captured from front, 3/4, and side.',
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
    desc: 'Stylized female character sculpt with strong street fashion influences. Features an oversized shirt, tactical cargo pants, platform boots, and braided hair. Emphasizes stylized proportions, fabric fold detail, and a clean read from every angle.',
    software: ['ZBrush'],
    images: [
      'Renders/Pug_TA.jpg',
      'Renders/Pug_Head_TA.jpg'
    ]
  },
  gachiakuta: {
    title: 'Gachiakuta',
    category: 'Stylized',
    desc: 'Fan art character based on the manga Gachiakuta by Naoki Yamakawa. Translated the 2D manga design into a full 3D sculpt with a polypaint color pass to stay faithful to the source material. Captures the character\'s exaggerated proportions, oversized limbs, and street-worn aesthetic.',
    software: ['ZBrush', 'Polypaint'],
    images: ['Renders/Gachiakuta_TA.jpg']
  },
  huey: {
    title: 'Huey',
    category: 'Stylized',
    desc: 'Cartoon-to-3D adaptation of Huey Freeman from The Boondocks. The challenge was translating a deliberately flat 2D animation style into a cohesive 3D form — preserving the iconic silhouette and character design while giving the model believable volume.',
    software: ['ZBrush'],
    images: [
      'Renders/Huey_TA.jpg',
      'Renders/Huey_CA_TA.jpg'
    ]
  },
  jester: {
    title: 'Jester',
    category: 'Character',
    desc: 'Grotesque head sculpt study pushing exaggerated facial anatomy and character expression. Features intricate braided hair geometry and stylized proportions that move beyond realistic form into caricature. Focused on surface detail, skin texture, and controlled asymmetry.',
    software: ['ZBrush', 'Marmoset Toolbag'],
    images: ['Renders/Jester_TA.jpg']
  },
  portrait: {
    title: 'Portrait Study',
    category: 'Study',
    desc: 'Realistic bust study grounded in human anatomy. Focused on bone structure, facial planes, skin surface quality, and the subtle variation that makes a face read as believable. Demonstrates foundational understanding of head and neck anatomy essential for character work.',
    software: ['ZBrush'],
    images: ['Renders/Portrait_TA.jpg']
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
const projectOrder = ['fallingthings', 'thunder', 'pug', 'gachiakuta', 'huey', 'jester', 'portrait'];
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
  marmosetContainer.innerHTML = '';

  // Marmoset custom element — works once marmoset.js is loaded
  const el = document.createElement('marmosettoolbag');
  el.setAttribute('src', mviewPath);
  el.setAttribute('width', marmosetContainer.clientWidth || 800);
  el.setAttribute('height', Math.min(500, window.innerHeight * 0.55));
  el.setAttribute('load', '1');
  marmosetContainer.appendChild(el);
}

function destroyMarmoset() {
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
    y: 40, opacity: 0, duration: 0.65, ease: 'power2.out',
    delay: (i % 2) * 0.12
  });
});

gsap.from('.about-text', {
  scrollTrigger: { trigger: '#about', start: 'top 75%' },
  y: 30, opacity: 0, duration: 0.8, ease: 'power2.out'
});
gsap.from('.about-stack', {
  scrollTrigger: { trigger: '#about', start: 'top 75%' },
  y: 30, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.15
});

gsap.from('.skill-item', {
  scrollTrigger: { trigger: '#skills', start: 'top 78%' },
  y: 30, opacity: 0, duration: 0.65, ease: 'power2.out', stagger: 0.08
});

gsap.from('.service-card', {
  scrollTrigger: { trigger: '#services', start: 'top 78%' },
  y: 30, opacity: 0, duration: 0.65, ease: 'power2.out', stagger: 0.12
});

gsap.from('.contact-inner', {
  scrollTrigger: { trigger: '#contact', start: 'top 78%' },
  y: 30, opacity: 0, duration: 0.8, ease: 'power2.out'
});

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
