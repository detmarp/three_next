/* This class neatly packages up XHR POST requests */

export default class XhrPost {
  constructor(url) {
    this.url = url;
  }

  open(callback) {
    if (!this.url) {
      callback({ 'response': { xhrpost: 'no url' } });
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", this.url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.signal = signal;

    xhr.onreadystatechange = function () {
      console.log(xhr.readyState);
      console.log(xhr.status);
      console.log(xhr.responseText);
      if (xhr.readyState === 4) {
        try {
          let ob = JSON.parse(xhr.responseText);
          console.log(ob.choices[0].message.content);
        }
        catch {
          console.log(null);
        }
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log('eee 200');
        console.log(xhr.responseText);
        let object = JSON.parse(xhr.responseText);
        let json = JSON.stringify(object);
        callback({
          'content': object.choices[0].message.content,
          'response': {
            xhrpost: 'success',
            status: xhr.status,
            json: json,
            url: this.url,
          }
        });
      }
      else if (xhr.status === 201) {
        console.log('eee 201');
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

    this.xhr = xhr;
    return this.xhr;
  }

  send() {
    let model = 'gpt-3.5-turbo-0125';
    var data = `{
      "model": "${model}",
      "messages": [{"name": "bot", "role": "assistant", "content": "hey"}],
      "temperature": 0.9,
      "max_tokens": 256,
      "top_p": 1,
      "frequency_penalty": 0.75,
      "presence_penalty": 0
    }`;

    this.xhr.send(data);
  }

  quickSend(callback) {
    this.open(callback);
    this.send();
  }

  abort() {
  }
}
