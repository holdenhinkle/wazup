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
    // sdk.createNewCollection("howdy")
    // const id = "5e72493c24df021c10b56b85"
    // sdk.createResource({ "name": "howdy" }, "howdy")
    // sdk.updateResource("howdy", id, { 'name': 'howdy thing 1!!!!', 'age': '32' })
    // sdk.updateResource("howdy", id, { 'name': 'howdy thing 2!!!!', 'age': "32" })

    // sdk.overwriteResource("howdy", id, { 'name': 'howdy thing 3.5!!!!' })
    // sdk.getCollection('Message')
    //   .then((messages) => {
    //     console.log(messages)
    //   })
    // sdk.getResource("Message", "5e7245f824df021c10b56b7d")
    //   .then((message) => {
    //     console.log(message)
    //   });


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
