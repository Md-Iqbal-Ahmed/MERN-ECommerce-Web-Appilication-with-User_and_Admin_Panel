import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../GlobalState";
import Loading from "../utils/loading/Loading";
import { useHistory, useParams } from "react-router-dom";

const initialState = {
  product_id: "",
  title: "",
  price: 0,
  description: "Put description here",
  content: "Put content here",
  category: "",
  _id: "",
};

const CreateProduct = () => {
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.categoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const history = useHistory();
  const params = useParams();
  const [products] = state.productionAPI.products;
  const [editOn, setEditOn] = useState(false);
  const [callback, setCallback] = state.productionAPI.callback;

  const styleImage = {
    display: images ? "block" : "none",
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You are not an Admin");
      const file = e.target.files[0];

      if (!file) return alert("File doesn't exist");

      if (file.size > 1024 * 1024) return alert("Size is too large");

      if (
        file.type !== "image/jpg" &&
        file.type !== "image/png" &&
        file.type !== "image/jpeg"
      )
        return alert("File format is incorrect");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setLoading(false);
      setImages(res.data);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleDestroy = async () => {
    try {
      if (!isAdmin) return alert("You are not an Admin");
      setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert("You are not an Admin");
      if (!images) return alert("Please select an image");

      if (editOn) {
        await axios.put(
          `/api/products/${product._id}`,
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
        alert("Product is Updated");
      } else {
        await axios.post(
          "/api/products",
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
        alert("Product is created");
      }
      setCallback(!callback);
      setImages(false);
      setProduct(initialState);
      history.push("/");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  useEffect(() => {
    if (params.id) {
      setEditOn(true);
      products.forEach((product) => {
        if (product._id === params.id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      setEditOn(false);
      setProduct(initialState);
      setImages(false);
    }
  }, [params.id, products]);

  return (
    <div className="create_product">
      <div className="upload">
        <input type="file" name="file" id="file_up" onChange={handleUpload} />
        {loading ? (
          <div id="file_img">
            <Loading />
          </div>
        ) : (
          <div id="file_img" style={styleImage}>
            <img src={images ? images.url : ""} alt="" />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="product_id">Product ID</label>
          <input
            type="text"
            name="product_id"
            id="product_id"
            required
            value={product.product_id}
            onChange={handleInputChange}
            disabled={product._id}
          />
        </div>
        <div className="row">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={product.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="row">
          <label htmlFor="price">price</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            value={product.price}
            onChange={handleInputChange}
          />
        </div>
        <div className="row">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            required
            value={product.description}
            rows="5"
            onChange={handleInputChange}
          />
        </div>
        <div className="row">
          <label htmlFor="content">Content</label>
          <textarea
            type="text"
            name="content"
            value={product.content}
            rows="7"
            onChange={handleInputChange}
          />
        </div>
        <div className="row">
          <label htmlFor="Category">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleInputChange}
          >
            <option value="">Please select a Category</option>
            {categories.map((category) => (
              <option name={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">{editOn ? "Update" : "Create"}</button>
      </form>
    </div>
  );
};

export default CreateProduct;
