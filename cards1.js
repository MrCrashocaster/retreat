gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".cards",
    pin: true,
    pinSpacing: true,
    markers: false,
    start: "top-=150px top", // when the top of the trigger hits the top of the viewport
    end: "+=2000", // end after scrolling 1000px beyond the start
    scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
  }
});

// Animation for card 1
tl.addLabel("card1");
tl.to('.card1',{
  yPercent:0,
  opacity: 1
}) 

// Animation for card 2
tl.from('.card2', {
  yPercent:75,
  opacity: 0,
}) 
tl.addLabel("card2");
tl.add(() => setActiveNav(tl.scrollTrigger.direction > 0 ? 1 : 0), "-=0.15"); 
tl.to('.card1',{
  scale:0.925,
  yPercent:-0.75,
  opacity: 1
}, "-=0.3") 
tl.to('.card2', {
  yPercent:0,
  opacity: 1
}) 

// Animation for card 3
tl.from('.card3', {
  yPercent:75,
  opacity: 0,
}) 
tl.addLabel("card3");
tl.add(() => setActiveNav(tl.scrollTrigger.direction > 0 ? 2 : 1), "-=0.15");
tl.to('.card2',{
  scale:0.95,
  yPercent:-0.5,
  opacity: 1
}, "-=0.3") 
tl.to('.card3', {
  yPercent:0,
  opacity: 1
}) 

// Animation for card 4
tl.from('.card4', {
  yPercent:75,
  opacity: 0,
}) 
tl.addLabel("card4");
tl.add(() => setActiveNav(tl.scrollTrigger.direction > 0 ? 3 : 2), "-=0.15");
tl.to('.card3',{
  scale:0.98,
  yPercent:-0.4,
  opacity: 1
}, "-=0.3") 
tl.to('.card4', {
  yPercent:0,
  opacity: 1
}) 

// Additional animations for scaling down previous cards
tl.to('.card1',{
  scale:0.925,
  yPercent:-1.5,
  opacity: 0.9
}, "-=0.3") 

tl.to('.card2',{
  scale:0.95,
  yPercent:-1.125,
  opacity: 0.9
}, "-=0.3") 

tl.to('.card3',{
  scale:0.98,
  yPercent:-0.85,
  opacity: 0.9
}, "-=0.3") 

// Without the .nav .circle elements, we don't need to handle setActiveNav function
/* gsap.utils.toArray(".nav .circle").forEach((circle, i) => {
  circle.classList[i === index ? "add" : "remove"]("active");
}); */

function labelToScroll(timeline, label) {
  let st = timeline.scrollTrigger,
      progress = timeline.labels[label] / timeline.duration();
  return st.start + (st.end - st.start) * progress;
}
