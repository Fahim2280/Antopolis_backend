const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Antopolis")

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", UserSchema);

app.get("/users", async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

app.post("/users", async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
    });
    const result = await user.save();
    res.json(result);
});

app.listen(port, () => {
  console.log(`Example app listening http://localhost:${port}`);
});
