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

/* About hero: dotted world map rendering the project delivery footprint */
const mapField = document.querySelector('.ab-map');
if (mapField && window.WORLD_DOT_GRID) {
  const grid = window.WORLD_DOT_GRID;
  const mapCanvas = mapField.querySelector('.ab-map-canvas');
  const mapTip = mapField.querySelector('.ab-map-tip');
  const SHIPPED = [
    ['United States', -98.5, 39.5], ['United Kingdom', -1.6, 52.6], ['Germany', 10.4, 51.2],
    ['France', 2.3, 46.8], ['Spain', -3.7, 40.3], ['Norway', 8.8, 61.2],
    ['Egypt', 30.9, 26.7], ['Nigeria', 8.1, 9.4], ['Brazil', -51.9, -10.5],
    ['Argentina', -64.7, -34.5], ['India', 78.8, 22.5], ['Singapore', 103.8, 1.35],
    ['Indonesia', 113.8, -0.4], ['Australia', 134, -25.5]
  ];
  const mapCols = grid.rows[0].length, mapRows = grid.rows.length;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${mapCols} ${mapRows}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  const defs = document.createElementNS(svgNS, 'defs');
  defs.innerHTML = '<radialGradient id="ab-glow"><stop offset="0" stop-color="#fc5b2b" stop-opacity=".95"/><stop offset=".4" stop-color="#fc5b2b" stop-opacity=".38"/><stop offset="1" stop-color="#fc5b2b" stop-opacity="0"/></radialGradient>';
  svg.append(defs);
  const dots = document.createElementNS(svgNS, 'g');
  dots.setAttribute('class', 'ab-dots');
  grid.rows.forEach((line, r) => {
    for (let c = 0; c < mapCols; c++) if (line[c] === '#') {
      const dot = document.createElementNS(svgNS, 'circle');
      dot.setAttribute('cx', c + 0.5);
      dot.setAttribute('cy', r + 0.5);
      dot.setAttribute('r', 0.34);
      dots.append(dot);
    }
  });
  svg.append(dots);
  const project = (lon, lat) => [(lon + 180) / 360 * mapCols, (grid.latTop - lat) / grid.latSpan * mapRows];
  SHIPPED.forEach(([name, lon, lat], i) => {
    const [x, y] = project(lon, lat);
    const marker = document.createElementNS(svgNS, 'g');
    marker.setAttribute('class', 'ab-marker');
    marker.style.setProperty('--d', `${(i * 0.14).toFixed(2)}s`);
    const halo = document.createElementNS(svgNS, 'circle');
    halo.setAttribute('class', 'halo');
    halo.setAttribute('cx', x); halo.setAttribute('cy', y); halo.setAttribute('r', 0.6);
    const core = document.createElementNS(svgNS, 'circle');
    core.setAttribute('class', 'core');
    core.setAttribute('cx', x); core.setAttribute('cy', y); core.setAttribute('r', 0.55);
    const hit = document.createElementNS(svgNS, 'circle');
    hit.setAttribute('class', 'hit');
    hit.setAttribute('cx', x); hit.setAttribute('cy', y); hit.setAttribute('r', 1.8);
    const bloom = document.createElementNS(svgNS, 'circle');
    bloom.setAttribute('class', 'bloom');
    bloom.setAttribute('cx', x); bloom.setAttribute('cy', y); bloom.setAttribute('r', 2.3);
    marker.append(bloom, halo, core, hit);
    marker.addEventListener('mouseenter', () => {
      mapTip.textContent = `Shipped \u00b7 ${name}`;
      mapTip.style.left = `${x / mapCols * mapCanvas.clientWidth}px`;
      mapTip.style.top = `${y / mapRows * mapCanvas.clientHeight}px`;
      mapTip.hidden = false;
    });
    marker.addEventListener('mouseleave', () => { mapTip.hidden = true; });
    svg.append(marker);
  });
  mapCanvas.append(svg);
}

/* ===== Solutions page: industry selector ===== */
(function(){
  var wrap=document.querySelector('.sl-tabs');if(!wrap)return;
  var tabs=[].slice.call(wrap.querySelectorAll('.sl-tab'));
  var panels=[].slice.call(wrap.querySelectorAll('.sl-panel'));
  if(!tabs.length||tabs.length!==panels.length)return;
  function activate(i){
    tabs.forEach(function(t,j){var on=j===i;t.classList.toggle('is-active',on);t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;});
    panels.forEach(function(p,j){if(j===i){p.removeAttribute('hidden');}else{p.setAttribute('hidden','');}});
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){activate(i);});
    t.addEventListener('keydown',function(e){
      var d=e.key==='ArrowDown'||e.key==='ArrowRight'?1:(e.key==='ArrowUp'||e.key==='ArrowLeft'?-1:0);
      if(!d)return;e.preventDefault();var n=(i+d+tabs.length)%tabs.length;activate(n);tabs[n].focus();
    });
  });
  var m=(location.search||'').match(/tab=(\d+)/);
  if(m)activate(Math.min(tabs.length,Math.max(1,+m[1]))-1);
})();
