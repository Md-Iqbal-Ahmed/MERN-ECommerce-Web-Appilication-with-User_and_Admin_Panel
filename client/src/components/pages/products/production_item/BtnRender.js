import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";

const BtnRender = ({ product, deleteProduct }) => {
  const state = useContext(GlobalState);
  const [isAdmin] = state.userAPI.isAdmin;
  const addCart = state.userAPI.addCart;

  return (
    <div className="row_btn">
      {isAdmin ? (
        <>
          <Link
            style={{ background: "#e25445" }}
            id="btn_buy"
            to="#!"
            onClick={() => deleteProduct(product._id, product.images.public_id)}
          >
            Delete
          </Link>
          <Link
            style={{ background: "#45bfd6" }}
            id="btn_view"
            to={`/edit_product/${product._id}`}
          >
            Edit
          </Link>
        </>
      ) : (
        <>
          <Link id="btn_cart" to="#!" onClick={() => addCart(product)}>
            ADD TO CART
          </Link>
        </>
      )}
    </div>
  );
};

export default BtnRender;
