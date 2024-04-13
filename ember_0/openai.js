export default class Openai {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async completions(prompt) {
    let model = 'gpt-3.5-turbo-0125';
    let endpoint = `v1/chat/completions`;
    return await new Promise(resolve => {
      try {
        var url = `https://api.openai.com/${endpoint}`;
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
              resolve(ob.choices[0].message.content);
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
          "model": "${model}",
          "messages": [{"name": "bot", "role": "assistant", "content": "hey"}],
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
}
