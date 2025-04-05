document.addEventListener('DOMContentLoaded', () => {
  function frame() {
    clear();
    requestAnimationFrame(frame);
  }
  frame();
});

function clear() {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 7; c++) {
      const id = `${c}${r}`;
      if (['60', '61', '07', '17', '27', '37'].includes(id)) continue;
      const color = (r + c) % 2 === 0 ? 'pink' : 'cyan';
      setColor(id, color);
    }
  }
}

function setColor(id, color) {
  const element = document.getElementById(id);
  if (element) {
    element.style.backgroundColor = color;
  }
}
