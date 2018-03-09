import React, { Component } from 'react';
import './App.css';
import MessageWindow from './components/MessageWindow/MessageWindow';
import Sidebar from './components/Sidebar/Sidebar';
import Form from './components/Form/Form'

class App extends Component {
  state = {
    users: [{ name: 'Bob' }, { name: 'Alice' }, { name: 'Claire' }],
    messages: null,
    placeholder: 'Message the world...',
    value: ''
  }

  keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      this.newMessageHandler(e.target.value);
    }
  }

  messageChangeHandler = (e) => {
    this.setState({value: e.target.value});
  }

  newMessageHandler(props) {
    // do something with the state
    console.log('here');
    this.setState({value: ''});
  }

  render() {
    let Message1 = { who: 'me', time: '00:05', name: 'Marissa', style: { color: '#4286f4' }, content: 'This is an incredibly long message that just goes on and on and on and on and on.' }
    let Message2 = { who: 'them', time: '00:20', name: 'Bob', style: { color: '#770000' }, content: 'This is an incredibly long message that just goes on and on and on and on and on.' }
    let messages = [Message1, Message2, Message1, Message2, Message1, Message2, Message2, Message2, Message2];
    return (
      <div className="App">
        <style>
          @import url('https://fonts.googleapis.com/css?family=Raleway:400,700');
        </style>
        <div className='App-content'>
          <Sidebar me='Marissa' users={this.state.users} />
          <div className='App-chat'>
            <header className="App-header">
              <h1 className="App-title">Message World</h1>
            </header>
            <div className="App-messages">
              <MessageWindow messages={messages} />
            </div>
            <Form onKeyPress={this.keyPressHandler} changed={this.messageChangeHandler} placeholder={this.state.placeholder} value={this.state.value}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
