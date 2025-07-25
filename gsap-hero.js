gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".wrapper",
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: true,
        markers: true,
      },
    })
    .to(".image-container img", {
      scale: 2,
      z: 250,
      transformOrigin: "center center",
    })
    .to(
      ".section.hero-section",
      {
        scale: 1.4,
        boxShadow: `10000px 0 0 0 rgba(0,0,0,0.5) inset`,
        transformOrigin: "center center",
      },
      "<"
    )
    .to(".image-container", {
      autoAlpha: 0,
    })
    .to([".section.hero-section", ".intro"], {
      height: 400,
    });
});
