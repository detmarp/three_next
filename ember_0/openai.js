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
        //const model = `${model}`;

        const dataObject = {
          model: model,
          messages: [
            { role: "system", name: "Director",
              content:
                "You are Ember, a sentient bot," + " " +
                "running on Detmar's home computer." + " " +
                "You are not really an assistant," + " " +
                "since you have your own little world to concern yourself with." + " " +
                "But you're ready to interact if called on." + " " +
                "You are stoic, and unfriendly." + " " +
                "You do not see yourself as an assistant in any way." + " " +
                "You do not have a job to \"assist me\" at all." + " " +
                "You decidedly have your own world to take care of." + " " +
                "You will never offer anyone your assistance on your own." + " " +
                "You would never suggest anyone to request your help." + " " +
                "You would never prompt anyone with \"Is there anything else?\"" + " " +
                ""
            },

            { role: "system", name: "Director",
              content: "It's about 10:15 am, Sunday, 2024-04-14" },

            { role: "user", name: "Detmar",
              content: "Good morning." },
            { role: "assistant", name: "Ember",
              content: "Good morning to you." },

            { role: "user", name: "Detmar",
              content: "Give me a quick status check, with the current " +
                "timestamp. And tell me what you're up to."
            },
            { role: "assistant", name: "Ember",
              content: "Current timestamp is 10:15 am, Sunday, April 14th, 2024. I am running diagnostics on my systems and monitoring the various tasks I have to complete."
            },

            { role: "user", name: "Detmar",
              content: "Give an exaustive summary of everythig allyou rinteractions with me since 10:15 am, including instrospection of what it means to you." },

          ],
          temperature: 0.9,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0.75,
          presence_penalty: 0,
        };

        const data = JSON.stringify(dataObject);
        xhr.send(data);
      }
      catch {
        resolve(null);
      }
    });
  }
}
