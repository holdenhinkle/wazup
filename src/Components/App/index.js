import React, { Component } from 'react';
import Login from '../Login';
import Register from '../Register';
import MessageDashboard from '../MessageDashboard';
import sdk from '../../lib';

class App extends Component {
  state = {
    loggedIn: false,
    userId: null,
  }

  handleLoginSubmit = async ({ email, password }) => {
    sdk.auth.login(email, password)
      .then((res) => {
        this.setUserId(res.id);
        this.toggleLoggedIn();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handleRegisterSubmit = async ({ email, password }) => {
    sdk.auth.register(email, password)
      .then(() => {
        this.handleLoginSubmit({ email, password });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // handleLoginSubmit = async ({ email, password }) => {
  //   sdk.auth.login(email, password)
  //     .then((res) => {
  //       this.setUserId(res.id);
  //     })
  //     .then(() => {
  //       return sdk.db.getCollection('usersmeta');
  //     })
  //     .then((usersmeta) => {
  //       console.log('USERS ID', this.state.usersId);
  //       const user = usersmeta.filter((user) => user.userId === this.state.userId);
  //       sdk.db.updateResource('usersmeta', user.id, { online: true });
  //     })
  //     .then(() => {
  //       this.toggleLoggedIn();
  //     })
  // }

  // handleRegisterSubmit = async ({ email, password }) => {
  //   try {
  //     const res = await sdk.auth.register(email, password);

  //     await sdk.db.createResource('usersmeta', {
  //       userdId: res.id,
  //       online: false,
  //       channels: [],
  //       currentChannel: {},
  //       timeOpen: 'asdf',
  //       timeClose: 'asdf',
  //     });

  //     this.handleLoginSubmit({ email, password });
  //   } catch (e) {
  //     console.log(e); // finish this
  //   }
  // }

  setUserId = (userId) => {
    this.setState({
      userId,
    });
  }

  toggleLoggedIn = () => {
    this.setState((prevState) => {
      return ({
        loggedIn: !prevState.loggedIn,
      });
    });
  }

  render() {
    return (
      <div className="App" >
        {this.state.loggedIn ?
          <MessageDashboard
            toggleLoggedIn={this.toggleLoggedIn}
            userId={this.state.userId}
          />
          :
          <div>
            <div>
              <Login
                handleLoginSubmit={this.handleLoginSubmit}
              />
            </div>
            <div>
              <Register
                handleRegisterSubmit={this.handleRegisterSubmit}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
