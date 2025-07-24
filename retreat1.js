gsap.registerPlugin(ScrollTrigger);

let sections = gsap.utils.toArray("#hero-anim-track");
let tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#hero-anim-track',
    pin: true,
    start: '50% 50%',
    end: '+=200px',
    scrub: 1,
    snap: {
      snapTo: 'labels',
      duration: { min: 0.1, max: 0.5 },
      delay: 0,
      ease: 'linear'
    }
  }
});

tl.to('#hero-anim-track', {
  scale: 0.9,
  borderBottomRightRadius: "2em",
  borderBottomLeftRadius: "2em",
  borderTopRightRadius: "2em",
  borderTopLeftRadius: "2em",
  duration: 1.5
}, 0).to('#hero-anim-track svg', {
  rotate: 180,
  duration: .2
}, 0).to('#hero-anim-track', {
  boxShadow: '0 0px 0px rgba(0,0,0,0.30), 0 0px 0px rgba(0,0,0,0.22)',
  duration: 2,
  ease: 'linear'
}, 0);
