import React from 'react';

class Register extends React.Component {
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

  handleRegisterSubmit = (e) => {
    e.preventDefault();
    this.props.handleRegisterSubmit({
      email: this.state.email,
      password: this.state.password,
    });
  }

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.handleRegisterSubmit}>
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

export default Register;