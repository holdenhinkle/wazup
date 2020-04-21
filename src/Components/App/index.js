import React, { Component } from 'react';
import Login from '../Login';
import Register from '../Register';
import MessageDashboard from '../MessageDashboard';
import sdk from '../../lib';

class App extends Component {
  state = {
    loggedIn: false,
    username: null,
    userId: null,
  }

  handleLoginSubmit = async ({ email, password }) => {
    sdk.auth.login(email, password)
      .then(async (res) => {
        const usersmeta = await sdk.db.getCollection('usersmeta');
        return usersmeta.find(usermeta => usermeta.userId === res.id);
      })
      .then((usermeta) => {
        this.setUsername(usermeta.username);
        this.setUserId(usermeta.userId);
        this.toggleLoggedIn();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  handleRegisterSubmit = ({ username, email, password }) => {
    sdk.auth.register(email, password)
      .then(() => {
        return sdk.auth.login(email, password);
      })
      .then((loginRes) => {
        const data = {
          username,
          userId: loginRes.id,
          channels: [],
          currentChannel: { channelType: null, channelId: null },
          broadcast: false,
        }

        return sdk.db.createResource('usersmeta', data);
      })
      .then((usersmetaRes) => {
        this.setUsername(usersmetaRes.username);
        this.setUserId(usersmetaRes.userId);
        this.toggleLoggedIn();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  setUsername = (username) => {
    this.setState({
      username,
    });
  }

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
        {
          this.state.loggedIn ?
            <div>
              <div>
                <p>Welcome {this.state.username}!</p>
                <button onClick={this.toggleLoggedIn}>Logout</button>
              </div>
              <MessageDashboard
                userName={this.state.username}
                userId={this.state.userId}
              />
            </div>
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
