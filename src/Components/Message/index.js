import React, { Component } from 'react';

class Message extends Component {
  onDeleteMessage = () => {
    this.props.handleDeleteMessage(this.props.id)
  }
  render() {
    return (
      <div>
        <p>{this.props.text}</p>
        <button onClick={this.onDeleteMessage}>Delete</button>
      </div>
    )
  }
}

export default Message;
