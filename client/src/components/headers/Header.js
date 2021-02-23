import React, { useContext, useState } from "react";
import Menu from "./icon/menu.svg";
import Close from "./icon/cancel.svg";
import Cart from "./icon/cart.svg";
import { Link } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import axios from "axios";

const Header = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [cart] = state.userAPI.cart;
  const [menu, setMenu] = useState(false);

  const userLogout = async () => {
    await axios.get("/user/logout");
    localStorage.removeItem("firstLogin");
    window.location.href = "/";
  };

  const adminRouter = () => {
    return (
      <>
        <li>
          <Link to="/create_product">Create Product</Link>
        </li>
        <li>
          <Link to="/category">Categories</Link>
        </li>
      </>
    );
  };
  const loggedRouter = () => {
    return (
      <>
        <li>
          <Link to="/history">History</Link>
        </li>
        <li>
          <Link to="/" onClick={userLogout}>
            Logout
          </Link>
        </li>
      </>
    );
  };

  const toggleMenu = () => {
    setMenu(!menu);
  };

  const styleMenu = {
    left: menu ? 0 : "-100%",
  };

  return (
    <header>
      <div className="menu" onClick={toggleMenu}>
        <img src={Menu} alt="" width="30px" />
      </div>

      <div className="logo">
        <h1>
          <Link style={{ color: "#DAA520" }} to="/">
            {isAdmin ? "Admin" : "AZ Shop"}
          </Link>
        </h1>
      </div>

      <ul style={styleMenu}>
        <li>
          <Link to="/">{isAdmin ? "Products" : "Shop"}</Link>
        </li>

        {isAdmin && adminRouter()}
        {isLogged ? (
          loggedRouter()
        ) : (
          <li>
            <Link to="/login">Login or Register</Link>
          </li>
        )}

        <li>
          <img
            className="menu"
            src={Close}
            alt=""
            width="30px"
            onClick={toggleMenu}
          />
        </li>
      </ul>
      {isAdmin ? (
        ""
      ) : (
        <div className="cart-icon">
          <span>{cart.length}</span>
          <Link to="/cart">
            <img src={Cart} alt="" width="30" />
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
