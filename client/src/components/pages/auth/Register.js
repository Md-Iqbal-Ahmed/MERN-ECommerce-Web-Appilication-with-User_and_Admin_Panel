import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState([]);

  const onChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/user/register", { ...user });
      localStorage.setItem("firstLogin", true);

      window.location.href = "/";
    } catch (err) {
      setError(err.response.data.msg);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={submitHandler}>
        <h2>Register</h2>
        <input
          type="name"
          name="name"
          required
          placeholder="Name"
          value={user.name}
          onChange={onChangeInput}
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          value={user.email}
          onChange={onChangeInput}
        />
        <input
          type="password"
          name="password"
          required
          autoComplete="on"
          placeholder="Password"
          value={user.password}
          onChange={onChangeInput}
        />
        <div className="row">
          <button type="submit">Register</button>
          <Link to="/login">Login</Link>
        </div>
        {error && <div className="error"> {error} </div>}
      </form>
    </div>
  );
};

export default Register;
