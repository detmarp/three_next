/* This class neatly packages up XHR POST requests */

export default class XhrPost {
  constructor(url) {
    this.url = url;
  }

  send(callback) {
    if (!this.url) {
      callback({ 'response': { xhrpost: 'no url' } });
      return;
    }

    //let url = 'https://pokeapi.co/api/v2/pokemon/ditto';
    //let endpoint = `v1/chat/completions`;
    //url = `https://api.openai.com/${endpoint}`;
    //url = 'https://reqres.in/api/users?page=2';

    const controller = new AbortController();
    const signal = controller.signal;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", this.url);
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
        callback({ 'response': {
          xhrpost: 'Request failed',
          status: xhr.status,
          url: this.url,
        } });
      }
    };

    let self = this;
    xhr.onerror = function() {
      callback({ 'response': {
        xhrpost: 'send error',
        status: this.status,
        statusText: this.statusText,
        url: self.url,
      } });
    };

    xhr.send();

    return { abort: () => controller.abort() };

  }

  abort() {
  }
}
