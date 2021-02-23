import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import "./ProductDetails.css";
import ProductionItem from "../pages/products/production_item/ProductionItem";
import commaNumber from "comma-number";

const ProductDetails = () => {
  const params = useParams();
  const state = useContext(GlobalState);
  const [products] = state.productionAPI.products;
  const addCart = state.userAPI.addCart;
  const [detailsProduct, setDetailsProduct] = useState([]);
  const [isAdmin] = state.userAPI.isAdmin;

  useEffect(() => {
    if (params.id) {
      products.forEach((product) => {
        if (product._id === params.id) setDetailsProduct(product);
      });
    }
  }, [params, products]);

  if (detailsProduct.length === 0) return null;

  return (
    <>
      <div className="detail">
        <img src={detailsProduct.images.url} alt="" />
        <div className="box-detail">
          <div className="row">
            <h2>{detailsProduct.title}</h2>
            <h6>#{detailsProduct.product_id}</h6>
          </div>
          <span style={{ color: "red" }}>
            PRICE: ${commaNumber(detailsProduct.price)}
          </span>
          <p>{detailsProduct.description}</p>
          <p>{detailsProduct.content}</p>
          <p style={{ color: "darkblue" }}>Sold: {detailsProduct.sold}</p>
          {isAdmin ? (
            ""
          ) : (
            <Link
              to="/cart"
              className="cart"
              onClick={() => addCart(detailsProduct)}
            >
              Buy Now
            </Link>
          )}
        </div>
      </div>
      <div className="related_products">
        <h2>Related products</h2>
        <div className="products">
          {products.map((product) => {
            return product.category === detailsProduct.category ? (
              <ProductionItem key={product._id} product={product} />
            ) : null;
          })}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
