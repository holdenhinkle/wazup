import React, { Component } from 'react';
import MessageList from '../MessageList';
import AddMessageForm from '../AddMessageForm';
import sdk from '../../lib/sdk';

class MessageDashboard extends Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    return sdk.getCollection('Message')
      .then((messages) => {
        console.log(messages)
        this.setState({
          messages
        });
      });
  }

  handleOnSubmit = (messageText) => {
    return sdk.createResource({ text: messageText }, 'Message')
      .then((message) => {
        console.log(message + 'from inside then')
        this.setState((prevState) => (
          {
            messages: [...prevState.messages, message],
          }
        ));
      });
  };

  render() {
    const { messages } = this.state;

    return (
      <div className="messageDashboard">
        <MessageList messages={messages} />
        <AddMessageForm onSubmit={this.handleOnSubmit} />
      </div>
    )
  }
};

export default MessageDashboard;
