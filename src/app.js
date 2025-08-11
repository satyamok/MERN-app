const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { userAuth } = require("./middlewares/auth");
const { validationSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const Post = require("./models/postSchema");
const Category = require("./models/categorySchema");

app.use(express.json());
app.use(cookieParser());

// Get all users (protected by JWT in cookie)

app.get("/profile", userAuth, async (req, res) => {
  try {
    console.log("User ID from JWT:", req.user._id);
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Create a new category
app.post("/categories", userAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating category", error: err.message });
  }
});

// Get all categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new post
app.post("/posts", userAuth, async (req, res) => {
  try {
    const { title, category, slug, body, image } = req.body;
    const post = new Post({
      title,
      category,
      slug,
      body,
      image: image || undefined, // will use default if not provided
    });
    await post.save();
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating post", error: err.message });
  }
});

// Get all posts (with category populated)
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("category");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Signup route
app.post("/signup", async (req, res) => {
  const validation = validationSignUpData(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ message: validation.message });
  }
  try {
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully hey", user });
  } catch (err) {
    res.status(500).json({ message: "Error saving user", error: err.message });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = await jwt.sign({ _id: user._id }, "medixify@2210");
    // Set JWT as cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false, // set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Connect to DB and start server
connectDB()
  .then(() => {
    console.log("connected to database");
    app.listen(7777, () => {
      console.log(`Server is running on port 7777`);
    });
  })
  .catch((err) => {
    console.error("database cannot be connected!!");
  });
