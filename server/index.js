const express = require("express");
const Dao = require("./database/dao");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/register", async (req, res) => {
 try {
    const userData = req.body
    const dao = new Dao();
    const userInsertResult = await dao.insertUser(userData);

    if (!userInsertResult.success) {
      res.status(400).send(userInsertResult.errors);
      return;
    }

    const userAddressInsertResult = await dao.insertUserAddress(userData, userInsertResult.user_id);

    if (userInsertResult.success && userAddressInsertResult.success) {
      res.status(201).send("User registered successfully");
    } else {
      res.status(400).send(userAddressInsertResult.errors);
    }
 } catch (error) {
   console.log(error);
   res.status(500).send("Insert failed");
 }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const dao = new Dao();
    const authResult = await dao.authenticateUser(email, password);

    if (!authResult.success) {
      res.status(401).json(authResult.errors);
      return;
    }

    const token = jwt.sign(
      { 
        user_id: authResult.user.user_id, 
        email: authResult.user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: authResult.user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ general: "Login failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
