(function () {
  const button = document.getElementById('themeToggle');
  let saved;
  try { saved = localStorage.getItem('theme'); } catch (_) {}
  const dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  function apply(value) {
    document.body.classList.toggle('dark', value);
    if (button) {
      button.textContent = value ? 'Light mode' : 'Dark mode';
      button.setAttribute('aria-pressed', String(value));
      button.setAttribute('aria-label', value ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }
  apply(dark);
  if (button) button.addEventListener('click', function () {
    const value = !document.body.classList.contains('dark');
    apply(value);
    try { localStorage.setItem('theme', value ? 'dark' : 'light'); } catch (_) {}
  });
})();

/* Pause controls and pointer depth are enhancements; the illustration works without JavaScript. */
(function(){
 const visual=document.querySelector('.science-visual');
 if(!visual)return;
 const button=visual.querySelector('.motion-toggle');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
 let paused=false;
 function sync(){
  const off=paused||reduced.matches||document.hidden;
  visual.classList.toggle('science-paused',off);
  button.hidden=reduced.matches;
  button.textContent=paused?'Play animation':'Pause animation';
  button.setAttribute('aria-pressed',String(paused));
 }
 button.addEventListener('click',function(){paused=!paused;sync()});
 document.addEventListener('visibilitychange',sync);
 if(reduced.addEventListener)reduced.addEventListener('change',sync);
 const stage=visual.querySelector('.science-stage');
 stage.addEventListener('pointermove',function(e){
  if(paused||reduced.matches||!fine.matches)return;
  const r=stage.getBoundingClientRect();
  stage.style.setProperty('--scene-y',((e.clientX-r.left)/r.width-.5)*24+'deg');
  stage.style.setProperty('--scene-x',-((e.clientY-r.top)/r.height-.5)*18+'deg');
 });
 stage.addEventListener('pointerleave',function(){stage.style.removeProperty('--scene-x');stage.style.removeProperty('--scene-y')});
 sync();
})();
