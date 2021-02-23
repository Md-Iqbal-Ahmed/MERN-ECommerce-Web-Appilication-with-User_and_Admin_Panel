import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import commaNumber from "comma-number";
import axios from "axios";
import PaypalButton from "./PaypalButton";

const Cart = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [cart, setCart] = state.userAPI.cart;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);
      setTotal(total);
    };

    getTotal();
  }, [cart]);

  const addtoCart = async (cart) => {
    await axios.patch(
      "/user/addcart",
      { cart },
      { headers: { Authorization: token } }
    );
  };

  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });
    setCart([...cart]);
    addtoCart(cart);
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });
    setCart([...cart]);
    addtoCart(cart);
  };

  const removeProduct = (id) => {
    if (window.confirm("Do you want to delete this product?")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });
      setCart([...cart]);
      addtoCart(cart);
    }
  };

  const transSuccess = async (payment) => {
    const { paymentID, address } = payment;

    await axios.post(
      "/api/payment",
      { cart, paymentID, address },
      { headers: { Authorization: token } }
    );

    setCart([]);
    addtoCart([]);
    alert("You have successfully placed an order");
  };

  if (cart.length === 0)
    return (
      <h2 style={{ textAlign: "center", fontSize: "5rem" }}>Cart is Empty</h2>
    );

  return (
    <div>
      {cart.map((product) => (
        <div className="detail cart" key={product._id}>
          <img src={product.images.url} alt="" />
          <div className="box-detail">
            <div className="row">
              <h2>{product.title}</h2>
            </div>
            <span style={{ color: "red" }}>
              PRICE: ${commaNumber(product.price * product.quantity)}
            </span>
            <p>{product.description}</p>
            <p>{product.content}</p>

            <div className="amount">
              <button onClick={() => decrement(product._id)}> - </button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}> + </button>
            </div>
            <div className="delete" onClick={() => removeProduct(product._id)}>
              X
            </div>
          </div>
        </div>
      ))}
      <div className="total">
        <h3>Total: ${commaNumber(total)}</h3>
        <PaypalButton total={total} transSuccess={transSuccess} />
      </div>
    </div>
  );
};

export default Cart;
