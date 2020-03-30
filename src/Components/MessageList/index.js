import React from 'react';

import TogglableMessage from '../TogglableMessage';

const MessageList = ({ messages, onDeleteMessage, onUpdateMessage, onOverwriteMessage }) => {
  if (messages.length === 0) {
    return <p>No messages yet!</p>;
  }

  const messageComponents = messages.map((message) => (
    <li key={message._id}>
      <TogglableMessage
        message={message}
        handleDeleteMessage={onDeleteMessage}
        handleUpdateMessage={onUpdateMessage}
        handleOverwriteMessage={onOverwriteMessage}
      />
    </li>
  ));

  return (
    <ul>
      {messageComponents}
    </ul>
  )
};

export default MessageList;
