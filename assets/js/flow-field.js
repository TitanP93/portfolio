(function () {
  const canvas = document.getElementById('flow-field');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width || window.innerWidth, canvas.height || window.innerHeight);
    return;
  }

  const COLOR         = '#B80F0A';
  const TRAIL_OPACITY = 0.1;
  const COUNT         = window.matchMedia('(pointer: coarse)').matches ? 150 : 600;
  const SPEED         = 0.8;
  const BG            = '10, 10, 10'; // matches --bg: #0a0a0a

  let width, height, particles, animId;
  const mouse = { x: -1000, y: -1000 };

  class Particle {
    constructor(stagger) {
      this.life = Math.random() * 200 + 100;
      this.x    = Math.random() * width;
      this.y    = Math.random() * height;
      this.vx   = 0;
      this.vy   = 0;
      // Stagger initial ages so canvas isn't empty on first frame
      this.age  = stagger ? Math.random() * this.life : 0;
    }

    reset() {
      this.x    = Math.random() * width;
      this.y    = Math.random() * height;
      this.vx   = 0;
      this.vy   = 0;
      this.age  = 0;
      this.life = Math.random() * 200 + 100;
    }

    update() {
      const angle = (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI;
      this.vx += Math.cos(angle) * 0.2 * SPEED;
      this.vy += Math.sin(angle) * 0.2 * SPEED;

      const dx   = mouse.x - this.x;
      const dy   = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        const f = (150 - dist) / 150;
        this.vx -= dx * f * 0.05;
        this.vy -= dy * f * 0.05;
      }

      this.x  += this.vx;
      this.y  += this.vy;
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.age++;

      if (this.age > this.life) this.reset();
      if (this.x < 0)      this.x = width;
      if (this.x > width)  this.x = 0;
      if (this.y < 0)      this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      const alpha = 1 - Math.abs((this.age / this.life) - 0.5) * 2;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle   = COLOR;
      ctx.fillRect(this.x, this.y, 1.5, 1.5);
    }
  }

  function init() {
    const dpr  = window.devicePixelRatio || 1;
    width      = window.innerWidth;
    height     = window.innerHeight;
    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = width  + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Solid fill on init so there's no transparent flash before first animate tick
    ctx.fillStyle = 'rgb(' + BG + ')';
    ctx.fillRect(0, 0, width, height);

    particles = Array.from({ length: COUNT }, (_, i) => new Particle(true));
  }

  function animate() {
    ctx.fillStyle = 'rgba(' + BG + ', ' + TRAIL_OPACITY + ')';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    ctx.globalAlpha = 1;

    animId = requestAnimationFrame(animate);
  }

  init();
  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      init();
      animate();
    }, 150);
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });
})();
