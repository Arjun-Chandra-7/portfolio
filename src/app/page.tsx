import PortfolioRuntime from '@/components/PortfolioRuntime';
import PortfolioSections from '@/components/PortfolioSections';

export default function Home() {
  return (
    <>
      <section className="portrait-hero" id="hero" aria-label="Introduction">
        <div className="portrait-mobilebar"><strong>ARJUN</strong><a href="mailto:arjun.chandra.engineer@gmail.com">Get in Touch</a><span aria-hidden="true">✣</span></div>
        <div className="portrait-wordmark" aria-hidden="true">ARJUN</div>
        <nav className="portrait-nav portrait-nav-left" aria-label="Primary">
          <a href="#hero">HOME</a><i />
          <a href="#about">ABOUT ME</a><i />
          <a href="#projects">PROJECTS</a>
        </nav>
        <nav className="portrait-nav portrait-nav-right" aria-label="Explore">
          <a href="#capabilities">WHAT I BUILD</a><i />
          <a href="#services">SKILLS</a><i />
          <a href="#timeline">JOURNEY</a><i />
          <a href="#faq">FAQ</a>
        </nav>
        <img className="portrait-person" src="/arjun-hero.png" alt="Arjun Chandra" fetchPriority="high" />
        <div className="portrait-stat portrait-stat-projects"><strong>10+</strong><span>Projects</span></div>
        <div className="portrait-stat portrait-stat-years"><strong>4+</strong><span>Years of<br />building</span></div>
        <div className="portrait-traits"><span>◒ <b>Curious</b></span><span>✣ <b>Reliable</b></span><span>♜ <b>Builder</b></span><span>◆ <b>Inventive</b></span><span>✖ <b>Persistent</b></span></div>
        <div className="portrait-statement">AI, Software,<br />Built Differently.</div>
        <div className="portrait-actions"><a href="#projects">View Work</a><a href="#about">About Me</a></div>
        <p className="portrait-sidecopy portrait-sidecopy-left">AI, software &amp;<br />computer vision.</p>
        <p className="portrait-sidecopy portrait-sidecopy-right">I turn ambitious ideas into working systems.<br />Building to understand what happens underneath.</p>
      </section>
      <PortfolioSections />
      <PortfolioRuntime />
    </>
  );
}
