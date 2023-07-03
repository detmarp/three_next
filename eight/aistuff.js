export class AiStuff {
  constructor(key) {
    this.apiKey = key;
  }

  cancel() {
    this.canceled = true;
  }

  async fake(callback) {
    await new Promise(r => setTimeout(r, 1000));
    if (!this.canceled) {
      callback('asdfasdf');
    }
  }

  async testText(callback) {
    let response = await this.completions('What does an angry cat say?');
    if (!this.canceled) {
      callback(response);
    }
  }

  async testImage(callback) {
    let response = await this.generations('Angry cat');
    if (!this.canceled) {
          console.log(response);
          callback(response);
    }
  }

  async completions(prompt) {
    return await new Promise(resolve => {
      try {
        var url = "https://api.openai.com/v1/engines/text-davinci-002/completions";
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${this.apiKey}`);
        xhr.onreadystatechange = function () {
          console.log(xhr.readyState);
          console.log(xhr.status);
          console.log(xhr.responseText);
          if (xhr.readyState === 4) {
            try {
              let ob = JSON.parse(xhr.responseText);
              resolve(ob.choices[0].text);
            }
            catch {
              resolve(null);
            }
          }
        };
        xhr.onerror = () => {
          resolve(null);
        };
        var data = `{
          "prompt": "${prompt}",
          "temperature": 0.9,
          "max_tokens": 256,
          "top_p": 1,
          "frequency_penalty": 0.75,
          "presence_penalty": 0
        }`;
        xhr.send(data);
      }
      catch {
        resolve(null);
      }
    });
  }

  async generations(prompt) {
    return await new Promise(resolve => {
      try {
        var url = "https://api.openai.com/v1/images/generations";
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", `Bearer ${this.apiKey}`);
        xhr.onreadystatechange = function () {
          console.log(xhr.readyState);
          console.log(xhr.status);
          console.log(xhr.responseText);
          if (xhr.readyState === 4) {
            try {
              let ob = JSON.parse(xhr.responseText);
              resolve(ob.data[0].url);
            }
            catch {
              resolve(null);
            }
          }
        };
        xhr.onerror = () => {
          resolve(null);
        };
        var data = `{
          "prompt": "${prompt}",
          "n": 1,
          "size": "256x256",
          "response_format": "url"
        }`;
        xhr.send(data);
      }
      catch {
        resolve(null);
      }
    });
  }
}
