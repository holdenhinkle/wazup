import React, { Component } from 'react';

class EditMessage extends Component {
  state = {
    text: this.props.message.text,
  }

  handleOnChange = (e) => {
    this.setState({ text: e.target.value });
  }

  handleEditMessage = (e) => {
    if (e.target.value === 'update') {
      this.props.handleUpdateMessage(this.props.id, this.state.text);
    } else if (e.target.value === 'overwrite') {
      this.props.handleOverwriteMessage(this.props.id, this.state.text);
    }

    this.props.handleToggleEdit();
  }

  render() {
    return (
      <div>
        <input type='text' onChange={this.handleOnChange} value={this.state.text}></input>
        <button value="update" onClick={this.handleEditMessage}>Update</button>
        <button value="overwrite" onClick={this.handleEditMessage}>Overwrite</button>
        <button onClick={this.props.handleToggleEdit}>Cancel</button>
      </div>
    )
  }
}

export default EditMessage;