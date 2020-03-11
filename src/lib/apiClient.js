const isOk = (response) => response.ok ? response.json() : Promise.reject(new Error('Failed to load data from server'));

const client = {
  url: 'http://localhost:3000',
  getMessages() {
    return fetch(`${this.url}/messages`)
            .then(isOk);
  },
  createMessage(messageText) {
    const options = {
      method: 'POST',
      body: JSON.stringify({ text: messageText }),
      headers: {
        'Content-Type': 'application/json'
      },
    };

    return fetch(`${this.url}/messages`, options)
            .then(isOk);
  }
};

export default client;
