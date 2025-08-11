const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  slug: { type: String, required: true, unique: true },
  body: { type: String, required: true },
  image: { type: String, default: "https://via.placeholder.com/300" },
});

module.exports = mongoose.model("Post", postSchema);
