import React, { useState, useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";

const Categories = () => {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [category, setCategory] = useState("");
  const [token] = state.token;
  const [callback, setCallback] = state.categoriesAPI.callback;
  const [Id, setId] = useState("");
  const [onEdit, setEditOn] = useState(false);

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const res = await axios.put(
          `/api/category/${Id}`,
          { name: category },
          {
            headers: { Authorization: token },
          }
        );

        alert(res.data.msg);
      } else {
        const res = await axios.post(
          "/api/category",
          { name: category },
          {
            headers: { Authorization: token },
          }
        );

        alert(res.data.msg);
      }
      setEditOn(false);
      setCallback(!callback);
      setCategory("");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const editHandle = async (id, name) => {
    setId(id);
    setCategory(name);
    setEditOn(true);
  };

  const deleteHandle = async (id) => {
    try {
      const res = await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: token },
      });

      alert(res.data.msg);
      setCallback(!callback);
    } catch (err) {
      alert(err.res.data.msg);
    }
  };

  return (
    <div className="categories">
      <form onSubmit={createCategory}>
        <label htmlFor="category">Category</label>
        <input
          type="text"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <button
          style={{
            background: "#5FC5D7",
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "1.2px",
          }}
          type="submit"
        >
          {onEdit ? "Update" : "Save"}
        </button>
      </form>
      <div className="col">
        {categories.map((category) => (
          <div className="row" key={category._id}>
            <p>{category.name}</p>
            <div>
              <button
                style={{
                  background: "#78C98D",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                }}
                onClick={() => editHandle(category._id, category.name)}
              >
                Edit
              </button>
              <button
                style={{
                  background: "#C85A5A",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                }}
                onClick={() => deleteHandle(category._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
