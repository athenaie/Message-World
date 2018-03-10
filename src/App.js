import React, { Component } from 'react';
import './App.css';
import MessageWindow from './components/MessageWindow/MessageWindow';
import Sidebar from './components/Sidebar/Sidebar';
import Form from './components/Form/Form';
import openSocket from 'socket.io-client';
import { withCookies, Cookies } from 'react-cookie';

class App extends Component {

  constructor(props) {
    super(props);
    const cookies = new Cookies();
    this.state = {
      users: [],
      messages: [],
      placeholder: 'Message the world...',
      value: '',
      name: '',
      color: '',
      socket: null,
      cookies: cookies  
    };
      // this.state.cookies.remove('name');
      // this.state.cookies.remove('color');
  }

  componentDidMount() {
    const socket = openSocket('http://localhost:3000');
    this.setState({socket: socket});

    socket.emit('first message', this.state.cookies.getAll());

    socket.on('first message', (data) => {
      let name = data.name;
      let color = data.color;
      let msgs = data.messages;
      let messages = [];
      for (let msg of msgs) {
        let who = 'them';
        let date = new Date(msg.time);
        let time = ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2);
        if (msg.name === name) {
          who = 'me';
        }
        let message = { who: who, time: time, name: msg.name, style: { color: msg.color }, content: msg.msg};
        messages.push(message);
      }

      this.setState({name: name, color:color, messages: messages});
      this.state.cookies.set('name', name, { path: '/'});
      this.state.cookies.set('color', color, { path: '/'});
    });
    
    socket.on('chat message', (msg) => {
      console.log(msg);
      let messages = this.state.messages;
      let who = 'them';
      let date = new Date(msg.time);
      let time = ('0' + date.getHours()).slice(-2) + ":" + ('0' + date.getMinutes()).slice(-2);
      if (msg.name === this.state.name) {
        who = 'me';
      }
      let message = { who: who, time: time, name: msg.name, style: { color: msg.color }, content: msg.msg}
      messages.push(message);
      this.setState({messages: messages});
    });

    socket.on('name change', (data) => {
      this.setState({name: data.name});
      this.state.cookies.set('name', data.name, { path: '/'});
    });

    socket.on('user list', (users) => {
      this.setState({users: users});
    });

  }

  keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      this.newMessageHandler(e);
    }
  }

  messageChangeHandler = (e) => {
    this.setState({value: e.target.value});
  }

  newMessageHandler(e) {
    let msg = {msg: e.target.value} 
    if (msg.msg.substring(0,11) === '/nickcolor ' && msg.msg.length === 17) {
      let color = '#' + msg.msg.substring(11);
      this.state.cookies.set('color', color, { path: '/'});
      this.setState({value: ''});
    }
    else {
      if (msg.msg.substring(0,6) === '/nick ' && msg.msg.length > 6) {
        let name = msg.msg.substring(6);
        this.state.socket.emit('name change', {cookies: this.state.cookies.getAll(), name: name})
      }
      else {
        this.state.socket.emit('chat message', {cookies: this.state.cookies.getAll(), msg: e.target.value});
      }
    }
    this.setState({value: ''});
  }

  render() {
    return (
      <div className="App">
        <style>
          @import url('https://fonts.googleapis.com/css?family=Raleway:400,700');
        </style>
        <div className='App-content'>
          <Sidebar me={this.state.name} users={this.state.users} />
          <div className='App-chat'>
            <header className="App-header">
              <h1 className="App-title">Message World</h1>
            </header>
            <div className="App-messages">
              <MessageWindow messages={this.state.messages} />
            </div>
            <Form onKeyPress={this.keyPressHandler} changed={this.messageChangeHandler} placeholder={this.state.placeholder} value={this.state.value}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
