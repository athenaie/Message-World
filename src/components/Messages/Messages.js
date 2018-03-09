import React from 'react';
import Message from './Message/Message';

const messages = (props) => {
    return  props.messages.map((message) => {
        return <Message who={message.who} time={message.time} style={message.style} name={message.name} content={message.content}/>
    });
}

export default messages;