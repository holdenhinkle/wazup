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
  },
  deleteResource(collection, id) {
    const options = {
      method: 'DELETE',
    };
    return fetch(`${this.url}/${collection}/${id}`, options)
      .then(isOk);
  },
  updateResource(collection, id, data) {
    const options = {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    };
    return fetch(`${this.url}/${collection}/${id}`, options)
      .then(isOk)
      .then((updatedResource) => console.log(updatedResource))
  },
  overwriteResource(collection, id, data) {
    const options = {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    };
    return fetch(`${this.url}/${collection}/${id}`, options)
      .then(isOk)
      .then((newResource) => console.log(newResource))

  },
  getCollectionsList() {
    return fetch(`${this.url}/collections`)
      .then(isOk)
      .then((list) => console.log(list))
  },
  createNewCollection(collectionName) {
    const options = {
      method: 'POST',
      body: JSON.stringify({ "collectionName": collectionName }), // problem here?
      headers: {
        'Content-Type': 'application/json'
      },
    };
    return fetch(`${this.url}/collections`, options)
      .then(isOk)
      .then((coll) => console.log(coll))
  },
}

export default sdk;
