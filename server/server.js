const express = require("express");
const app = express();
const pool = require("./db").promise(); // Add promise()
const cors = require("cors");

app.use(cors());
app.use(express.json()); // Enable JSON request body parsing

app.post("/signup", async (req, res) => {
  try {
    const { name, nickname, email, password, m1, m2, m3, m4 } = req.body;

    const [newUser] = await pool.query(
      "INSERT INTO users (name, nickname, email, pw, m1, m2, m3, m4) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, nickname, email, password, m1, m2, m3, m4]
    );

    res.json(newUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server has started on port 4000");
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND pw = ?",
      [email, password]
    );

    if (users.length > 0) {
      res.json({ status: "ok", nickname: users[0].nickname }); // users[0] will be the matched user
    } else {
      res.json({
        status: "error",
        message: "이메일과 비밀번호를 다시 확인해주세요.",
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
