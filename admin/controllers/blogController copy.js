const Blog = require("../model/blog");
const { validationResult } = require("express-validator");

const addBlog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({ status: true, message: "Blog added.", blog });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: "Unable to add blog." });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({ order: [["createdAt", "DESC"]] });
    const decoded = blogs.map((blog) => {
      blog.images = blog.images;
      blog.tags = blog.tags;
      return blog;
    });
    res.status(200).json({ status: true, message: "OK", blogs: decoded });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve blogs." });
  }
};

const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    res.status(200).json({ status: true, message: "OK", blog });
  } catch (error) {
    res
      .status(400)
      .json({ status: false, message: "Unable to retrieve blog." });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Validation errors",
      errors: errors.array(),
    });
  }

  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    const updatedBlog = await blog.update(req.body);
    res
      .status(200)
      .json({ status: true, message: "Blog updated.", blog: updatedBlog });
  } catch (error) {
    res.status(400).json({ status: false, message: "Unable to update blog." });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ status: false, message: "Blog not found" });
    }

    await blog.destroy();
    res.status(200).json({ status: true, message: "Blog deleted." });
  } catch (error) {
    res.status(400).json({ status: false, message: "Unable to delete blog." });
  }
};

module.exports = {
  addBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
