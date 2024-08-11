export default class AiTest {
  constructor() {
    this.controller = new AbortController();
  }

  foo(callback) {
    let url = 'https://pokeapi.co/api/v2/pokemon/ditto';
    let endpoint = `v1/chat/completions`;
    url = `https://api.openai.com/${endpoint}`;
    url = 'https://reqres.in/api/users?page=2';

    const controller = new AbortController();
    const signal = controller.signal;

    const xhr = new XMLHttpRequest();
    //xhr.open('GET', url);
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.signal = signal;


    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
      }
      else if (xhr.status === 201) {
        console.log(xhr.responseText);
      }
      else {
        console.error('Request failed.  Returned status of ' + xhr.status);
      }
    };

    xhr.onerror = () => {
      console.error('Network error');
    };

    xhr.send();

    return { abort: () => controller.abort() };
  }


  poke(callback) {
    this.callback = callback;
    this.ping('https://pokeapi.co/xxapi/v2/pokemon/ditto');
  }

  async boo() {
    let x = await this.waitForTwoSeconds();
    this.callback(x);
  }

  async ping(url) {
    const { signal } = this.controller;

    try {
      this.callback({ content: 'aaa', json: 'bbb' });
      const response = await fetch(url, { signal });
      if (!response.ok) {
        this.callback({ content: 'ccc', json: 'bbb' });
        throw new Error('Network response was not ok');
      }
      this.callback({ content: 'ggg', json: 'bbb' });
      let test = await response.text();
      this.callback({ content: text, json: JSONstringify('hhh') });
    } catch (error) {
      this.callback({ content: 'ddd', json: 'bbb' });
      if (error.name === 'AbortError') {
        return 'abort';
      } else {
        this.callback({ content: 'eee', json: 'bbb' });
        throw error;
      }
    }
    this.callback({ content: 'fff', json: 'bbb' });
  }

  abort() {
    this.controller.abort();
  }

  async waitForTwoSeconds() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { message: 'Two seconds have passed' };
  }
}
