const express = require("express");
const app = express();
const pool = require("./db").promise();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || 4000, () => {
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
  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
  try {
    const { user_id, post_time, content, title, A1, A2 } = req.body;

    if (!(user_id && post_time && content && title && A1 && A2)) {
      return res.status(400).json({
        message: "모든 내용을 작성해주세요.",
      });
    }

    const [result] = await pool.query(
      "INSERT INTO questions (user_id, post_time, content, title, A1, A2) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, formattedDate, content, title, A1, A2]
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
app.get("/boards/:mbti", async (req, res) => {
  try {
    const { mbti } = req.params;
    const [boards] = await pool.query("SELECT * FROM boards WHERE mbti = ?", [
      mbti,
    ]);
    for (let board of boards) {
      await pool.query("UPDATE boards SET views = views + 1 WHERE id = ?", [
        board.id,
      ]);
    }
    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// 게시판 댓글 내용 가져오기
app.get("/comments/:boardId", async (req, res) => {
  try {
    const { boardId } = req.params;
    const [comments] = await pool.query(
      "SELECT * FROM comments_b WHERE board_id = ?",
      [boardId]
    );
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// 게시판 댓글 생성하기
app.post("/comments", async (req, res) => {
  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
  try {
    const { boardId, userId, content } = req.body;
    const [result] = await pool.query(
      "INSERT INTO comments_b (board_id, user_id, post_time, content) VALUES (?, ?, ?, ?)",
      [boardId, userId, formattedDate, content]
    );
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// 질문 댓글 내용 가져오기
app.get("/comments_q/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;
    const [comments] = await pool.query(
      "SELECT * FROM comments_q WHERE question_id = ?",
      [questionId]
    );
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// 질문 댓글 생성하기
app.post("/comments_q", async (req, res) => {
  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
  try {
    const { questionId, userId, content } = req.body;
    const [result] = await pool.query(
      "INSERT INTO comments_q (question_id, user_id, post_time, content) VALUES (?, ?, ?, ?)",
      [questionId, userId, formattedDate, content]
    );
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

//새로운 게시글 작성
app.post("/boards", async (req, res) => {
  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
  try {
    const { userId, title, content, mbti } = req.body;
    const zeroview = 0;
    if (!(userId && title && content && mbti)) {
      return res.status(400).json({
        message: "모든 내용을 작성해주세요.",
      });
    }

    const post_time = new Date().toISOString().slice(0, 19).replace("T", " ");
    const [result] = await pool.query(
      "INSERT INTO boards (user_id, mbti, post_time, title, content, views) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, mbti, formattedDate, title, content, zeroview]
    );

    res.json({
      message: "Post successfully posted!",
      postId: result.insertId,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get user's posts
app.get("/boards/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query("SELECT * FROM boards WHERE user_id = ?", [
      userId,
    ]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get user's question comments
app.get("/comments_q/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows2] = await pool.query(
      "SELECT * FROM comments_q WHERE user_id = ?",
      [userId]
    );
    res.json(rows2);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get user's board comments
app.get("/comments_b/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows3] = await pool.query(
      "SELECT * FROM comments_b WHERE user_id = ?",
      [userId]
    );
    res.json(rows3);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server Error" });
  }
});
