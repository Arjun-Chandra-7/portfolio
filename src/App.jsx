import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'

gsap.registerPlugin(ScrollTrigger)

const projects=[
  {id:'01',name:'BYTE LABS',tag:'WEB / SOFTWARE / PRODUCT',line:'Building software, one experiment at a time.',copy:'A software ecosystem for practical applications, experiments, and Byte Eats.',image:'/assets/byte-labs-project.png',href:'https://byte-eats-delta.vercel.app',tone:'lime'},
  {id:'02',name:'CRICKLYTICS',tag:'COMPUTER VISION / AI / SPORT',line:'Your game, decoded.',copy:'Smartphone video becomes biomechanics, analysis, and useful coaching feedback.',image:'/assets/cricklytics-project.png',href:'https://genia-diversifiable-millie.ngrok-free.dev',tone:'green'},
  {id:'03',name:'VIRALYST',tag:'AI / CONTENT INTELLIGENCE',line:'Understanding why content goes viral.',copy:'An in-progress system for studying hooks, pacing, structure, and audience signals.',tone:'red'},
  {id:'04',name:'PEN FIGHT',tag:'GAME / WEB / INTERACTION',line:'The unofficial sport of the last bench.',copy:'A gloriously unnecessary browser game built around weaponised stationery.',image:'/assets/pen-fight-project.png',href:'https://pen-fight-lemon.vercel.app/',tone:'blue'},
  {id:'05',name:'GPT-2 / FROM SCRATCH',tag:'PYTORCH / TRANSFORMERS / NLP',line:'Understanding AI from the inside.',copy:'Rebuilding tokenization, attention, training, and inference beneath the abstraction.',tone:'violet'}
]
const journey=[['23','Getting Into Technology','Programming, Arduino, electronics, sensors and small software projects.'],['24','AI, Robotics & Competitions','Python, computer vision, automation, robotics and innovation programs.'],['25','Building Bigger','Ambitious projects combining AI, hardware, vision and automation.'],['26','Software & AI','Complete products including Cricklytics, Byte Labs, Viralyst and Pen Fight.'],['NOW',"Understanding What's Underneath",'Reproducing GPT-2 from scratch to understand architecture and training.']]
const capabilities=['Artificial Intelligence','Computer Vision','Software Development','Interactive Web','Product Building']

function useMotion(root){
  useLayoutEffect(()=>{
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches
    if(reduce)return
    const lenis=new Lenis({duration:1.15,smoothWheel:true,wheelMultiplier:.82,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t))})
    const tick=time=>lenis.raf(time*1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    lenis.on('scroll',ScrollTrigger.update)
    const ctx=gsap.context(()=>{
      const q=gsap.utils.selector(root)
      const intro=gsap.timeline({defaults:{ease:'expo.out'}})
      intro.fromTo(q('.intro-letter'),{yPercent:120,rotate:8,opacity:0},{yPercent:0,rotate:0,opacity:1,stagger:.08,duration:1.05})
        .to(q('.loader'),{clipPath:'inset(0 0 100% 0)',duration:1.15,ease:'power4.inOut'},1.25)
        .from(q('.hero-ui'),{y:50,opacity:0,stagger:.08,duration:.8},1.5)
      gsap.to(q('.hero-title'),{scale:1.55,y:-innerHeight*.18,letterSpacing:'-.12em',ease:'none',scrollTrigger:{trigger:q('.hero'),start:'top top',end:'bottom top',scrub:1.25}})
      gsap.to(q('.portrait'),{y:-100,scale:.72,opacity:.18,filter:'blur(18px)',ease:'none',scrollTrigger:{trigger:q('.hero'),start:'top top',end:'bottom top',scrub:1}})
      gsap.utils.toArray(q('[data-reveal]')).forEach((el,i)=>gsap.from(el,{y:100,rotationX:18,opacity:0,filter:'blur(8px)',duration:1.1,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 86%',once:true},delay:(i%3)*.07}))
      const track=q('.project-track')[0]
      const cards=gsap.utils.toArray(q('.project-card'))
      const reel=gsap.to(track,{x:()=>-(track.scrollWidth-innerWidth*.72),ease:'none',scrollTrigger:{trigger:q('.project-reel')[0],start:'top top',end:()=>`+=${track.scrollWidth*1.05}`,pin:true,scrub:1.1,invalidateOnRefresh:true}})
      cards.forEach((card,i)=>{gsap.fromTo(card,{y:i%2?120:-110,rotationZ:i%2?5:-5,rotationY:i%2?18:-18},{y:i%2?-60:50,rotationZ:0,rotationY:0,ease:'none',scrollTrigger:{trigger:card,containerAnimation:reel,start:'left 93%',end:'right 8%',scrub:1}})})
      const path=q('.journey-path')[0]
      if(path){const len=path.getTotalLength();gsap.set(path,{strokeDasharray:len,strokeDashoffset:len});gsap.to(path,{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:q('.journey')[0],start:'top 65%',end:'bottom 42%',scrub:1}})}
      gsap.utils.toArray(q('.journey-card')).forEach((card,i)=>gsap.from(card,{x:i%2?140:-140,y:80,rotation:i%2?8:-8,opacity:0,duration:1,ease:'power4.out',scrollTrigger:{trigger:card,start:'top 88%',once:true}}))
      gsap.to(q('.cap-orb'),{rotation:360,scale:1.35,ease:'none',scrollTrigger:{trigger:q('.capabilities')[0],start:'top bottom',end:'bottom top',scrub:1.2}})
      gsap.from(q('.capability'),{scale:.3,rotation:20,opacity:0,stagger:.09,duration:.8,ease:'back.out(1.7)',scrollTrigger:{trigger:q('.cap-grid')[0],start:'top 80%',once:true}})
      gsap.to(q('.closing h2'),{scale:1.25,letterSpacing:'-.12em',ease:'none',scrollTrigger:{trigger:q('.closing')[0],start:'top bottom',end:'bottom top',scrub:1}})
      ScrollTrigger.refresh()
    },root)
    return()=>{ctx.revert();lenis.destroy();gsap.ticker.remove(tick)}
  },[root])
}

function Cursor(){
  const ref=useRef(null)
  useEffect(()=>{if(!matchMedia('(pointer:fine)').matches)return;let x=0,y=0,tx=0,ty=0,raf;const move=e=>{tx=e.clientX;ty=e.clientY};const loop=()=>{x+=(tx-x)*.17;y+=(ty-y)*.17;ref.current?.style.setProperty('--x',`${x}px`);ref.current?.style.setProperty('--y',`${y}px`);raf=requestAnimationFrame(loop)};addEventListener('pointermove',move);loop();return()=>{removeEventListener('pointermove',move);cancelAnimationFrame(raf)}},[])
  return <div className="cursor" ref={ref}><i/><b>EXPLORE</b></div>
}

function App(){
  const root=useRef(null); const [chat,setChat]=useState(false); const [active,setActive]=useState(0)
  useMotion(root)
  useEffect(()=>{const words=['ARJUN.exe','AI / VISION / CODE','BUILD · BREAK · REBUILD','THINGS THAT SHOULD NOT EXIST','↗ ENTER THE LAB'];let n=0;const id=setInterval(()=>{document.title=words[n++%words.length]},1450);return()=>clearInterval(id)},[])
  return <div ref={root} className="site">
    <Cursor/><div className="grain"/><div className="loader"><div className="loader-logo">{'ARJUN'.split('').map((x,i)=><span className="intro-letter" key={i}>{x}</span>)}</div><p>INITIALISING / SYSTEM 2026</p></div>
    <nav className="topnav hero-ui"><a className="brand" href="#home">ARJUN<span>®</span></a><div><a href="#work">WORK</a><a href="#about">ABOUT</a><a href="#contact">CONTACT</a></div></nav>
    <section className="hero" id="home"><div className="hero-grid"/><p className="hero-kicker hero-ui">STUDENT BUILDER / INDIA / 2026</p><h1 className="hero-title">ARJUN</h1><img className="portrait" src="/assets/arjun.png" alt="Arjun Chandra"/><div className="hero-copy hero-ui"><span>AI · SOFTWARE · COMPUTER VISION</span><h2>I build things<br/>that <em>shouldn&apos;t</em><br/>exist yet.</h2><a className="circle-link" href="#work">SEE WORK <b>↘</b></a></div><div className="hero-meter hero-ui"><i/>SCROLL TO DECODE</div></section>
    <aside className="side-index"><span>01 — 06</span><i/><span>SCROLL / EXPLORE</span></aside>
    <main>
      <section className="about" id="about"><p className="eyebrow">01 / ORIGIN STORY</p><div className="split-heading" data-reveal><h2>BUILDER<br/><em>FIRST.</em></h2><p>I learn by building ambitious systems, breaking them, then understanding why they worked at all.</p></div><div className="about-marquee" data-reveal><span>AI / SOFTWARE / VISION / EXPERIMENTS /</span></div><div className="about-columns" data-reveal><p>I&apos;m Arjun: a student developer focused on turning difficult ideas into working products rather than polished theory.</p><p>My work moves between computer vision, AI systems, web applications, automation, hardware and deeply curious experiments.</p><p className="accent">BUILD IT.<br/>BREAK IT.<br/>IMPROVE IT.</p></div></section>
      <section className="journey" id="journey"><div className="journey-head" data-reveal><p className="eyebrow">02 / THE JOURNEY</p><h2>FROM SIGNAL<br/>TO <em>SYSTEM.</em></h2></div><svg className="journey-svg" viewBox="0 0 1200 1300" preserveAspectRatio="none"><path className="journey-ghost" d="M1050 0C820 180 120 170 240 420s830-10 650 290S80 770 260 1030s730 70 600 270"/><path className="journey-path" d="M1050 0C820 180 120 170 240 420s830-10 650 290S80 770 260 1030s730 70 600 270"/></svg><div className="journey-cards">{journey.map(([year,title,copy],i)=><article className={`journey-card j${i}`} key={year}><b>{year}</b><div><small>PHASE / 0{i+1}</small><h3>{title}</h3><p>{copy}</p></div></article>)}</div></section>
      <section className="project-reel" id="work"><header><p className="eyebrow">03 / SELECTED WORK</p><h2>REAL<br/><em>SYSTEMS.</em></h2><p>Scroll sideways through the things that survived the build process.</p></header><div className="project-track">{projects.map((p,i)=><article className={`project-card ${p.tone}`} key={p.id} onMouseEnter={()=>setActive(i)}><div className="project-top"><b>{p.id}</b><span>{p.tag}</span></div>{p.image?<img src={p.image} alt=""/>:<div className="generative-art"><i/><i/><i/><strong>01<br/>01</strong></div>}<div className="project-content"><h3>{p.name}</h3><h4>{p.line}</h4><p>{p.copy}</p>{p.href?<a href={p.href} target="_blank" rel="noreferrer">OPEN PROJECT ↗</a>:<span>IN DEVELOPMENT</span>}</div><div className="card-number">0{i+1}</div></article>)}</div><div className="reel-status"><span>ACTIVE / {String(active+1).padStart(2,'0')}</span><i/><span>DRAG OR SCROLL</span></div></section>
      <section className="capabilities" id="capabilities"><div className="cap-orb"><i/><i/><i/></div><p className="eyebrow">04 / CAPABILITIES</p><h2 data-reveal>THE TOOL IS<br/>ONLY AS GOOD AS<br/>THE <em>OBSESSION.</em></h2><div className="cap-grid">{capabilities.map((x,i)=><article className="capability" key={x}><b>0{i+1}</b><h3>{x}</h3><p>{['Machine learning, transformers, automation and generative systems.','Pose estimation, biomechanics, video analysis and real-world vision.','Python, APIs, architecture, web apps and product systems.','Interfaces, browser games, animation and digital experiences.','Raw idea to prototype, iteration and useful product.'][i]}</p><span>↗</span></article>)}</div></section>
      <section className="stack"><p className="eyebrow">05 / TECH STACK</p><div className="stack-spiral" data-reveal><span>PYTHON</span><span>PYTORCH</span><span>MEDIAPIPE</span><span>JAVASCRIPT</span><span>LINUX</span><span>OPEN CV</span></div></section>
      <section className="closing" id="contact"><p className="eyebrow">06 / CONTACT</p><h2>LET&apos;S BUILD<br/><em>THE IMPOSSIBLE.</em></h2><p>Ambitious technical problem? AI experiment? Weird product idea? Good.</p><div><a className="contact-link" href="mailto:aarjunchandra@gmail.com">EMAIL ME <b>↗</b></a><a className="contact-link ghost" href="https://www.instagram.com/arjun_chandra7/" target="_blank" rel="noreferrer">INSTAGRAM <b>↗</b></a></div></section>
    </main>
    <footer><b>ARJUN CHANDRA</b><span>© 2026 / BUILT TO UNDERSTAND</span><a href="#home">BACK TO TOP ↑</a></footer>
    <button className="chat-trigger" onClick={()=>setChat(true)}>ASK<br/>ARJUN</button>{chat&&<div className="chat"><button onClick={()=>setChat(false)}>×</button><small>ARJUN.AI / LOCAL GUIDE</small><h3>What do you want to know?</h3><p>Ask about Cricklytics, GPT-2, AEGIS, AI projects, or what Arjun is currently building.</p><a href="mailto:aarjunchandra@gmail.com">SEND A MESSAGE ↗</a></div>}
  </div>
}

export default App
