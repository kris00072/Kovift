const menu = document.querySelector('.menu-button, .menu');
const nav = document.querySelector('.nav');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('open', !open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('open');
}));
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const status = document.createElement('p');
  status.className = 'form-status';
  status.setAttribute('role', 'alert');
  status.hidden = true;
  contactForm.appendChild(status);

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.hidden = true;
    status.textContent = '';

    const button = contactForm.querySelector('button[type="submit"]');
    const originalHTML = button?.innerHTML || 'Send';
    if (button) {
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      button.innerHTML = 'Sending...';
    }

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      window.location.href = 'thank-you.html';
    } catch (error) {
      if (button) {
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.innerHTML = originalHTML;
      }
      status.textContent = 'Something went wrong. Your message was not sent. Please try again, or email contact@kovift.com directly.';
      status.hidden = false;
    }
  });
}
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* Services hero: constellation lines linking the hub core to each capability chip */
const chipField = document.querySelector('.sv-chips');
if (chipField) {
  const lineLayer = chipField.querySelector('.sv-lines');
  const core = chipField.querySelector('.sv-core');
  const drawLines = () => {
    if (!chipField.offsetParent) return; /* chips hidden below 1330px */
    const field = chipField.getBoundingClientRect();
    lineLayer.setAttribute('viewBox', `0 0 ${field.width} ${field.height}`);
    lineLayer.replaceChildren();
    const cx = core.offsetLeft + core.offsetWidth / 2;
    const cy = core.offsetTop + core.offsetHeight / 2;
    chipField.querySelectorAll('.sv-chip').forEach((chip, i) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', chip.offsetLeft - 10);
      line.setAttribute('y2', chip.offsetTop + chip.offsetHeight / 2);
      line.style.animationDelay = `${-i * 0.23}s`;
      lineLayer.append(line);
      chip.addEventListener('mouseenter', () => line.classList.add('hot'));
      chip.addEventListener('mouseleave', () => line.classList.remove('hot'));
    });
  };
  let lineTimer;
  window.addEventListener('resize', () => { clearTimeout(lineTimer); lineTimer = setTimeout(drawLines, 150); });
  if (document.fonts?.ready) document.fonts.ready.then(drawLines);
  window.addEventListener('load', drawLines);
  drawLines();
}
