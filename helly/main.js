import Program from './program.js';

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const program = new Program(body);
  program.run();
});
