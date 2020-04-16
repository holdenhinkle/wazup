const createNewWebsocket = (url) => {
  const ws = new WebSocket(url.replace('http', 'ws'));
  ws.actions = wsFactory(ws);
  return ws;
}

const wsFactory = (ws) => ({
  findResource(collection, query) { // finish this
    this.sendMessage({
      action: 'find',
      collection,
      query,
    });
  },
  getCollection(collection) {
    this.sendMessage({
      action: 'getAll',
      collection,
    });
  },
  getResource(collection, id) {
    this.sendMessage({
      action: 'getOne',
      collection,
      id,
    });
  },
  createResource(collection, data) {
    this.sendMessage({
      action: 'create',
      collection,
      data,
    });
  },
  overwriteResource(collection, id, data) {
    this.sendMessage({
      action: 'update',
      collection,
      id,
      data,
    });
  },
  updateResource(collection, id, data) {
    this.sendMessage({
      action: 'patch',
      collection,
      id,
      data,
    });
  },
  deleteResource(collection, id) {
    this.sendMessage({
      action: 'delete',
      collection,
      id,
    });
  },
  open(message) {
    message.action = 'open';
    this.sendMessage(message);
  },
  close(message) {
    message.action = 'close';
    this.sendMessage(message);
  },
  sendMessage(message) {
    ws.send(JSON.stringify(message));
  },
  joinUsersChannels(usersInformationCollection) {
    this.sendMessage({
      action: 'joinUsersChannels',
      usersInformationCollection,
    });
  },
  joinChannel(usersInformationCollection, channelType, channelId) {
    this.sendMessage({
      action: 'joinChannel',
      usersInformationCollection,
      channelType,
      channelId,
    });
  },
  leaveChannel(usersInformationCollection, channelType, channelId) {
    this.sendMessage({
      action: 'leaveChannel',
      usersInformationCollection,
      channelType,
      channelId,
    });
  }
  // getCollectionsList() {
  //   return sendRequest(`${url}/collections`)
  //     .then((list) => console.log(list))
  // },
  // createNewCollection(collectionName) {
  //   return sendRequest(`${url}/collections`, 'POST', { collectionName })
  //     .then((coll) => console.log(coll));
  // },

});

export default createNewWebsocket;
