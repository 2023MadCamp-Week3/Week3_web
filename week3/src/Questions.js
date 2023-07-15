import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "./Questions.css";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";

const IPV4 = "143.248.195.86";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [userId, setUserId] = useState(1); // replace this with the actual logged in user's id
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
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state.user;
  console.log(userData);
  console.log("aaa");

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axios.get(`http://${IPV4}:4000/questions`);
      setQuestions(response.data);
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const fetchVoteCounts = async () => {
      if (!selectedQuestion) return;

      const response = await axios.get(
        `http://${IPV4}:4000/questions/${selectedQuestion.id}/votes`
      );
      setVoteCounts(response.data);
    };

    fetchVoteCounts();
  }, [selectedQuestion]);

  const handleClose = () => setShowModal(false);
  const handleShow = async (question) => {
    setSelectedQuestion(question);
    console.log("aaaa");
    const response = await axios.get(
      `http://${IPV4}:4000/questions/${question.id}/votes`
    );
    console.log(response.data);
    setVoteCounts(response.data);
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

  const vote = async (vote) => {
    try {
      await axios.post(`http://${IPV4}:4000/vote`, {
        question_id: selectedQuestion.id,
        user_id: userId,
        vote,
      });
      alert("투표가 완료되었습니다.");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="container">
      <h1>질문 리스트</h1>
      {questions.map((question) => (
        <div
          key={question.id}
          className="question"
          onClick={() => handleShow(question)}
        >
          <h2>{question.title}</h2>
          <p>
            {format(new Date(question.post_time), "yyyy-MM-dd HH:mm")} by{" "}
            {question.user_nickname}
          </p>
        </div>
      ))}
      {selectedQuestion && (
        <Modal show={showModal} onHide={handleClose}>
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
            <Button variant="primary" onClick={() => vote("Yes")}>
              Yes
            </Button>
            <Button variant="secondary" onClick={() => vote("No")}>
              No
            </Button>
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
                <h4>N</h4>
                <Bar yes={voteCounts.N.yes} no={voteCounts.N.no} />
              </div>
              <div style={{ flex: "0 0 45%", margin: "0 20px" }}>
                <h4>T</h4>
                <Bar yes={voteCounts.T.yes} no={voteCounts.T.no} />
              </div>
              <div style={{ flex: "0 0 45%" }}>
                <h4>P</h4>
                <Bar yes={voteCounts.P.yes} no={voteCounts.P.no} />
              </div>
              <div style={{ flex: "0 0 45%", margin: "0 20px" }}>
                <h4>I</h4>
                <Bar yes={voteCounts.I.yes} no={voteCounts.I.no} />
              </div>
              <div style={{ flex: "0 0 45%" }}>
                <h4>S</h4>
                <Bar yes={voteCounts.S.yes} no={voteCounts.S.no} />
              </div>
              <div style={{ flex: "0 0 45%", margin: "0 20px" }}>
                <h4>F</h4>
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
    </div>
  );
};

export default Questions;
