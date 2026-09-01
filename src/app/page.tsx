import rawData from '@/data/rawNesh.json';

export default function Home() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: rawData.html }} />
      {/* Exact script bundle in synchronous execution order */}
      <script src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=691d7c9f14d0280ebe2d4108" type="text/javascript" />
      <script src="https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/js/webflow.schunk.f383f5e6d5965c7d.js" type="text/javascript" />
      <script src="https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/js/webflow.a9cc831c.9e692597beb1f023.js" type="text/javascript" />
      <script src="https://cdn.prod.website-files.com/gsap/3.15.0/gsap.min.js" type="text/javascript" />
      <script src="https://cdn.prod.website-files.com/gsap/3.15.0/ScrollTrigger.min.js" type="text/javascript" />
      <script src="https://cdn.prod.website-files.com/gsap/3.15.0/Flip.min.js" type="text/javascript" />
      <script src="https://cdn.prod.website-files.com/gsap/3.15.0/SplitText.min.js" type="text/javascript" />
      <script src="https://cdn.prod.website-files.com/gsap/3.15.0/ScrollToPlugin.min.js" type="text/javascript" />
      <script src="https://cdn.prod.website-files.com/gsap/3.15.0/ScrollSmoother.min.js" type="text/javascript" />
      <script src="https://cdn.prod.website-files.com/gsap/3.15.0/MotionPathPlugin.min.js" type="text/javascript" />
      <script src="https://cdn.prod.website-files.com/gsap/3.15.0/DrawSVGPlugin.min.js" type="text/javascript" />
      <script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js" />
      <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" />
      <script src="/script.js" />
      <script dangerouslySetInnerHTML={{ __html: `
        document.querySelectorAll('a[href^="#"]').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });
      `}} />
      <script dangerouslySetInnerHTML={{ __html: `
        (function () {
          var FG_BASE = 'https://f1-assets.b-cdn.net/nesh-work/Portfolio%20Work/';
          var ua = navigator.userAgent;
          var isSafari = /^((?!chrome|chromium|crios|fxios|edg|opr|android).)*safari/i.test(ua)
                         || /iP(ad|hone|od)/.test(ua)
                         || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

          document.querySelectorAll('.work-image-item').forEach(function (container) {
            var slug = container.getAttribute('data-fg-video');
            if (!slug) return;

            var bgImg = container.querySelector('.work-image');
            var posterUrl = bgImg ? (bgImg.getAttribute('src') || '') : '';

            var video = document.createElement('video');
            video.className = 'work-fg-video';
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', '');
            if (posterUrl) video.poster = posterUrl;

            var ext = isSafari ? '.mov' : '.webm';
            var type = isSafari ? 'video/quicktime' : 'video/webm';
            var src = FG_BASE + encodeURIComponent(slug) + ext;

            var source = document.createElement('source');
            source.src = src;
            source.type = type;
            video.appendChild(source);

            container.appendChild(video);
          });
        })();
      `}} />
    </>
  );
}
