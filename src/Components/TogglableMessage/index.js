import React, { Component } from 'react';
import Message from '../Message';
import EditMessage from '../EditMessage';

class TogglableMessage extends Component {
  state = {
    edit: false,
  }

  onDeleteMessage = () => {
    this.props.handleDeleteMessage(this.props.message._id)
  }

  handleToggleEdit = () => {
    this.setState((prevState) => ({
      edit: !prevState.edit,
    }));
  }

  render() {
    const { message, handleDeleteMessage, handleUpdateMessage, handleOverwriteMessage } = this.props;

    return (
      <div>
        {this.state.edit ?
          <EditMessage
            message={message}
            handleToggleEdit={this.handleToggleEdit}
            handleUpdateMessage={handleUpdateMessage}
            handleOverwriteMessage={handleOverwriteMessage}
          />
          :
          <Message
            message={message}
            handleToggleEdit={this.handleToggleEdit}
            handleDeleteMessage={handleDeleteMessage}
          />
        }
      </div>
    )
  }
}

export default TogglableMessage;
