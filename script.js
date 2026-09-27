(function(){
 const button=document.getElementById('themeToggle');
 let saved;try{saved=localStorage.getItem('portfolio-theme');if(!saved){saved=localStorage.getItem('theme')==='light'?'purple':'midnight';}}catch(_){}
 function apply(theme){
  const midnight=theme!=='purple';
  document.body.classList.toggle('dark',midnight);
  document.body.dataset.theme=midnight?'midnight':'purple';
  if(button){button.textContent=midnight?'Purple theme':'Midnight theme';button.setAttribute('aria-label','Switch to '+(midnight?'Purple':'Midnight')+' theme');button.removeAttribute('aria-pressed');}
  window.dispatchEvent(new Event('portfolio-theme'));
 }
 apply(saved||'midnight');
 if(button)button.addEventListener('click',function(){const next=document.body.dataset.theme==='midnight'?'purple':'midnight';apply(next);try{localStorage.setItem('portfolio-theme',next);}catch(_){}});
})();/* Pause controls and pointer depth are enhancements; the illustration works without JavaScript. */
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


/* Low-density particle background, capped resolution and paused off-tab. */
(function(){
 const canvas=document.getElementById('ambient-network');
 if(!canvas)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let w=0,h=0,points=[],raf=0,last=0;
 function resize(){
  w=innerWidth;h=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);
  canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  points=Array.from({length:Math.min(w<700?22:48,Math.max(14,Math.floor(w*h/26000)))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7}));
  draw(0);
 }
 function draw(dt){
  ctx.clearRect(0,0,w,h);
  const purple=document.body.dataset.theme==='purple',rgb=purple?'166,129,255':'128,177,229';
  for(const p of points){p.x=(p.x+p.vx*dt+w)%w;p.y=(p.y+p.vy*dt+h)%h;}
  for(let i=0;i<points.length;i++){
   const p=points[i];ctx.fillStyle='rgba('+rgb+',0.36)';ctx.beginPath();ctx.arc(p.x,p.y,1.5,0,Math.PI*2);ctx.fill();
   for(let j=i+1;j<points.length;j++){const q=points[j],dist=Math.hypot(p.x-q.x,p.y-q.y);if(dist<135){ctx.strokeStyle='rgba('+rgb+','+(.13*(1-dist/135))+')';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
  }
 }
 function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;draw(dt);raf=requestAnimationFrame(frame);}
 function sync(){cancelAnimationFrame(raf);if(!document.hidden&&!reduced.matches){last=performance.now();raf=requestAnimationFrame(frame);}else draw(0);}
 addEventListener('resize',resize);addEventListener('portfolio-theme',()=>draw(0));document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);resize();sync();
})();

/* Reveal only offscreen sections; content stays visible without JavaScript. */
(function(){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches||!('IntersectionObserver' in window))return;
 const nodes=document.querySelectorAll('.research-section,.selected-publications,.contact-card,.visitor-map-depth,.document-page .card');
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.remove('reveal-pending');observer.unobserve(entry.target);}}},{threshold:0,rootMargin:'0px 0px -20px 0px'});
 nodes.forEach(node=>{if(node.getBoundingClientRect().top>innerHeight){node.classList.add('section-reveal','reveal-pending');observer.observe(node);}});
 reduced.addEventListener('change',()=>{if(reduced.matches){nodes.forEach(n=>n.classList.remove('reveal-pending'));observer.disconnect();}});
})();

/* Progressive Three.js centerpiece; the original SVG remains as a fallback. */
(async function(){
 const host=document.getElementById('population-3d');if(!host)return;
 let renderer;
 try{
  const T=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
  renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setClearColor(0x000000,0);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(40,1,.1,40);camera.position.z=6.5;
  scene.add(new T.AmbientLight(0xb9bbff,1.6));
  const light=new T.PointLight(0x77eaff,30);light.position.set(3,3,4);scene.add(light);
  const rim=new T.PointLight(0x9b63ff,20);rim.position.set(-3,0,2);scene.add(rim);
  const group=new T.Group();scene.add(group);
  const cyan=new T.MeshStandardMaterial({color:0x80e0f2,metalness:.25,roughness:.35,emissive:0x134357});
  const violet=new T.MeshStandardMaterial({color:0xac8aff,metalness:.2,roughness:.4,emissive:0x25134c});
  const coords=[];const count=18;
  for(let i=0;i<count;i++){
   const y=1-2*(i+.5)/count,r=Math.sqrt(1-y*y),a=i*Math.PI*(3-Math.sqrt(5));
   const v=new T.Vector3(1.6*r*Math.cos(a),1.6*y,1.6*r*Math.sin(a));coords.push(v);
   const node=new T.Mesh(new T.SphereGeometry(.085,14,10),i%3?violet:cyan);node.position.copy(v);group.add(node);
  }
  const lines=[];
  for(let i=0;i<count;i++)for(let j=i+1;j<count;j++)if(coords[i].distanceTo(coords[j])<1.45)lines.push(...coords[i].toArray(),...coords[j].toArray());
  const geom=new T.BufferGeometry();geom.setAttribute('position',new T.Float32BufferAttribute(lines,3));
  group.add(new T.LineSegments(geom,new T.LineBasicMaterial({color:0x88b9ee,transparent:true,opacity:.42})));
  // Central person represents people at the center of population-health research.
  const person=new T.Group();scene.add(person);
  const head=new T.Mesh(new T.SphereGeometry(.25,24,16),cyan);head.position.y=.32;person.add(head);
  const torso=new T.Mesh(new T.CylinderGeometry(.19,.43,.65,24),cyan);torso.position.y=-.24;person.add(torso);
  host.appendChild(renderer.domElement);
  const stage=host.closest('.science-stage');stage.classList.add('webgl-ready');
  host.tabIndex=0;host.setAttribute('role','img');host.setAttribute('aria-label','Interactive population-health network. Drag horizontally or use arrow keys to rotate.');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0,last=0,visible=true,drag=false,x=0,y=0;
  function draw(){renderer.render(scene,camera);}
  function resize(){const size=host.clientWidth;if(size){renderer.setSize(size,host.clientHeight,false);camera.aspect=size/host.clientHeight;camera.updateProjectionMatrix();draw();}}
  function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;if(!drag)group.rotation.y+=dt*.16;draw();raf=requestAnimationFrame(frame);}
  function sync(){cancelAnimationFrame(raf);if(visible&&!document.hidden&&!reduced.matches){last=performance.now();raf=requestAnimationFrame(frame);}else draw();}
  host.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;drag=true;x=e.clientX;y=e.clientY;host.setPointerCapture(e.pointerId);});
  host.addEventListener('pointermove',e=>{if(!drag)return;group.rotation.y+=(e.clientX-x)*.008;group.rotation.x=Math.max(-.8,Math.min(.8,group.rotation.x+(e.clientY-y)*.005));x=e.clientX;y=e.clientY;draw();});
  function release(){drag=false;}host.addEventListener('pointerup',release);host.addEventListener('pointercancel',release);host.addEventListener('lostpointercapture',release);
  host.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')group.rotation.y-=.15;if(e.key==='ArrowRight')group.rotation.y+=.15;if(e.key==='ArrowUp')group.rotation.x-=.1;if(e.key==='ArrowDown')group.rotation.x+=.1;draw();});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);stage.classList.remove('webgl-ready');host.hidden=true;});
  new ResizeObserver(resize).observe(host);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();}).observe(host);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);resize();sync();
 }catch(_){if(renderer)renderer.dispose();host.hidden=true;host.closest('.science-stage').classList.remove('webgl-ready');}
})();
