import React from 'react';

import Message from '../Message';

const MessageList = ({ messages }) => {
  if (messages.length === 0) {
    return <p>No messages yet!</p>;
  }

  const messageComponents = messages.map((message) => (
    <li key={message.id}><Message text={message.text} /></li>
  ));

  return (
    <ul>
      {messageComponents}
    </ul>
  )
};

export default MessageList;
