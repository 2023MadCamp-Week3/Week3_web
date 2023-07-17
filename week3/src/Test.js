import { useContext, useState, React, useEffect, useCallback } from "react";
import "./Test.css";
import { UserDataContext } from "./UserDataContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IPV4 = "10.10.22.236";

const Test = () => {
  const navigate = useNavigate();
  const [userm1, setUserm1] = useState("m1");
  const [userm2, setUserm2] = useState("m2");
  const [userm3, setUserm3] = useState("m3");
  const [userm4, setUserm4] = useState("m4");
  const [testm1, setTestm1] = useState("tm1");
  const [testm2, setTestm2] = useState("tm2");
  const [testm3, setTestm3] = useState("tm3");
  const [testm4, setTestm4] = useState("tm4");
  const [vars, setVars] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  /////

  const { userData, setUserData } = useContext(UserDataContext);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  /////

  const goToMain = () => {
    navigate("/Mainpage");
  };

  const questions = [
    "질문 1",
    "질문 2",
    "질문 3",
    "질문 4",
    "질문 5",
    "질문 6",
    "질문 7",
    "질문 8",
    "질문 9",
    "질문 10",
    "질문 11",
    "질문 12",
  ];

  const choices = ["매우 그렇다", "그렇다", "보통", "아니다", "매우 아니다"];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const handleButtonClick = (index, choice) => {
    let newAnswers = [...answers];
    newAnswers[index] = choice;
    setAnswers(newAnswers);
  };

  useEffect(() => {
    if (
      testm1 !== "" &&
      testm2 !== "" &&
      testm3 !== "" &&
      testm4 !== "" &&
      !answers.includes("") &&
      vars === 1
    ) {
      setVars(999);
      if (
        userData.m1 === testm1 &&
        userData.m2 === testm2 &&
        userData.m3 === testm3 &&
        userData.m4 === testm4
      ) {
        alert(
          `${userData.nickname}님의 원래 MBTI는 ${userm1}${userm2}${userm3}${userm4}이고, 검사 결과 나온 MBTI는 ${testm1}${testm2}${testm3}${testm4}입니다. 바꾸시겠습니까?`
        );
      } else {
        const isConfirmed = window.confirm(
          `${userData.nickname}님의 원래 MBTI는 ${userm1}${userm2}${userm3}${userm4}이고, 검사 결과 나온 MBTI도 ${testm1}${testm2}${testm3}${testm4}입니다`
        );

        if (isConfirmed) {
          axios.put(`http://${IPV4}:443/user/${userData.nickname}`, {
            m1: testm1,
            m2: testm2,
            m3: testm3,
            m4: testm4,
          });
        }
      }
    }
  }, [testm1, testm2, testm3, testm4, answers]);

  const handleSubmit = () => {
    if (answers.includes("")) {
      alert("응답하지 않은 항목이 있습니다.");
    } else {
      setVars(vars + 1);
      setTestm1("I");
      setTestm2("S");
      setTestm3("F");
      setTestm4("J");
      setHasSubmitted(true);
    }
  };

  const fetchUserMBTI = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://${IPV4}:443/user/${userData.nickname}`
      );
      setUserm1(response.data.m1);
      console.log(userm1);
      setUserm2(response.data.m2);
      console.log(userm2);
      setUserm3(response.data.m3);
      setUserm4(response.data.m4);
    } catch (err) {
      console.error(err);
    }
  }, [userData]);

  useEffect(() => {
    fetchUserMBTI();
  }, [fetchUserMBTI]);

  return (
    <div className="container">
      <button
        style={{ position: "absolute", top: 50, right: 50, borderRadius: 15 }}
        onClick={goToMain}
      >
        메인 페이지로 이동
      </button>
      <h1 style={{ textAlign: "center" }}>약식 MBTI 검사</h1>
      <div
        style={{
          overflow: "auto",
          maxHeight: "80vh",
          textAlign: "center",
          overflowY: "auto",
        }}
      >
        {questions.map((question, index) => (
          <div key={index}>
            <h3>{question}</h3>
            {choices.map((choice, choiceIndex) => (
              <button
                key={choiceIndex}
                onClick={() => handleButtonClick(index, choice)}
                style={{
                  backgroundColor:
                    answers[index] === choice ? "skyblue" : "#A4A4A4",
                  marginRight: 10,
                  marginBottom: 15,
                  borderRadius: 10,
                }}
              >
                {choice}
              </button>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        style={{
          marginTop: 10,
          borderRadius: 10,
          backgroundColor: hasSubmitted ? "darkgrey" : "blue",
        }}
        disabled={hasSubmitted}
      >
        답변 완료
      </button>
    </div>
  );
};

export default Test;
