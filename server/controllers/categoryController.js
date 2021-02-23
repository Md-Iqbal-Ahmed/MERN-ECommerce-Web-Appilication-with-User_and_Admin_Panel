const Category = require("../models/CategoryModels");
const Products = require("../models/productModels");

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createCategories: async (req, res) => {
    try {
      const { name } = req.body;

      const category = await Category.findOne({ name });

      if (category) return res.status(400).json({ msg: "Category exists" });

      const newCategory = new Category({ name });

      const finalCategory = await newCategory.save();

      res.json({ msg: "Category created successfully", finalCategory });
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  },
  deleteCategories: async (req, res) => {
    try {
      const products = await Products.findOne({ category: req.params.id });
      if (products)
        return res.status(400).json({
          msg: "Please delete all products with a relationship.",
        });

      await Category.findByIdAndDelete(req.params.id);

      res.json({ msg: "Succesfully deleted the category" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  editCategories: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOneAndUpdate(
        { _id: req.params.id },
        { name },
        { new: true }
      );

      if (!category)
        return res.status(400).json({ msg: "Category is not found" });

      res.json({ msg: "Updated the Category successfully", category });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = categoryController;
