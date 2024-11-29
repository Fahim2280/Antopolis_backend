const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

// Initialize app and middleware
const app = express();
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/animalDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define schemas
const animalSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
});

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
});

// Define models
const Animal = mongoose.model("Animal", animalSchema);
const Category = mongoose.model("Category", categorySchema);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });


app.get("/animals", async (req, res) => {
  try {
    const animals = await Animal.find();
    res.status(200).json(animals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch animals" });
  }
});

// GET API: Fetch all categories
app.post("/animals", async (req, res) => {
  const { Name, category, image } = req.body;
  console.log("Received data:", req.body); // Log received data

  if (!Name || !category || !image) {
    return res
      .status(400)
      .json({ error: "Name, category, and image are required" });
  }

  const animal = new Animal({ Name, category, image });

  try {
    const savedAnimal = await animal.save();
    res
      .status(200)
      .json({ message: "Animal data received and saved", data: savedAnimal });
  } catch (err) {
    console.error("Error saving animal data:", err);
    res.status(500).json({ error: "Failed to save animal data" });
  }
});

// POST API: Add new category
app.post("/categories", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }

  try {
    const newCategory = new Category({ name });
    await newCategory.save();
    res
      .status(201)
      .json({ message: "Category added successfully", category: newCategory });
  } catch (err) {
    res.status(500).json({ error: "Failed to add category" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
