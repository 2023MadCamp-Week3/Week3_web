const express = require("express");
const app = express();
const pool = require("./db").promise(); // Add promise()
const cors = require("cors");

app.use(cors());
app.use(express.json()); // Enable JSON request body parsing

app.listen(4000, "0.0.0.0", () => {
  console.log("Server has started on port 4000");
});

// 회원가입 과정
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

// 로그인 과정.
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

// questions DB에 있는 모든 정보를 가져옴
app.get("/questions", async (req, res) => {
  try {
    const [questions] = await pool.query(
      "SELECT q.id, q.title, q.content, q.post_time, q.A1, q.A2, u.nickname as user_nickname FROM questions q INNER JOIN users u ON q.user_id = u.id"
    );
    res.json(questions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// 투표 관리
app.post("/vote", async (req, res) => {
  const { question_id, user_id, vote } = req.body;

  try {
    // Check if the user has already voted for this question
    const [votes] = await pool.query(
      "SELECT * FROM votes WHERE question_id = ? AND user_id = ?",
      [question_id, user_id]
    );

    if (votes.length > 0) {
      return res.status(400).json({ message: "이미 투표하셨습니다." });
    }

    await pool.query(
      "INSERT INTO votes (question_id, user_id, vote) VALUES (?, ?, ?)",
      [question_id, user_id, vote]
    );

    res.status(200).json({ message: "투표가 완료되었습니다." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// 질문의 투표 결과를 가져옴
app.get("/voteStats/:id", async (req, res) => {
  const question_id = req.params.id;

  try {
    const [stats] = await pool.query(
      `
      SELECT users.m1, users.m2, users.m3, users.m4, votes.vote, COUNT(*) as count
      FROM votes
      INNER JOIN users ON votes.user_id = users.id
      WHERE votes.question_id = ?
      GROUP BY users.m1, users.m2, users.m3, users.m4, votes.vote`,
      [question_id]
    );

    res.status(200).json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// 투표 결과 집계
app.get("/questions/:questionId/votes", async (req, res) => {
  try {
    const questionId = req.params.questionId;

    const [votes] = await pool.query(
      `
      SELECT u.m1, u.m2, u.m3, u.m4, v.vote
      FROM votes v
      JOIN users u ON v.user_id = u.id
      WHERE v.question_id = ?
    `,
      [questionId]
    );

    const voteCounts = {
      E: { yes: 0, no: 0 },
      I: { yes: 0, no: 0 },
      N: { yes: 0, no: 0 },
      S: { yes: 0, no: 0 },
      T: { yes: 0, no: 0 },
      F: { yes: 0, no: 0 },
      P: { yes: 0, no: 0 },
      J: { yes: 0, no: 0 },
    };

    votes.forEach((vote) => {
      const traits = [vote.m1, vote.m2, vote.m3, vote.m4];
      traits.forEach((trait) => {
        if (vote.vote === 1) voteCounts[trait].yes += 1;
        else voteCounts[trait].no += 1;
      });
    });

    res.json(voteCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//닉네임으로 user_id, m1, m2, m3, m4 가져오기
app.get("/user/:nickname", async (req, res) => {
  try {
    const nickname = req.params.nickname;
    const [users] = await pool.query(
      "SELECT id, m1, m2, m3, m4 FROM users WHERE nickname = ?",
      [nickname]
    );

    if (users.length > 0) {
      res.json({
        userId: users[0].id,
        m1: users[0].m1,
        m2: users[0].m2,
        m3: users[0].m3,
        m4: users[0].m4,
      });
    } else {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//새로운 질문 작성
app.post("/questions", async (req, res) => {
  try {
    const { user_id, post_time, content, title } = req.body;

    if (!(user_id && post_time && content && title)) {
      return res.status(400).json({
        message: "모든 내용을 작성해주세요.",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO questions (user_id, post_time, content, title) VALUES (?, ?, ?, ?)",
      [user_id, post_time, content, title]
    );

    res.json({
      message: "Question successfully posted!",
      questionId: result.insertId,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//
app.get("/questions/:questionId/vote/:userId", async (req, res) => {
  try {
    const { questionId, userId } = req.params;

    const [votes] = await pool.query(
      "SELECT * FROM votes WHERE question_id = ? AND user_id = ?",
      [questionId, userId]
    );

    if (votes.length > 0) {
      res.json(votes[0]);
    } else {
      res.json({ vote: null });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// MBTI 검사 결과로 자신의 MBTI를 수정
app.put("/user/:nickname", async (req, res) => {
  try {
    const nickname = req.params.nickname;
    const { m1, m2, m3, m4 } = req.body;

    const [users] = await pool.query(
      "UPDATE users SET m1 = ?, m2 = ?, m3 = ?, m4 = ? WHERE nickname = ?",
      [m1, m2, m3, m4, nickname]
    );

    if (users.affectedRows > 0) {
      res.json({ message: "MBTI 정보가 업데이트되었습니다." });
    } else {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// MBTI별 게시판 내용 가져오기
app.get("/boards/:mbti", (req, res) => {
  db.query(
    "SELECT * FROM boards WHERE mbti = ?",
    [req.params.mbti],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error });
      } else {
        res.json(results);
      }
    }
  );
});
