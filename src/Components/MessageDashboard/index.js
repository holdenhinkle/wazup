import React, { Component } from 'react';
import MessageList from '../MessageList';
import AddMessageForm from '../AddMessageForm';
import apiClient from '../../lib/apiClient';

class MessageDashboard extends Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    apiClient.getMessages()
      .then((messages) => {
        this.setState({
          messages
        });
      });
  }

  handleOnSubmit = (messageText) => {

    return apiClient.createMessage(messageText)
            .then((message) => {
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
        <MessageList messages={messages}/>
        <AddMessageForm onSubmit={this.handleOnSubmit} />
      </div>
    )
  }
};

export default MessageDashboard;
