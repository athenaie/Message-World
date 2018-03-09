import React from 'react';
import Messages from '../Messages/Messages';
import './MessageWindow.css';

const messageWindow = (props) => (
    <div className='MessageWindow'>
        <Messages messages={props.messages}/>
    </div>
);

export default messageWindow;