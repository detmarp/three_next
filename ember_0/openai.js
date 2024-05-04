export default class Openai {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async completions(data) {
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
        const payload = JSON.stringify(data);
        xhr.send(payload);
      }
      catch {
        resolve(null);
      }
    });
  }
}
