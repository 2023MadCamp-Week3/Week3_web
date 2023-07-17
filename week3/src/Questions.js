import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "./Questions.css";
import { format } from "date-fns";
import { UserDataContext } from "./UserDataContext";
import { useNavigate } from "react-router-dom";

const Questions = () => {
  const navigate = useNavigate();
  const goToMain = () => {
    navigate("/Mainpage");
  };
  const { userData } = useContext(UserDataContext);
  const [questions, setQuestions] = useState([]);
  const [userId, setUserId] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [voteCounts, setVoteCounts] = useState({
    E: { yes: 0, no: 0 },
    I: { yes: 0, no: 0 },
    N: { yes: 0, no: 0 },
    S: { yes: 0, no: 0 },
    T: { yes: 0, no: 0 },
    F: { yes: 0, no: 0 },
    P: { yes: 0, no: 0 },
    J: { yes: 0, no: 0 },
  });
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "" });
  const [userVote, setUserVote] = useState(null);

  const handleWriteShow = () => {
    setShowWriteModal(true);
  };

  const handleWriteClose = () => {
    setShowWriteModal(false);
  };

  const handleWriteComplete = async () => {
    try {
      await axios.post(`${process.env.server_uri}/questions`, {
        user_id: userId,
        post_time: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        ...newQuestion,
      });

      alert("글 작성이 완료되었습니다.");

      setShowWriteModal(false);
      setNewQuestion({ title: "", content: "" });
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const fetchUserId = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.server_uri}/user/${userData.nickname}`
      );
      setUserId(response.data.userId);
      console.log(userId);
    } catch (err) {
      console.error(err);
    }
  }, [userData]);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axios.get(`${process.env.server_uri}/questions`);
      setQuestions(response.data);
    };

    fetchQuestions();
  }, []);

  const fetchVoteCounts = async () => {
    if (!selectedQuestion) return;

    const response = await axios.get(
      `${process.env.server_uri}/questions/${selectedQuestion.id}/votes`
    );
    setVoteCounts(response.data);
  };

  useEffect(() => {
    fetchVoteCounts();
  }, [selectedQuestion]);

  const handleClose = () => setShowModal(false);
  const handleShow = async (question) => {
    setSelectedQuestion(question);
    const response = await axios.get(
      `${process.env.server_uri}/questions/${question.id}/votes`
    );
    setVoteCounts(response.data);
    const voteResponse = await axios.get(
      `${process.env.server_uri}/questions/${question.id}/vote/${userId}`
    );

    setUserVote(voteResponse.data.vote || null);

    setShowModal(true);
  };

  const Bar = ({ yes, no }) => {
    const total = yes + no;
    const yesWidth = total > 0 ? (yes / total) * 100 : 0;
    const noWidth = total > 0 ? (no / total) * 100 : 0;

    return (
      <div style={{ margin: "10px 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 20,
            backgroundColor: "#ddd",
          }}
        >
          <div
            style={{
              width: `${yesWidth}%`,
              backgroundColor: "#01DF74",
              height: "100%",
            }}
          />
          <div
            style={{
              width: `${noWidth}%`,
              backgroundColor: "red",
              height: "100%",
            }}
          />
        </div>
        <p style={{ textAlign: "center" }}>
          {`${yesWidth.toFixed(0)}% vs ${noWidth.toFixed(0)}%`}
        </p>
      </div>
    );
  };

  const vote = async (voteValue) => {
    try {
      await axios.post(`${process.env.server_uri}/vote`, {
        question_id: selectedQuestion.id,
        user_id: userId,
        vote: voteValue === "1번" ? 1 : 2,
      });
      alert("투표가 완료되었습니다.");
      setUserVote(voteValue === "1번" ? 1 : 2);
      fetchVoteCounts();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="container">
      <button
        style={{ position: "absolute", top: 50, right: 50, borderRadius: 15 }}
        onClick={goToMain}
      >
        메인 페이지로 이동
      </button>
      <h1
        style={{
          textAlign: "center",
        }}
      >
        [질문 리스트]
      </h1>
      <div
        style={{
          textAlign: "left",
          overflowY: "auto",
          maxHeight: "700px",
        }}
      >
        {questions.map((question) => (
          <div
            className="questions"
            key={question.id}
            onClick={() => handleShow(question)}
            style={{
              marginTop: 20,
            }}
          >
            <h2>{question.title}</h2>
            <p>
              {format(new Date(question.post_time), "yyyy-MM-dd HH:mm")} by{" "}
              {question.user_nickname}
            </p>
          </div>
        ))}
      </div>
      <div>
        <Button onClick={handleWriteShow}>글 쓰기</Button>
      </div>
      {selectedQuestion && (
        <Modal show={showModal} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedQuestion.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {`${format(
                new Date(selectedQuestion.post_time),
                "yyyy-MM-dd HH:mm"
              )} by ${selectedQuestion.user_nickname}`}
            </p>
            <p>{selectedQuestion.content}</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button
                className={`bt1 ${userVote === 1 ? "voted" : ""}`}
                variant={userVote === 1 ? "success" : "primary"}
                onClick={() => vote("1번")}
                disabled={userVote !== null}
              >
                1번 : {selectedQuestion.A1}
              </Button>
              <Button
                className={`bt2 ${userVote === 2 ? "voted" : ""}`}
                variant={userVote === 2 ? "danger" : "secondary"}
                onClick={() => vote("2번")}
                disabled={userVote !== null}
              >
                2번 : {selectedQuestion.A2}
              </Button>

              {userVote !== null && <p>이미 투표하셨습니다.</p>}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                textAlign: "center",
              }}
            >
              <div style={{ flex: "0 0 45%", margin: "0 20px" }}>
                <h4>E</h4>
                <Bar yes={voteCounts.E.yes} no={voteCounts.E.no} />
              </div>
              <div style={{ flex: "0 0 45%" }}>
                <h4>I</h4>
                <Bar yes={voteCounts.N.yes} no={voteCounts.N.no} />
              </div>
              <div style={{ flex: "0 0 45%", margin: "0 20px" }}>
                <h4>N</h4>
                <Bar yes={voteCounts.T.yes} no={voteCounts.T.no} />
              </div>
              <div style={{ flex: "0 0 45%" }}>
                <h4>S</h4>
                <Bar yes={voteCounts.P.yes} no={voteCounts.P.no} />
              </div>
              <div style={{ flex: "0 0 45%", margin: "0 20px" }}>
                <h4>T</h4>
                <Bar yes={voteCounts.I.yes} no={voteCounts.I.no} />
              </div>
              <div style={{ flex: "0 0 45%" }}>
                <h4>F</h4>
                <Bar yes={voteCounts.S.yes} no={voteCounts.S.no} />
              </div>
              <div style={{ flex: "0 0 45%", margin: "0 20px" }}>
                <h4>P</h4>
                <Bar yes={voteCounts.F.yes} no={voteCounts.F.no} />
              </div>
              <div style={{ flex: "0 0 45%" }}>
                <h4>J</h4>
                <Bar yes={voteCounts.J.yes} no={voteCounts.J.no} />
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}

      {showWriteModal && (
        <Modal show={showWriteModal} onHide={handleWriteClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>새 질문 작성</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>
              제목:
              <input
                type="text"
                value={newQuestion.title}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, title: e.target.value })
                }
              />
            </label>
            <p></p>
            <label>
              내용:
              <textarea
                value={newQuestion.content}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, content: e.target.value })
                }
              />
            </label>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleWriteClose}>
              취소
            </Button>
            <Button variant="primary" onClick={handleWriteComplete}>
              작성 완료
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Questions;
