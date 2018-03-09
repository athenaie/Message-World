import React from 'react';
import './Message.css';

const message = (props) => (
    <div className={props.who}>
        <span className='name' style={props.style}>{props.name}</span> <span className="time">{props.time}</span>
        <div>
        {props.content}
        </div>
    </div>
); 

export default message;