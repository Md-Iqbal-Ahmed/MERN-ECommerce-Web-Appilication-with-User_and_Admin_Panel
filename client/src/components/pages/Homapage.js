import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Products from "../pages/products/Products";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Cart from "./cart/Cart";
import NotFound from "../utils/NotFound/NotFound";
import ProductDetails from "../product_details/ProductDetails";
import OrderHistory from "../order/OrderHistory";
import OrderDetails from "../order/OrderDetails";
import Categories from "../pages/categories/Categories";
import { GlobalState } from "../../GlobalState";
import CreateProduct from "../create_product/CreateProduct";

const Homapage = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;

  return (
    <Switch>
      <Route exact path="/" component={Products} />
      <Route exact path="/details/:id" component={ProductDetails} />
      <Route exact path="/login" component={isLogged ? NotFound : Login} />
      <Route
        exact
        path="/register"
        component={isLogged ? NotFound : Register}
      />
      <Route exact path="/cart" component={Cart} />
      <Route exact path="/product" component={Products} />
      <Route
        exact
        path="/history"
        component={isLogged ? OrderHistory : NotFound}
      />
      <Route
        exact
        path="/history/:id"
        component={isLogged ? OrderDetails : NotFound}
      />
      <Route
        exact
        path="/category"
        component={isAdmin ? Categories : NotFound}
      />
      <Route
        exact
        path="/edit_product/:id"
        component={isAdmin ? CreateProduct : NotFound}
      />

      <Route
        exact
        path="/create_product"
        component={isAdmin ? CreateProduct : NotFound}
      />

      <Route exact path="*" component={NotFound} />
    </Switch>
  );
};

export default Homapage;
