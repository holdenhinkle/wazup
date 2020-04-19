import React, { Component } from 'react';

class Message extends Component {
  onDeleteMessage = () => {
    this.props.handleDeleteMessage(this.props.message._id)
  }

  render() {
    const { userName, text } = this.props.message;
    return (
      <div className="message">
        <p><span className="username">{userName}</span>: {text}</p>
        <button onClick={this.onDeleteMessage}>Delete</button>
        <button onClick={this.props.handleToggleEdit}>Edit</button>
      </div>
    )
  }
}

export default Message;
