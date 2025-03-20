import express from "express";
import Dao from "./database/dao.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/register", async (req, res) => {
  try {
    const userData = req.body;
    const dao = new Dao();
    const userInsertResult = await dao.insertUser(userData);

    if (!userInsertResult.success) {
      res.status(400).send(userInsertResult.errors);
      return;
    }

    const userAddressInsertResult = await dao.insertUserAddress(
      userData,
      userInsertResult.user_id
    );

    if (userInsertResult.success && userAddressInsertResult.success) {
      res
        .status(201)
        .send(
          "User registered successfully" +
            "user_id: " +
            userInsertResult.user_id +
            "address_id: " +
            userAddressInsertResult.address_id
        );
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
    const userData = req.body;
    const dao = new Dao();
    const user = await dao.getUserByEmail(userData.email);
    if (!user) {
      res.status(400).send("User not found");
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password_hash
    );
    if (!isPasswordValid) {
      res.status(400).send("Invalid password");
      return;
    }

    const token = jwt.sign(
      { user_id: user.id },
      process.env.JWT_SECRET || "urbanloft"
    );
    return res.status(200).json({ token : token });
  } catch (error) {
    console.log(error);
    res.status(500).send("Login failed");
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
