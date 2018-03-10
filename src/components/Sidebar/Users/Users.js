import React, {Component} from 'react';
import User from './User/User';
import './Users.css';

class Users extends Component {
    render () {
        return this.props.users.map((user,index) => {
            return <User className='User' name={user}/>
        });
    }
}

export default Users;