const root=document.documentElement,body=document.body;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
window.scrollTo(0,0);

// Intro sequence
const count=document.querySelector('.loader-bottom b');
let introStart=performance.now();
function countIntro(now){const p=clamp((now-introStart)/1500);count.textContent=String(Math.round(p*100)).padStart(2,'0');if(p<1)requestAnimationFrame(countIntro)}
requestAnimationFrame(countIntro);

let lenis;
if(!reduced&&window.Lenis){
  lenis=new Lenis({duration:1.25,smoothWheel:true,wheelMultiplier:.82,touchMultiplier:1.3,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t))});
}

function splitWords(element){
  if(!element||element.dataset.split)return;
  element.dataset.split='true';
  const nodes=[...element.childNodes];
  nodes.forEach(node=>{if(node.nodeType!==3)return;const frag=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(/^\s+$/.test(word)){frag.append(word);return}const outer=document.createElement('span'),inner=document.createElement('span');outer.className='split-word';inner.textContent=word;outer.append(inner);frag.append(outer)});node.replaceWith(frag)});
}

function initMotion(){
  root.classList.add('loaded','motion-ready','gsap-ready');
  if(reduced||!window.gsap)return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({force3D:true});
  const updateRailState=()=>body.classList.toggle('rail-visible',scrollY>document.querySelector('.hero-shell').offsetHeight*.38);
  if(lenis)lenis.on('scroll',()=>{ScrollTrigger.update();updateRailState()});
  addEventListener('scroll',updateRailState,{passive:true});updateRailState();
  if(lenis)gsap.ticker.add(time=>lenis.raf(time*1000));gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('.section-title h2,.statement,.big-copy,.philosophy h2,.contact h2,.faq-grid h2').forEach(splitWords);

  // Hero: one continuous, scrubbed morph into the rail.
  const heroTL=gsap.timeline({scrollTrigger:{trigger:'.hero-shell',start:'top top',end:'bottom bottom',scrub:1.35}});
  heroTL.to('.wordmark',{y:-innerHeight*.08,x:-innerWidth*.05,scaleX:.38,scaleY:.38,opacity:.25,ease:'none'},0)
    .to('.portrait',{y:-90,scale:.82,filter:'blur(45px)',opacity:.2,ease:'none'},0)
    .to('.hero-copy',{y:-innerHeight*.32,scale:.82,opacity:0,ease:'none'},0)
    .to('.glass',{y:-70,scale:.8,opacity:0,stagger:.05,ease:'none'},.03)
    .to('.nav',{y:-40,opacity:0,ease:'none'},0);

  // Rail pieces settle sequentially after the morph.
  gsap.from('.side-rail>*',{y:24,opacity:0,stagger:.065,duration:.55,ease:'power3.out',scrollTrigger:{trigger:'.about',start:'top 82%',once:true}});

  // Editorial headings reveal word-by-word.
  document.querySelectorAll('.section-title h2,.statement,.philosophy h2,.contact h2,.faq-grid h2').forEach(el=>{
    gsap.from(el.querySelectorAll('.split-word>span'),{yPercent:115,rotate:3,filter:'blur(8px)',opacity:0,duration:.9,stagger:.045,ease:'power4.out',immediateRender:false,scrollTrigger:{trigger:el,start:'top 86%',once:true}});
  });
  gsap.utils.toArray('.eyebrow,.section-title>p,.about-grid>p,.stack-cols>div,.awards article').forEach((el,i)=>gsap.from(el,{y:28,opacity:0,filter:'blur(3px)',duration:.7,delay:(i%4)*.035,ease:'power3.out',immediateRender:false,scrollTrigger:{trigger:el,start:'top 91%',once:true}}));

  // Timeline: path draws, marker travels, cards arrive from alternating sides.
  const path=document.querySelector('.path-progress'),dot=document.querySelector('.path-dot');
  if(path){const length=path.getTotalLength();gsap.set(path,{strokeDasharray:length,strokeDashoffset:length});
    gsap.to(path,{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:'.timeline',start:'top 65%',end:'bottom 40%',scrub:1}});
    const tracker={p:0};gsap.to(tracker,{p:1,ease:'none',scrollTrigger:{trigger:'.timeline',start:'top 65%',end:'bottom 40%',scrub:1,onUpdate:()=>{const pt=path.getPointAtLength(length*tracker.p);gsap.set(dot,{attr:{cx:pt.x,cy:pt.y}})}}});
  }
  gsap.utils.toArray('.timeline article').forEach((card,i)=>gsap.fromTo(card,{x:i%2?90:-90,y:60,rotation:i%2?3:-3,scale:.92,opacity:0,filter:'blur(8px)'},{x:0,y:0,rotation:0,scale:1,opacity:1,filter:'blur(0px)',ease:'power3.out',scrollTrigger:{trigger:card,start:'top 88%',end:'top 56%',scrub:.8}}));

  // Horizontal work reel with individual depth/parallax.
  const track=document.querySelector('.projects-list');
  const getTravel=()=>Math.max(0,track.scrollWidth-innerWidth*.73);
  const projectCards=gsap.utils.toArray('.project');
  const cardLevels=[-82,54,-38,86,-18];
  gsap.to(track,{x:()=>-getTravel(),ease:'none',scrollTrigger:{trigger:'.work',start:'top top',end:'bottom bottom',scrub:1.1,invalidateOnRefresh:true,onUpdate:self=>{
    projectCards.forEach((card,i)=>{
      const r=card.getBoundingClientRect(),distance=Math.abs(r.left+r.width/2-innerWidth/2),focus=clamp(1-distance/(innerWidth*.65));
      const wave=Math.sin(self.progress*Math.PI*4+i*1.2)*24;
      gsap.set(card,{y:cardLevels[i%cardLevels.length]+wave,scale:.86+focus*.14,opacity:.42+focus*.58,rotationY:(r.left+r.width/2-innerWidth/2)/innerWidth*8,rotationZ:(i%2?1:-1)*(2.4-focus*2.1)});
      gsap.set(card.querySelector('h3'),{letterSpacing:`${-.055+focus*.025}em`});
    });
  }}});
  gsap.utils.toArray('.project').forEach((card,i)=>{
    gsap.to(card.querySelector('.project-art'),{xPercent:i%2?8:-8,scale:1.12,ease:'none',scrollTrigger:{trigger:'.work',start:'top top',end:'bottom bottom',scrub:1}});
  });

  // Isolated capability sentence: only this viewport is pinned.
  const capTL=gsap.timeline({scrollTrigger:{trigger:'.cap-stage',start:'top top',end:'+=135%',pin:true,pinReparent:true,scrub:1.05,anticipatePin:1,onToggle:self=>document.querySelector('.cap-stage').classList.toggle('is-pinned',self.isActive)}});
  capTL.fromTo('.cap-sentence',{scale:.76,y:90,opacity:.12,filter:'blur(14px)'},{scale:1,y:0,opacity:1,filter:'blur(0px)',duration:.75,ease:'power3.out'},0)
    .fromTo('.cap-label',{y:-30,opacity:0},{y:0,opacity:1,duration:.35,ease:'power2.out'},.1)
    .fromTo('.cap-chip',{y:(i)=>i%2?110:-110,x:(i)=>(i-1.5)*55,rotation:(i)=>i%2?12:-12,scale:.35,opacity:0},{y:0,x:0,rotation:0,scale:1,opacity:1,stagger:.08,duration:.65,ease:'back.out(1.5)'},.18)
    .to('.cap-sentence',{scale:1.035,duration:.35,ease:'power2.inOut'},.9)
    .to('.cap-chip',{y:(i)=>i%2?-8:8,rotation:(i)=>i%2?-2:2,stagger:.04,duration:.35,ease:'sine.inOut'},.92);
  gsap.from('.cap-grid article',{y:120,rotation:3,scale:.9,opacity:0,filter:'blur(8px)',stagger:.08,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.cap-grid',start:'top 88%',once:true}});

  // Section atmosphere and progress.
  gsap.to('.scroll-progress',{scaleY:1,ease:'none',scrollTrigger:{trigger:body,start:'top top',end:'bottom bottom',scrub:.2}});
  gsap.to('.faq-mark>span',{letterSpacing:'-.13em',scale:1.04,ease:'none',scrollTrigger:{trigger:'.faq-mark',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.to('.philosophy h2',{y:-50,ease:'none',scrollTrigger:{trigger:'.philosophy',start:'top bottom',end:'bottom top',scrub:1}});

  // Active navigation follows real sections.
  document.querySelectorAll('main section[id]').forEach(section=>ScrollTrigger.create({trigger:section,start:'top 45%',end:'bottom 45%',onToggle:self=>{if(self.isActive)document.querySelectorAll('.rail-nav a').forEach(a=>a.classList.toggle('active',a.hash===`#${section.id}`))}}));
  ScrollTrigger.refresh();
  const testTarget=new URLSearchParams(location.search).get('scroll');if(testTarget){const el=document.getElementById(testTarget);if(el){lenis?.scrollTo(el,{immediate:true});scrollTo(0,el.offsetTop);ScrollTrigger.update();updateRailState()}}
}

const skipIntro=new URLSearchParams(location.search).has('skipIntro');
function finishIntro(){document.querySelector('.loader')?.remove();root.classList.add('intro-exit','loaded');initMotion()}
function runIntro(){
  const loader=document.querySelector('.loader'),mark=document.querySelector('.loader-wordmark'),heroMark=document.querySelector('.wordmark');
  if(!loader||!mark||!heroMark||reduced||!window.gsap){finishIntro();return}
  gsap.set(heroMark,{opacity:0});
  const timeline=gsap.timeline({defaults:{ease:'power4.inOut'},onComplete:()=>{root.classList.add('morphed-intro');gsap.set(heroMark,{clearProps:'opacity'});finishIntro()}});
  timeline.fromTo(mark,{scale:.72,opacity:0,filter:'blur(14px)'},{scale:1,opacity:1,filter:'blur(0px)',duration:.75,ease:'power4.out'})
    .to('.loader-line i',{scaleX:1,duration:.65,ease:'power2.inOut'},.08)
    .to('.loader-top,.loader-bottom',{opacity:0,y:(i)=>i?-18:18,duration:.35,ease:'power2.in'},.72)
    .add(()=>{const from=mark.getBoundingClientRect(),to=heroMark.getBoundingClientRect();gsap.set(mark,{position:'fixed',left:from.left,top:from.top,width:from.width,height:from.height,margin:0,transformOrigin:'0 0'});mark.dataset.dx=String(to.left-from.left);mark.dataset.dy=String(to.top-from.top);mark.dataset.sx=String(to.width/from.width);mark.dataset.sy=String(to.height/from.height)},.9)
    .to(mark,{x:()=>Number(mark.dataset.dx),y:()=>Number(mark.dataset.dy),scaleX:()=>Number(mark.dataset.sx),scaleY:()=>Number(mark.dataset.sy),duration:1.12,ease:'expo.inOut'},.92)
    // Complete the geometry first, then crossfade identical white wordmarks.
    // Keeping the loader opaque until this point prevents the last letters clipping.
    .set(heroMark,{opacity:1},2.04)
    .to(mark,{opacity:0,duration:.24,ease:'power2.out'},2.04)
    .to(loader,{opacity:0,duration:.34,ease:'power2.inOut'},2.04);
}
window.addEventListener('load',()=>{if(skipIntro)finishIntro();else runIntro()});

// Smooth anchors
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const target=document.querySelector(link.hash);if(!target)return;event.preventDefault();lenis?lenis.scrollTo(target,{duration:1.45}):target.scrollIntoView({behavior:'smooth'})}));

// Magnetic controls
document.querySelectorAll('.button,.rail-cta,.contact-actions a,.project-main>a').forEach(el=>{el.classList.add('magnetic');el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;gsap?.to(el,{x:x*.18,y:y*.22,duration:.25,ease:'power2.out'})});el.addEventListener('pointerleave',()=>gsap?.to(el,{x:0,y:0,duration:.65,ease:'elastic.out(1,.35)'}))});

// Inertial cursor and project state.
const cursor=document.querySelector('.cursor');
if(!reduced&&matchMedia('(pointer:fine)').matches&&window.gsap){const xTo=gsap.quickTo(cursor,'x',{duration:.35,ease:'power3'}),yTo=gsap.quickTo(cursor,'y',{duration:.35,ease:'power3'});addEventListener('pointermove',e=>{xTo(e.clientX);yTo(e.clientY)});document.querySelectorAll('.project').forEach(card=>{card.addEventListener('pointerenter',()=>cursor.classList.add('is-project'));card.addEventListener('pointerleave',()=>cursor.classList.remove('is-project'))})}

// Accordions and clipboard
document.querySelectorAll('.accordions button').forEach(button=>button.addEventListener('click',()=>{const article=button.closest('article'),open=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!open));article.classList.toggle('open',!open);setTimeout(()=>ScrollTrigger?.refresh(),420)}));
const copyButton=document.querySelector('.rail-email');copyButton?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(copyButton.dataset.copy);copyButton.firstChild.textContent='Copied to clipboard '}catch{location.href=`mailto:${copyButton.dataset.copy}`}});

// Local portfolio knowledge guide. No external API or visitor data transmission.
const chat=document.querySelector('.arjun-chat'),chatLog=document.querySelector('.chat-log'),chatForm=document.querySelector('.chat-form'),chatInput=chatForm?.querySelector('input');
const knowledge=[
  [/strongest|best project|crick/i,"Cricklytics is probably Arjun’s strongest finished portfolio story: smartphone cricket video → pose and joint analysis → biomechanics → technical coaching feedback. It combines AI, computer vision, sport, and actual product execution."],
  [/viral|content/i,"Viralyst is an in-progress AI content-intelligence system. It studies hooks, pacing, structure, audience psychology, engagement signals, and patterns behind successful content. It should be presented honestly as under development."],
  [/gpt|transformer|language model/i,"Arjun is reproducing GPT-2 to understand tokenization, embeddings, self-attention, transformer blocks, training, inference, and language modeling beneath the API abstraction. The point is understanding—not making another wrapper chatbot."],
  [/byte|eats/i,"Byte Labs is Arjun’s wider software-experiment ecosystem, not one narrow SaaS. Byte Eats is one concrete web product inside it."],
  [/pen fight|game/i,"Pen Fight is a browser game based on the school pastime of fighting with pens. It demonstrates interaction design, gameplay, web development, and the ability to ship something playful instead of another AI dashboard."],
  [/rakshak|safety|fall|cctv|audio/i,"Rakshak is an AI safety-system concept combining CCTV fall detection, immobility-based severity assessment, short evidence clips, emergency alerts, glass-break detection, and a custom audio model. It is best understood as an end-to-end safety pipeline, not merely a detector."],
  [/aegis|jarvis|ultron/i,"AEGIS is Arjun’s larger planned personal-AI architecture. JARVIS handles orchestration; ULTRON technology and system interaction; E.V. research; M.J. social functions; JEAN productivity; SONIC hardware; and CORE shared memory, permissions, events, MCP, workflows, and delegation. Its roughly 189 capabilities are a specification—not 189 finished features."],
  [/uwake|awake/i,"UWAKE is solely Arjun’s project. Its key requirement is continuity: every resumed session should state where work ended, what was completed, what was active, and the recommended next steps."],
  [/hardware|arduino|iot|robot|sensor|physical/i,"Arjun’s hardware work includes Arduino, NodeMCU/ESP boards, sensors, IoT, robotics, Plant Guru, Smart Home, Automatic Zebra Crossing, F.E.A.R.N.O.T., gesture-controlled vehicles, and other physical prototypes."],
  [/achievement|award|competition|winner|hackathon/i,"Arjun won Innoskill 2025 and placed third in a hackathon. He also participated in the U.S. Embassy STEAM Workshop, Technoxian 2024, Coolest Projects, ATL programs, BBL, and the Amity robotics competition."],
  [/learn|philosophy|feedback|build/i,"Arjun learns by building: understand the minimum concept, build, break it, discover why, improve it, then attempt something harder. He prefers ruthless feasibility feedback over empty encouragement and cares about real systems, demos, and product value."],
  [/skill|stack|language|tool|linux|python/i,"His working stack includes Python, C++, HTML, CSS, JavaScript, Arduino, PyTorch, MediaPipe, OpenCV, APIs, Git, GitHub, VS Code, and Linux. For human pose or gesture work, he generally prefers MediaPipe when it fits better than YOLO."],
  [/who|identity|student|india|class/i,"Arjun Chandra is a Class 11 student builder based in India, focused on AI, software, computer vision, hardware, automation, and intelligent systems. The positioning is builder first, student second."],
  [/sport|cricket|badminton|football|anime|naruto/i,"Outside building, Arjun enjoys cricket and badminton, was strong at football when younger, and watches anime including Demon Slayer, Naruto, and Jujutsu Kaisen. He also used to draw and play games such as Blox Fruits."],
  [/car|hypercar|wv|ambition/i,"One long-term ambition is creating a car company. The WV dual-engine hypercar is still a concept whose engineering must be proven—Arjun explicitly distinguishes a compelling idea from a viable powertrain."],
  [/contact|collaborat|hire|email|whatsapp|discord|instagram/i,"Arjun is interested in ambitious AI projects, software experiments, collaborations, and difficult technical problems. Email aarjunchandra@gmail.com, Instagram @arjun_chandra7, WhatsApp or call +91 9717350301, or add arjunchandra. on Discord."],
  [/team|aviral|pradhuman/i,"Arjun has described a three-person context: Aviral on business strategy, Arjun on AI and website/CLI work, and Pradhuman on deep technical work, MCPs, and CTFs. Personal portfolio projects should not be attributed to collaborators unless Arjun explicitly says so."],
  [/github|student pack/i,"Arjun has access to the GitHub Student Developer Pack through April 2028 and uses GitHub as part of his normal Linux/VS Code workflow."]
];
function chatAnswer(question){const match=knowledge.find(([pattern])=>pattern.test(question));return match?match[1]:"I don’t have a reliable entry for that yet. Ask about Cricklytics, Viralyst, GPT-2, Rakshak, AEGIS, UWAKE, hardware projects, achievements, skills, or Arjun’s building philosophy."}
function addMessage(text,role){const article=document.createElement('article');article.className=`${role} enter`;if(role==='bot'){const avatar=document.createElement('span');avatar.textContent='AC';article.append(avatar)}const p=document.createElement('p');p.textContent=text;article.append(p);chatLog.insertBefore(article,chatLog.querySelector('.chat-prompts'));chatLog.scrollTo({top:chatLog.scrollHeight,behavior:'smooth'})}
const geminiHistory=[];
async function submitChat(value){
  const question=value.trim();if(!question)return;addMessage(question,'user');chatInput.value='';geminiHistory.push({role:'user',content:question});
  const typing=document.createElement('article');typing.className='bot enter typing';typing.innerHTML='<span>AC</span><p><i></i><i></i><i></i></p>';chatLog.insertBefore(typing,chatLog.querySelector('.chat-prompts'));chatLog.scrollTo({top:chatLog.scrollHeight,behavior:'smooth'});
  let answer;
  try{const result=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:geminiHistory.slice(-10)})});if(!result.ok)throw new Error('Gemini unavailable');const data=await result.json();answer=data.text}catch{answer=chatAnswer(question)}
  typing.remove();geminiHistory.push({role:'assistant',content:answer});addMessage(answer,'bot');
}
document.querySelector('.chat-launch')?.addEventListener('click',()=>{chat.dataset.open='true';lenis?.stop();setTimeout(()=>chatInput.focus(),300)});document.querySelector('.chat-close')?.addEventListener('click',()=>{chat.dataset.open='false';lenis?.start()});chatForm?.addEventListener('submit',event=>{event.preventDefault();submitChat(chatInput.value)});document.querySelectorAll('.chat-prompts button').forEach(button=>button.addEventListener('click',()=>submitChat(button.textContent)));
