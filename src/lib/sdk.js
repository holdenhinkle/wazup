const isOk = (response) => {
  return response.ok ?
    response.json() :
    Promise.reject(new Error('Failed to load data from server'));
}

const sdk = {
  url: 'http://localhost:3001',
  getCollection(collection) {
    return fetch(`${this.url}/${collection}`)
      .then(isOk);
  },
  getResource(collection, id) {
    return fetch(`${this.url}/${collection}/${id}`)
      .then(isOk);
  },
  createResource(resourceObject, collection) {
    const options = {
      method: 'POST',
      body: JSON.stringify(resourceObject),
      headers: {
        'Content-Type': 'application/json'
      },
    };
    return fetch(`${this.url}/${collection}`, options)
      .then(isOk);
  }
}

export default sdk;
