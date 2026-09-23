/* Wiring the Moon — shared behaviors: theme, starfield, reveal, progress, nav */
(function(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.__reducedMotion = reduced;
  const body=document.body;

  /* Theme (default dark, remembered; ?theme=light|dark overrides) */
  try{
    let t=localStorage.getItem('moonbase-theme');
    const p=new URLSearchParams(location.search).get('theme');
    if(p==='light'||p==='dark'){t=p;localStorage.setItem('moonbase-theme',p);}
    if(t==='light') body.classList.add('light');
  }catch(e){}
  function isLight(){return body.classList.contains('light');}
  const tb=document.getElementById('theme-toggle');
  function syncBtn(){ if(tb){ tb.textContent = isLight() ? '☾' : '☀'; tb.title = isLight() ? 'Switch to dark' : 'Switch to light'; } }
  syncBtn();
  if(tb){ tb.addEventListener('click',()=>{
    body.classList.toggle('light');
    try{ localStorage.setItem('moonbase-theme', isLight()?'light':'dark'); }catch(e){}
    syncBtn();
    if(window.__paintStars) window.__paintStars();
  }); }

  /* Font preview (default serif; ?font=sans previews the NASA-style sans stack, ?font=serif resets) */
  try{
    let f=localStorage.getItem('moonbase-font');
    const pf=new URLSearchParams(location.search).get('font');
    if(pf==='sans'||pf==='serif'){f=pf;localStorage.setItem('moonbase-font',pf);}
    if(f==='sans'){
      body.classList.add('sans');
      const l=document.createElement('link');l.rel='stylesheet';
      l.href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Public+Sans:wght@300;400;500;600&display=swap';
      document.head.appendChild(l);
    }
  }catch(e){}

  /* Starfield (theme-aware) */
  const c=document.getElementById('stars');
  if(c){
    const x=c.getContext('2d');let w,h,stars=[];
    function size(){w=c.width=innerWidth;h=c.height=innerHeight;
      const n=Math.min(200,Math.floor(w*h/9500));
      stars=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,z:Math.random()*.8+.2,r:Math.random()*1.3+.2,t:Math.random()*6}));}
    size();addEventListener('resize',size);
    function paint(){
      const light=isLight();
      x.fillStyle= light ? '#f5f1e8' : '#05070f';
      x.fillRect(0,0,w,h);
      for(const s of stars){const tw=reduced?1:.55+.45*Math.sin(s.t+=0.01+s.z*0.02);
        x.globalAlpha=(light?0.10:1)*tw*s.z;
        x.fillStyle= light ? '#4a463c' : (s.z>.7?'#dfe8ff':'#f2ece0');
        x.beginPath();x.arc(s.x,s.y,s.r,0,6.283);x.fill();}
      x.globalAlpha=1;
    }
    function loop(){paint();requestAnimationFrame(loop);}
    if(reduced)paint();else loop();
    window.__paintStars=paint;
  }

  /* Scroll progress */
  const prog=document.getElementById('prog');
  if(prog){addEventListener('scroll',()=>{prog.style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%';},{passive:true});}

  /* Reveal on scroll.
     threshold must stay 0. A percentage threshold silently breaks any element
     taller than viewport/threshold, because that fraction can never be visible
     at once. The rescued-frames grid on /moonkam/ hits this on phones, where it
     stacks to one column and runs several thousand pixels tall. rootMargin does
     the "wait until it is properly on screen" job instead. */
  const reveal=el=>el.classList.add('in');
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){reveal(e.target);io.unobserve(e.target);}}),
      {rootMargin:'0px 0px -12% 0px',threshold:0});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  }else{
    document.querySelectorAll('.reveal').forEach(reveal);
  }

  /* Nav active state */
  const page=body.dataset.page;
  if(page){document.querySelectorAll('.nav a.link[data-nav]').forEach(a=>{if(a.dataset.nav===page)a.classList.add('active');});}
})();
