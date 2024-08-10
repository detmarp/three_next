export default class AiTest {
  constructor() {
    this.controller = new AbortController();
  }

  foo(callback) {
    this.callback = callback;
    this.boo();
  }

  async boo() {
    let x = await this.waitForTwoSeconds();
    this.callback(x);
  }

  async ping(url) {
    const { signal } = this.controller;

    try {
      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.text();
    } catch (error) {
      if (error.name === 'AbortError') {
        return 'abort';
      } else {
        throw error;
      }
    }
  }

  abort() {
    this.controller.abort();
  }

  async waitForTwoSeconds() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { message: 'Two seconds have passed' };
  }
}
