import React from "react";
import BtnRender from "./BtnRender";
import commaNumber from "comma-number";
import { Link } from "react-router-dom";

const ProductionItem = ({ product, isAdmin, deleteProduct, handleCheck }) => {
  return (
    <div className="product_card">
      {isAdmin && (
        <input
          type="checkbox"
          checked={product.checked}
          onChange={() => handleCheck(product._id)}
        />
      )}
      <Link to={`/details/${product._id}`}>
        <img src={product.images.url} alt="" />
      </Link>
      <div className="product_box">
        <Link to={`/details/${product._id}`}>
          <h2 title={product.title}>{product.title}</h2>
        </Link>
        <span>${commaNumber(product.price)}</span>
        <p>{product.description}</p>
      </div>
      <BtnRender product={product} deleteProduct={deleteProduct} />
    </div>
  );
};

export default ProductionItem;
