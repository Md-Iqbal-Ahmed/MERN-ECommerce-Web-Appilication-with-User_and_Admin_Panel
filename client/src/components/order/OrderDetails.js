import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../GlobalState";
import { useParams } from "react-router-dom";
import commaNumber from "comma-number";

const OrderDetails = () => {
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;
  const [OrderDetails, setOrderDetails] = useState([]);

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      history.forEach((item) => {
        if (item._id === params.id) setOrderDetails(item);
      });
    }
  }, [params.id, history]);

  console.log(OrderDetails);

  if (OrderDetails.length === 0) return null;

  return (
    <div className="history-page">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Postal code</th>
            <th>Country Code</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{OrderDetails.address.recipient_name}</td>
            <td>
              {OrderDetails.address.line1 + " " + OrderDetails.address.city}
            </td>
            <td>{OrderDetails.address.postal_code}</td>
            <td>
              {OrderDetails.address.state +
                " " +
                OrderDetails.address.country_code}
            </td>
          </tr>
        </tbody>
      </table>
      <table style={{ margin: "30px 0px" }}>
        <thead>
          <tr>
            <th></th>
            <th>Products</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {OrderDetails.cart.map((item) => (
            <tr key={item._id}>
              <td>
                <img src={item.images.url} alt="" />
              </td>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>${commaNumber(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetails;
