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

/* ===== Solutions: network visualization ===== */
(function(){
  var wrap=document.querySelector('.sl-tabs');if(!wrap)return;
  var svg=wrap.querySelector('.sl-network');if(!svg)return;
  var panels=[].slice.call(wrap.querySelectorAll('.sl-panel'));
  if(!panels.length)return;
  var svgNS='http://www.w3.org/2000/svg';
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NETWORKS=[
    {colors:['var(--orange)','var(--orange)'],nodes:[[18,28],[38,16],[58,30],[78,12],[26,58],[46,52],[66,48],[86,42],[42,76],[62,72],[16,74],[82,76]],links:[[0,1],[1,2],[2,3],[0,4],[4,5],[5,6],[4,8],[8,9],[9,10],[6,8],[6,7],[7,11],[3,7],[2,4]]},
    {colors:['var(--cyan)','var(--cyan)'],nodes:[[22,28],[32,26],[28,36],[58,22],[68,26],[62,34],[82,48],[76,56],[88,52],[48,68],[58,72],[52,64]],links:[[0,1],[1,2],[0,2],[3,4],[4,5],[3,5],[0,3],[6,7],[7,8],[6,8],[3,9],[9,10],[4,10],[9,11]]},
    {colors:['var(--orange)','var(--orange)'],nodes:[[15,30],[35,15],[55,35],[75,20],[40,50],[50,58],[60,50],[30,65],[55,75],[20,80],[40,70],[60,80]],links:[[0,1],[1,2],[2,3],[3,6],[5,6],[4,5],[4,7],[7,8],[5,8],[8,9],[7,10],[9,11],[10,11],[6,4]]},
    {colors:['var(--cyan)','var(--cyan)'],nodes:[[10,30],[25,30],[40,30],[55,30],[70,30],[85,30],[30,55],[45,55],[60,55],[45,75],[30,85],[60,85]],links:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,8],[8,7],[7,6],[0,6],[6,7],[8,9],[9,10],[9,11],[5,9],[10,11]]},
    {colors:['var(--orange)','var(--orange)'],nodes:[[15,18],[40,16],[65,20],[88,14],[20,48],[45,45],[70,48],[90,44],[18,72],[42,70],[66,72],[88,68]],links:[[0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,6],[4,8],[5,8],[5,9],[6,10],[6,11],[7,11],[8,9],[9,10],[10,11],[3,7]]},
    {colors:['var(--cyan)','var(--cyan)'],nodes:[[50,30],[28,42],[72,40],[40,55],[60,58],[30,68],[70,65],[50,80],[25,78],[75,76],[20,55],[80,50]],links:[[0,1],[0,2],[1,3],[2,4],[3,5],[3,6],[4,6],[5,7],[6,7],[1,8],[2,11],[0,10],[4,9],[5,10],[3,8],[6,9],[7,10],[7,9]]}
  ];
  function generateNetwork(i){
    var net=NETWORKS[i]||NETWORKS[0];
    svg.style.setProperty('--sl-node-color',net.colors[0]);
    svg.style.setProperty('--sl-link-color',net.colors[1]);
    var linkLayer=document.createElementNS(svgNS,'g');
    var nodeLayer=document.createElementNS(svgNS,'g');
    net.links.forEach(function(link){
      var a=net.nodes[link[0]],b=net.nodes[link[1]];
      var line=document.createElementNS(svgNS,'line');
      line.setAttribute('class','sl-link');
      line.setAttribute('x1',a[0]);line.setAttribute('y1',a[1]);
      line.setAttribute('x2',b[0]);line.setAttribute('y2',b[1]);
      linkLayer.append(line);
    });
    net.nodes.forEach(function(node,idx){
      var c=document.createElementNS(svgNS,'circle');
      c.setAttribute('class','sl-node');
      c.setAttribute('cx',node[0]);
      c.setAttribute('cy',node[1]);
      c.setAttribute('r',2);
      if(!reduced){
        c.style.setProperty('--node-delay',(idx*.08).toFixed(2)+'s');
        c.style.setProperty('--pulse-dur',(2.8+Math.random()).toFixed(1)+'s');
      }
      nodeLayer.append(c);
    });
    svg.replaceChildren(linkLayer,nodeLayer);
  }
  function renderNetwork(i){
    if(svg.classList.contains('show')){
      svg.classList.remove('show');
      setTimeout(function(){generateNetwork(i);void svg.offsetWidth;svg.classList.add('show');},360);
    }else{
      generateNetwork(i);
      void svg.offsetWidth;
      svg.classList.add('show');
    }
  }
  var observer=new MutationObserver(function(){
    for(var j=0;j<panels.length;j++){
      if(!panels[j].hasAttribute('hidden')){
        renderNetwork(j);
        break;
      }
    }
  });
  panels.forEach(function(p){observer.observe(p,{attributes:true,attributeFilter:['hidden']});});
  var init=panels.findIndex(function(p){return !p.hasAttribute('hidden')});
  if(init<0)init=0;
  renderNetwork(init);
})();
