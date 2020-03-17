import React, { Component } from 'react';
import MessageList from '../MessageList';
import AddMessageForm from '../AddMessageForm';
import sdk from '../../lib/sdk';

class MessageDashboard extends Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    // test sdk methods here:
    // sdk.updateResource("howdy", "5e71222a1b5ca20805551adc", { 'name': 'howdy thing 1!!!!', 'age': '32' })
    // sdk.updateResource("howdy", "5e7122261b5ca20805551adb", { 'name': 'howdy thing 2!!!!', 'age': "32" })

    // sdk.overwriteResource("howdy", "5e7122221b5ca20805551ada", { 'name': 'howdy thing 3.5!!!!' })


    return sdk.getCollection('Message')
      .then((messages) => {
        this.setState({
          messages
        });
      });
  }

  handleOnSubmit = (messageText) => {
    return sdk.createResource({ text: messageText }, 'Message')
      .then((message) => {
        this.setState((prevState) => (
          {
            messages: [...prevState.messages, message],
          }
        ));
      });
  };

  handleDeleteMessage = (message_id) => {
    return sdk.deleteResource("Message", message_id)
      .then((message) => {
        this.setState((prevState) => {
          let newMessages = prevState.messages.filter((msg) => {
            return !(msg._id === message._id)
          })
          return {
            messages: newMessages
          };
        })
      })
  }

  render() {
    const { messages } = this.state;

    return (
      <div className="messageDashboard">
        <MessageList messages={messages} onDeleteMessage={this.handleDeleteMessage} />
        <AddMessageForm onSubmit={this.handleOnSubmit} />
      </div>
    )
  }
};

export default MessageDashboard;
