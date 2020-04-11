import React, { Component } from 'react';
import MessageList from '../MessageList';
import AddMessageForm from '../AddMessageForm';
import sdk from '../../lib';

class MessageDashboard extends Component {
  // implement ping/pong
  state = {
    usersChannels: [],
    usersCurrentChannel: { channelType: null, channelId: null },
    allChannels: [],
    messages: [],
  };

  componentDidMount() {
    // open websocket connection
    this.websocket = sdk.ws();

    // sub user to user's channels on websocket onopen event
    this.websocket.onopen = (e) => {
      this.websocket.actions.joinUsersChannels('usersmeta');  // where should I store the name of the usersInformationCollection?
    }

    this.websocket.onmessage = (e) => {
      const message = JSON.parse(e.data);
      this.websocketActionRouter(message);
    }

    this.websocket.onclose = (e) => {
      // clearTimeout(this.pingTimeout);
      console.log('disconnected')
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

    // get channels, user's channels, user's current channel
    sdk.db.getCollection('usersmeta')
      .then((usersmeta) => usersmeta.find((user) => user.userId === this.props.userId))
      .then((usermeta) => {
        if (usermeta.channels.length > 0) {
          this.setUsersChannels(usermeta.channels);
        }

        if (Object.keys(usermeta.currentChannel).length > 0) {
          this.setUsersCurrentChannel(usermeta.currentChannel);
        }
      });

    // get messages for user's current channel
    sdk.db.getCollection('messages')
      .then((messages) => {
        return messages.filter((message) => (
          message.channelType === this.state.usersCurrentChannel.channelType &&
          message.channelId === this.state.usersCurrentChannel.channelId
        ))
      })
      .then((messages) => this.setMessages(messages));
  }

  setUsersChannels = (usersChannels) => {
    this.setState({
      usersChannels,
    });
  }

  setUsersCurrentChannel = (usersCurrentChannel) => {
    this.setState({
      usersCurrentChannel,
    });
  }

  addChannelToUsersChannels = (channel) => {
    this.setState((prevState) => ({
      usersChannels: [...prevState.usersChannels, channel],
    }));
  }

  deleteChannelFromUsersChannels = (channel) => {
    this.setState({
      usersChannels: this.state.usersChannels.filter((currentChannel) => currentChannel !== channel),
    });
  }

  setMessages = (messages) => { // reuse this method
    this.setState({
      messages,
    });
  }

  websocketActionRouter = (message) => {
    console.log('websocketActionRouter message', message); // for debugging
    const { action } = message;

    switch (action) {
      case 'query': // not in use
        this.query(message);
        break;
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
      case 'joinUsersChannels':
        this.joinUsersChannels(message);
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

  query = (message) => { // not in use
    // if (message.collection === "messages") {
    //   this.setState((prevState) => ({
    //     // messages: [...prevState.messages, ...message.response],
    //   }));
    // } else if (message.collection === "channels") {
    //   this.setState((prevState) => ({
    //     // messages: [...prevState.messages, ...message.response],
    //   }));
    // }
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

  joinUsersChannels = (message) => {
    const { action, usersChannels } = message;
    console.log(`${action}: ${usersChannels.length} channel(s) joined`);
  }

  handleOnSubmit = (text) => {
    const message = {
      userId: this.props.userId,
      channelType: this.state.usersCurrentChannel.channelType,
      channelId: this.state.usersCurrentChannel.channelId,
      text,
    }

    this.websocket.actions.createResource('messages', message);
  }

  handleDeleteMessage = (messageId) => {
    this.websocket.actions.deleteResource('messages', messageId);
  }

  handleUpdateMessage = (messageId, text) => {
    this.websocket.actions.updateResource('messages', messageId, { text });
  }

  handleOverwriteMessage = (messageId, text) => {
    const message = {
      userId: this.props.userId,
      channelType: this.state.usersCurrentChannel.channelType,
      channelId: this.state.usersCurrentChannel.channelId,
      text,
    }

    this.websocket.actions.overwriteResource('messages', messageId, message);
  }

  logout = () => {
    sdk.auth.logout();
  }

  render() {
    const { messages } = this.state;

    return (
      <div className="messageDashboard">
        <button onClick={this.props.toggleLoggedIn}>Logout</button>
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
