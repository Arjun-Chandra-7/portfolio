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
          <a href="#services">SERVICES</a><i />
          <a href="#testimonial">CLIENTS</a><i />
          <a href="#faq">FAQ</a>
        </nav>
        <img className="portrait-person" src="/arjun-hero.png" alt="Arjun Chandra" fetchPriority="high" />
        <div className="portrait-stat portrait-stat-projects">
          <svg className="portrait-stat-icon" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4L10 20L16 8L22 20L28 4" stroke="#ffff18" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div><strong>10+</strong><span>Projects</span></div>
        </div>
        <div className="portrait-stat portrait-stat-years"><strong>4+</strong><span>Years of<br />experience</span></div>
        <div className="portrait-traits">
          <span>◒ <b>Creative</b></span>
          <span>✣ <b>Reliable</b></span>
          <span>♜ <b>Strategist</b></span>
          <span>◆ <b>Builder</b></span>
          <span>✖ <b>Efficient</b></span>
        </div>
        <div className="portrait-statement">AI, Software,<br />Applied Differently.</div>
        <div className="portrait-actions"><a href="#contact">Book a Call</a><a href="#about">About Me</a></div>
        <p className="portrait-sidecopy portrait-sidecopy-left">The AI &amp; Software Builder.<br />That&apos;s Arjun.</p>
        <p className="portrait-sidecopy portrait-sidecopy-right">Working closely with your team to deliver AI &amp; software builds that merge creativity, technical excellence, and long-term value.</p>
      </section>
      <PortfolioSections />
      <PortfolioRuntime />
    </>
  );
}
