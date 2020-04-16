import React, { Component } from 'react';

class AddChannelForm extends Component {
  state = {
    messageText: '',
  };

  handleOnChange = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.onSubmit(this.state.messageText)
    this.setState({
      messageText: '',
    });
  };

  render() {
    const { messageText } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="messageText"
          value={messageText}
          onChange={this.handleOnChange}
        />

        <button type="submit">Create Channel</button>
      </form>
    )
  }
};

export default AddChannelForm;
