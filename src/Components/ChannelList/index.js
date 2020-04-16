import React from 'react';
import Channel from '../Channel';

const ChannelList = ({ userId, channels, usersChannels, usersCurrentChannel, onJoinChannel, onLeaveChannel, onChangeChannel, onDeleteChannel }) => {
  if (channels.length === 0) {
    return <p>No rooms yet!</p>;
  }

  const channelComponents = channels.map((channel) => (
    <li key={channel._id}>
      <Channel
        userId={userId}
        channel={channel}
        usersChannels={usersChannels}
        usersCurrentChannel={usersCurrentChannel}
        handleJoinChannel={onJoinChannel}
        handleLeaveChannel={onLeaveChannel}
        handleChangeChannel={onChangeChannel}
        handleDeleteChannel={onDeleteChannel}
      />
    </li>
  ));

  return (
    <ul>
      {channelComponents}
    </ul>
  )
};

export default ChannelList;
