const master = new TimelineMax({ paused: true });

master.add(ruedas(), "loop");
master.add(sunset(), "loop");
master.add(lengua(), "loop");
master.add(sun(), "sun");


master.play();

function sunset() {
  const tl = new TimelineMax({ repeat: -1, yoyo: true });
  const vw = (width) => window.innerWidth * (width / 100);
  const move = -vw(500) + vw(180);

  tl.to(".sunset", 5, {
    x: move,
    ease: Linear.easeNone,
  });
  return tl;
}

function ruedas() {
  const tl = new TimelineMax({ repeat: -1 });
  const time = 4;

  tl.to(
    ".rueda-del",
    time,
    {
      transformOrigin: "center",
      rotate: 360,
      ease: Linear.easeNone,
    },
    "ruedas"
  );
  tl.to(
    ".rueda-tras",
    time,
    {
      transformOrigin: "center",
      rotate: 360,
      ease: Linear.easeNone,
    },
    "ruedas"
  );
    return tl;
}

function lengua() {
  const tl = new TimelineMax({ repeat: -1, yoyo: true });

  tl.to(".taika-lengua", .15, {
    transformOrigin: "right",
    scaleY: .85,
    skewY: 10,
    ease: Linear.easeNone,
  }, "lengua");
    return tl;
}

function sun() {
  const tl = new TimelineMax({ repeat: -1, yoyo: true, repeatDelay: 2 });

  tl.to(".sun", 5, {
    y: 180,
    ease: Sine.easeIn,
  });
  tl.add(luz(), "-=2.5")
    return tl;
}

function luz() {
  const tl = new TimelineMax({ pause: true});

  tl.from(".luz", 0.5, {
    scaleY: 0,
    transformOrigin: "10% 35%",
    ease: Linear.easeNone,
  });
    return tl;
}
