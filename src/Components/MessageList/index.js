import React from 'react';

import Message from '../Message';

const MessageList = ({ messages, onDeleteMessage }) => {
  if (messages.length === 0) {
    return <p>No messages yet!</p>;
  }

  const messageComponents = messages.map((message) => (
    <li key={message._id}>
      <Message text={message.text} id={message._id} handleDeleteMessage={onDeleteMessage} />
    </li>
  ));

  return (
    <ul>
      {messageComponents}
    </ul>
  )
};

export default MessageList;
