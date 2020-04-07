import React from 'react';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
  }

  handleOnChange = (e) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  }

  handleLoginSubmit = (e) => {
    e.preventDefault();
    this.props.handleLoginSubmit({
      email: this.state.email,
      password: this.state.password,
    });
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleLoginSubmit}>
          <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value={this.state.email} required onChange={this.handleOnChange} />
          </div>
          <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" value={this.state.password} required onChange={this.handleOnChange} />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;