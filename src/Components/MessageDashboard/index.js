import React, { Component } from 'react';
import MessageList from '../MessageList';
import AddMessageForm from '../AddMessageForm';
import sdk from '../../lib';

class MessageDashboard extends Component {
  // implement ping/pong
  state = {
    messages: [],
  };

  componentDidMount() {
    this.websocket = sdk.ws();

    this.websocket.onopen = (e) => {
      this.websocket.actions.getCollection('messages');
      this.websocket.actions.open({
        userId: '12345',
      });
    }

    // function heartbeat() {
    //   clearTimeout(this.pingTimeout);

    //   // Use `WebSocket#terminate()`, which immediately destroys the connection,
    //   // instead of `WebSocket#close()`, which waits for the close timer.
    //   // Delay should be equal to the interval at which your server
    //   // sends out pings plus a conservative assumption of the latency.
    //   this.pingTimeout = setTimeout(() => {
    //     this.terminate();
    //   }, 30000 + 1000);
    // }

    // this.websocket.on('ping', heartbeat);

    this.websocket.onmessage = (e) => {
      const message = JSON.parse(e.data);
      this.websocketActionRouter(message);
    }

    this.websocket.onclose = (e) => {
      // clearTimeout(this.pingTimeout);
      console.log('disconnected')
    }
  }

  websocketActionRouter = (message) => {
    console.log('websocketActionRouter message', message); // for debugging
    const { action } = message;

    switch (action) {
      // case 'find':
      //   find(message);
      //   break;
      // case 'getOne':
      //   getOne(message);
      //   break;
      case 'getAll':
        this.getAll(message);
        break;
      case 'create':
        this.create(message);
        break;
      case 'update':
        this.update(message);
        break;
      case 'patch':
        this.patch(message);
        break;
      case 'delete':
        this.delete(message);
        break;
      // case 'broadcast':
      //   wss.broadcast(message);
      //   break;
      case 'connection':
        this.connection(message);
        break;
      case 'open':
        this.onOpen(message);
        break;
      // case 'close':
      //   close(message);
      //   break;
      default:
        console.log('websocketActionRouter default case');
      // wss.router.sendMessage(client, {
      //   action: 'error',
      //   message: 'Error: valid action not provided.'
      // });
    }
  }

  getAll = (message) => {
    if (message.collection === "messages") {
      this.setState((prevState) => ({
        messages: [...prevState.messages, ...message.response],
      }));
    }
  }

  create = (message) => {
    if (message.collection === "messages") {
      this.setState((prevState) => ({
        messages: [...prevState.messages, message.response],
      }));
    }
  }

  update = (message) => {
    if (message.collection === 'messages') {
      this.setState((prevState) => ({
        messages: prevState.messages.map((existingMessage) => {
          if (existingMessage._id === message.response._id) {
            return message.response;
          }

          return existingMessage;
        })
      }));
    }
  }

  patch = (message) => {
    if (message.collection === 'messages') {
      this.setState((prevState) => ({
        messages: prevState.messages.map((existingMessage) => {
          if (existingMessage._id === message.response._id) {
            return message.response;
          }

          return existingMessage;
        })
      }));
    }
  }

  delete = (message) => {
    if (message.collection === "messages") {
      this.setState((prevState) => ({
        messages: prevState.messages.filter((existingMessage) => existingMessage._id !== message.response._id)
      }));
    }
  }

  connection = (message) => {
    console.log(message.response);
  }

  onOpen = (message) => {
    console.log(message.response);
  }

  handleOnSubmit = (messageText) => {
    this.websocket.actions.createResource('messages', { text: messageText });
  }

  handleDeleteMessage = (messageId) => {
    this.websocket.actions.deleteResource('messages', messageId);
  }

  handleUpdateMessage = (messageId, messageText) => {
    this.websocket.actions.updateResource('messages', messageId, { text: messageText });
  }

  handleOverwriteMessage = (messageId, messageText) => {
    this.websocket.actions.overwriteResource('messages', messageId, { text: messageText });
  }

  render() {
    const { messages } = this.state;

    return (
      <div className="messageDashboard">
        <MessageList
          messages={messages}
          onDeleteMessage={this.handleDeleteMessage}
          onUpdateMessage={this.handleUpdateMessage}
          onOverwriteMessage={this.handleOverwriteMessage}
        />
        <AddMessageForm
          onSubmit={this.handleOnSubmit} />
      </div>
    )
  }
};

export default MessageDashboard;
