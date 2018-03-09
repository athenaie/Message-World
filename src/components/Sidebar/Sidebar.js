import React from 'react';
import './Sidebar.css';
import Users from './Users/Users';

const sidebar = (props) => (
    <div className='Sidebar'>
      <p className='Me'>Hi, {props.me}</p>
      <p className='Section'>Online Users</p>
      <Users me={props.me} users={props.users}/>
    </div>
); 

export default sidebar; 