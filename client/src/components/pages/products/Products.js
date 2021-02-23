import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import ProductionItem from "./production_item/ProductionItem";
import "./products.css";
import Loading from "../../utils/loading/Loading";
import axios from "axios";
import Filter from "../../query_pages/Filter";
import LoadMore from "../products/load_more/LoadMore";

const Products = () => {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productionAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productionAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (id === product._id) {
        product.checked = !product.checked;
      }
    });
    setProducts([...products]);
  };

  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      const destroyImg = axios.post(
        "/api/destroy",
        { public_id },
        {
          headers: { Authorization: token },
        }
      );
      const deleteProducts = axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });
      await destroyImg;
      await deleteProducts;
      setCallback(!callback);
      setLoading(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const deleteAll = () => {
    if (window.confirm(`Are you sure to delete this products ?`))
      products.forEach((product) => {
        if (product.checked) {
          deleteProduct(product._id, product.images.public_id);
        }
      });
  };
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <>
      <Filter />
      {isAdmin && (
        <div className="delete-all">
          <span>Select All</span>
          <input type="checkbox" checked={isCheck} onChange={checkAll} />
          <button onClick={deleteAll}>Delete All</button>
        </div>
      )}
      <div className="products">
        {products.map((product) => {
          return (
            <ProductionItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
      </div>
      <LoadMore />
      {products.length === 0 && <Loading />}
    </>
  );
};

export default Products;
