const Product = require("../models/productModels");

class APIfeatures {
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }
  filtering() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    this.query.find(JSON.parse(queryStr));

    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

const productControllers = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Product.find(), req.query)
        .filtering()
        .sorting()
        .paginating();
      const products = await features.query;
      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createProducts: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        images,
        category,
      } = req.body;

      if (!images)
        return res.status(400).json({ msg: "No image found to upload" });

      const product = await Product.findOne({ product_id });
      if (product)
        return res.status(400).json({ msg: "This product already exists.." });

      const newProduct = new Product({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });

      const finalProduct = await newProduct.save();

      res.json({ msg: "Product created succesfully", finalProduct });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteProducts: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);

      res.json({ msg: "Product deleted succesfully" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateProducts: async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;

      if (!images)
        return res.status(400).json({ msg: "No image found to upload" });

      const product = await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        },
        { new: true }
      );

      res.status(200).json({ msg: "Updated successfully", product });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = productControllers;
