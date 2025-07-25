function moveEyes(mouseX, mouseY) {
  const eyes = document.querySelectorAll(".eye");

  for (let i = 0; i < eyes.length; i++) {
    const offsetT = eyes[i].offsetTop;
    const offsetL = eyes[i].offsetLeft;
    const centerX = offsetL + (eyes[i].clientWidth / 2);
    const centerY = offsetT + (eyes[i].clientHeight / 2);
    const radius = Math.atan2(mouseX - centerX, mouseY - centerY);
    const degree = (radius * (180 / Math.PI) * -1);
    eyes[i].style.transform = `rotate(${degree}deg)`;
  }
}

function mousePosition(e) {
  const mouseX = e.pageX;
  const mouseY = e.pageY;

  const eye = document.querySelector(".eye.eye-right");
  moveEyes(mouseX, mouseY);
}
