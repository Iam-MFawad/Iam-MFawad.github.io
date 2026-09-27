(function(){
 const button=document.getElementById('themeToggle');
 let saved;try{saved=localStorage.getItem('portfolio-theme');}catch(_){}
 function apply(theme){
  const dark=theme!=='light';
  document.body.classList.toggle('dark',dark);
  document.body.dataset.theme=dark?'midnight':'light';
  if(button){
   button.textContent=dark?'☀':'☾';
   button.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
   button.title=dark?'Light mode':'Dark mode';
   button.removeAttribute('aria-pressed');
  }
 }
 apply(saved==='light'?'light':'midnight');
 if(button)button.addEventListener('click',function(){
  const theme=document.body.classList.contains('dark')?'light':'midnight';
  apply(theme);
  try{localStorage.setItem('portfolio-theme',theme);}catch(_){}
 });
})();

/* Pause controls and pointer depth are enhancements; the illustration works without JavaScript. */
(function(){
 const visual=document.querySelector('.science-visual');
 if(!visual)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const fine=window.matchMedia('(hover: hover) and (pointer: fine)');
 function sync(){
  const off=reduced.matches||document.hidden;
  visual.classList.toggle('science-paused',off);
 }
 document.addEventListener('visibilitychange',sync);
 if(reduced.addEventListener)reduced.addEventListener('change',sync);
 const stage=visual.querySelector('.science-stage');
 stage.addEventListener('pointermove',function(e){
  if(reduced.matches||!fine.matches)return;
  const r=stage.getBoundingClientRect();
  stage.style.setProperty('--scene-y',((e.clientX-r.left)/r.width-.5)*24+'deg');
  stage.style.setProperty('--scene-x',-((e.clientY-r.top)/r.height-.5)*18+'deg');
 });
 stage.addEventListener('pointerleave',function(){stage.style.removeProperty('--scene-x');stage.style.removeProperty('--scene-y')});
 sync();
})();

(function(){
 const form=document.getElementById('contact-form');
 if(!form)return;
 const button=form.querySelector('button[type="submit"]');
 const status=document.getElementById('contact-status');
 let sending=false;
 form.addEventListener('submit',async function(event){
  event.preventDefault();
  if(sending||!form.reportValidity())return;
  const data=new FormData(form);
  if(!String(data.get('name')||'').trim()||!String(data.get('message')||'').trim()||!String(data.get('subject')||'').trim()){
   status.textContent='Please enter your name, subject, and message.';
   return;
  }
  sending=true;
  button.disabled=true;
  button.textContent='Sending…';
  form.setAttribute('aria-busy','true');
  status.textContent='';
  try{
   const response=await fetch(form.action,{method:'POST',body:data,headers:{Accept:'application/json'}});
   if(response.ok){
    status.textContent='Thank you. Your message has been submitted successfully.';
    form.reset();
   }else{
    status.textContent='Your message could not be submitted. Please try again or email fawadkhn42@gmail.com. Your entries have been kept.';
   }
  }catch(error){
   status.textContent='We could not confirm submission. Check your connection before trying again, or email fawadkhn42@gmail.com. Your entries have been kept.';
  }finally{
   sending=false;
   button.disabled=false;
   button.textContent='Send Message ↗';
   form.removeAttribute('aria-busy');
  }
 });
})();

/* Avoid background animation work while this tab is hidden. */
(function(){
 function syncBackground(){document.body.classList.toggle('background-paused',document.hidden);}
 document.addEventListener('visibilitychange',syncBackground);
 syncBackground();
})();
