/* Some github api calls
*/
export default class Github {
  constructor(owner, repo, authorizationToken) {
    this.owner = owner;
    this.repo = repo;
    this.authorizationToken = authorizationToken;
    this.url = `https://api.github.com/repos/${this.owner}/${this.repo}`;
  }

  async get(path) {
    let url = `${this.url}/contents/${path}`;
    let headers = this._makeHeaders();
    let info = {
      method: 'GET',
      headers: headers,
    };

    try {
      let result = await fetch(url, info);
      let existingFile = await result.json();
      return existingFile;
    }
    catch(e) {
      console.log(e.message);
    }
    // TODO - error flow?
  }

  async put(blob, path, message, sha = null) {
    let url = `${this.url}/contents/${path}`;
    let content = btoa(blob);
    let headers = this._makeHeaders();
    let body = {
      message: message,
      content: content,
      sha: sha,
    };
    let info = {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body),
    };

    let response = await fetch(url, info);
    let text = await response.text()
    if (!response.ok) {
      let message = `${response.status} ${response.statusText} \n${text}`;
      throw(new Error(message));
    }
    //let json = await result.json();
    //return json;
  }

  async trees() {
    let url = `${this.url}/git/trees/main?recursive=1`;
    let response = await fetch(url);
    let text = response.text();
    s = 'bbb ' + text;
    return s;
  }

  _makeHeaders() {
    let headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `token ${this.authorizationToken}`,
    };
    return headers;
  }
}
