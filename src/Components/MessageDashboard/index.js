import React, { Component } from 'react';
import ChannelList from '../ChannelList';
import MessageList from '../MessageList';
import AddMessageForm from '../AddMessageForm';
import AddChannelForm from '../AddChannelForm';
import sdk from '../../lib';

class MessageDashboard extends Component {
  state = {
    usersChannels: [],
    usersCurrentChannel: { channelType: null, channelId: null },
    channels: [],
    messages: [],
  };

  componentDidMount() {
    // open websocket connection
    this.websocket = sdk.ws();

    // sub user to user's channels on websocket onopen event
    this.websocket.onopen = (e) => {
      this.websocket.actions.joinUsersChannels('usersmeta');
    }

    this.websocket.onmessage = (e) => {
      const message = JSON.parse(e.data);
      this.websocketActionRouter(message);
    }

    this.websocket.onclose = (e) => {
      console.log('disconnected')
    }

    // get channels, user's channels, user's current channel
    sdk.db.getCollection('usersmeta')
      .then((usersmeta) => usersmeta.find((user) => user.userId === this.props.userId))
      .then((usermeta) => {
        if (usermeta.channels.length > 0) {
          this.setUsersChannels(usermeta.channels);
        }

        // remove usermeta.currentChannel._id -- this is just for testing
        if (usermeta.currentChannel.channelType && usermeta.currentChannel._id || usermeta.currentChannel.channelId) {
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

    // get channels
    sdk.db.getCollection('rooms')
      .then((channels) => this.setChannels(channels));
  }

  addNewMessage = (message) => {
    this.setState((prevState) => ({
      messages: [...prevState.messages, message],
    }));
  }

  setMessages = (messages) => { // reuse this method
    this.setState({
      messages,
    });
  }

  clearMessages = () => {
    this.setState({
      messages: [],
    });
  }

  createChannelOrchestrator = (channel) => {
    const { channelType, _id } = channel;
    const newChannel = { channelType, channelId: _id };

    this.addNewChannel(channel);
    this.setUsersCurrentChannel(newChannel);
    this.addChannelToUsersChannels(newChannel);
    this.updateUsermetaChannels();
    this.clearMessages();
  }

  setChannels = (channels) => { // reuse this method
    this.setState({
      channels,
    });
  }

  removeChannel = (channel) => {
    console.log('channel', channel);

    this.setState({
      channels: this.state.channels.filter((currentChannel) => {
        console.log('currentChannel', currentChannel);
        return currentChannel.channelType !== channel.channelType && currentChannel._id !== channel.channelId
      }),
    });
  }

  addNewChannel = (channel) => {
    this.setState((prevState) => ({
      channels: [...prevState.channels, channel],
    }));
  }

  setUsersChannels = (usersChannels) => {
    this.setState({
      usersChannels,
    });
  }

  setUsersCurrentChannel = (usersCurrentChannel) => {
    console.log('usersCurrentChannel', usersCurrentChannel);
    this.setState({
      usersCurrentChannel,
    });
  }

  addChannelToUsersChannels = (channel) => {
    this.setState((prevState) => ({
      usersChannels: [...prevState.usersChannels, channel],
    }));
  }

  // remove  || currentChannel._id !== id -- this is just for testing
  deleteChannelFromUsersChannels = (id) => {
    this.setState({
      usersChannels: this.state.usersChannels.filter((currentChannel) => currentChannel.id !== id || currentChannel._id !== id),
    });
  }

  updateUsermetaChannels = () => {
    sdk.db.getCollection('usersmeta')
      .then((usersmeta) => {
        return usersmeta.find((user) => user.userId === this.props.userId)
      })
      .then((usermeta) => {
        return this.websocket.actions.updateResource(
          'usersmeta',
          usermeta._id,
          { channels: this.state.usersChannels, currentChannel: this.state.usersCurrentChannel }
        );
      });
  }

  websocketActionRouter = (message) => {
    const { action } = message;

    switch (action) {
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
      case 'joinChannel':
        this.joinChannel(message);
        break;
      case 'leaveChannel':
        this.leaveChannel(message);
        break;
      case 'changeChannel':
        this.changeChannel(message);
        break;
      case 'deleteChannel':
        this.deleteChannel(message);
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
    const { collection } = message;

    switch (collection) {
      case 'messages':
        this.addNewMessage(message.response);
        break;
      case 'rooms':
        this.createChannelOrchestrator(message.response);
        break;
      default:
        return;
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

  // done
  joinChannel = (message) => {
    if (message.userId === this.props.userId && message.response) {
      const { channels, currentChannel } = message.response;

      this.setUsersChannels(channels);
      this.setUsersCurrentChannel(currentChannel);

      // get messsages
      // code copied from componentDidMount
      sdk.db.getCollection('messages')
        .then((messages) => {
          return messages.filter((message) => (
            message.channelType === this.state.usersCurrentChannel.channelType &&
            message.channelId === this.state.usersCurrentChannel.channelId
          ))
        })
        .then((messages) => this.setMessages(messages));
    } else {
      console.log(message);
    }
  }

  leaveChannel = (message) => {
    if (message.userId === this.props.userId && message.response) {
      const { channels, currentChannel } = message.response;
      this.setUsersChannels(channels);
      this.setUsersCurrentChannel(currentChannel);

      // get messsages
      // code copied from componentDidMount
      sdk.db.getCollection('messages')
        .then((messages) => {
          return messages.filter((message) => (
            message.channelType === this.state.usersCurrentChannel.channelType &&
            message.channelId === this.state.usersCurrentChannel.channelId
          ))
        })
        .then((messages) => this.setMessages(messages));
    } else {
      console.log(message);
    }
  }

  changeChannel = (message) => {
    const { currentChannel } = message.response;
    this.setUsersCurrentChannel(currentChannel);

    // get messsages
    // code copied from componentDidMount
    sdk.db.getCollection('messages')
      .then((messages) => {
        return messages.filter((message) => (
          message.channelType === this.state.usersCurrentChannel.channelType &&
          message.channelId === this.state.usersCurrentChannel.channelId
        ))
      })
      .then((messages) => this.setMessages(messages));
  }

  deleteChannel = (message) => {
    if (message.userId === this.props.userId && message.response) {
      const { channelType, channelId } = message;
      const { channels, currentChannel } = message.response;

      this.setUsersChannels(channels);
      this.setUsersCurrentChannel(currentChannel);
      this.removeChannel({ channelType, channelId });
    } else {
      // handle what happens when someone else delete a channel that you're subscribed/on
    }

    // get messsages
    // code copied from componentDidMount
    sdk.db.getCollection('messages')
      .then((messages) => {
        return messages.filter((message) => (
          message.channelType === this.state.usersCurrentChannel.channelType &&
          message.channelId === this.state.usersCurrentChannel.channelId
        ))
      })
      .then((messages) => this.setMessages(messages));
  }

  handleOnSubmit = (text) => {
    const message = {
      userName: this.props.userName,
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

  handleChannelSubmit = (name) => {
    const message = {
      channelType: 'rooms',
      userId: this.props.userId,
      name,
    }

    this.websocket.actions.createResource('rooms', message);
  }

  handleJoinChannel = (channelType, channelId) => {
    this.websocket.actions.joinChannel('usersmeta', channelType, channelId);
  }

  handleLeaveChannel = (channelType, channelId) => {
    this.websocket.actions.leaveChannel('usersmeta', channelType, channelId);
  }

  handleChangeChannel = (channelType, channelId) => {
    this.websocket.actions.changeChannel('usersmeta', channelType, channelId);
  }

  handleDeleteChannel = (channelType, channelId) => {
    this.websocket.actions.deleteChannel('usersmeta', 'messages', channelType, channelId);
  }

  render() {
    const { messages, channels, usersChannels, usersCurrentChannel } = this.state;

    return (
      <div id="message-dashboard">
        <div id="channels-wrapper">
          <h1>Channels:</h1>
          <ChannelList
            userId={this.props.userId}
            channels={channels}
            usersChannels={usersChannels}
            usersCurrentChannel={usersCurrentChannel}
            onJoinChannel={this.handleJoinChannel}
            onLeaveChannel={this.handleLeaveChannel}
            onChangeChannel={this.handleChangeChannel}
            onDeleteChannel={this.handleDeleteChannel}
          />
          <AddChannelForm
            onSubmit={this.handleChannelSubmit}
          />
        </div>
        <div id="messages-wrapper">
          <h1>Messages:</h1>
          <MessageList
            messages={messages}
            onDeleteMessage={this.handleDeleteMessage}
            onUpdateMessage={this.handleUpdateMessage}
            onOverwriteMessage={this.handleOverwriteMessage}
          />
          {this.state.usersCurrentChannel.channelType === null && this.state.usersCurrentChannel.channelId === null ?
            <p>Create a join a channel to sent a message!</p>
            :
            <AddMessageForm
              onSubmit={this.handleOnSubmit}
            />
          }
        </div>
      </div>
    )
  }
};

export default MessageDashboard;
