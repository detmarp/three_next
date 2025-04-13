document.addEventListener('DOMContentLoaded', () => {
  loadingScreen();

  requestAnimationFrame(() => {
    run();
  });
});

function loadingScreen() {
  let top = document.body;
  top.innerHTML = '';

  const message = document.createElement('div');
  top.appendChild(message);

  message.style.position = 'absolute';
  message.style.top = '50%';
  message.style.left = '50%';
  message.style.transform = 'translate(-50%, -50%)';
  message.style.color = '#222222';
  message.style.fontFamily = 'sans-serif';
  message.style.backgroundColor = '#eeeeee';
  message.style.width = '100%';
  message.style.height = '100%';
  message.style.display = 'flex';
  message.style.justifyContent = 'center';
  message.style.alignItems = 'center';
  message.innerText = 'Loading...';
}


async function run() {
  const { default: Program } = await import('./program.js');
  const body = document.body;
  const program = new Program(body);
  program.load();
}