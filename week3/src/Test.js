import { useContext, useState, React, useEffect, useCallback } from "react";
import "./Test.css";
import { UserDataContext } from "./UserDataContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const { userData } = useContext(UserDataContext);

  const goToMain = () => {
    navigate("/Mainpage");
  };

  const questions = [
    "친구들이랑 홍대에서 놀때 지치기보다는 힘이 솟는 걸 느낀다",
    "'뭔지 알 것 같아'라는 말을 자주 한다",
    "10%확률로 5만원 잃거나 90%확률로 5만원 받기 vs 확실히 2만원 받기에서 후자를 선택한다",
    "시험공부를 항상 벼락치기로 한다",

    "누가 장기자랑 시키면 죽고싶다...",
    "불안함을 느낄 때가 거의 없다",
    "철학적인 질문에 대해 깊게 생각하는 일은 시간 낭비라고 생각한다",
    "자신보다 다른 사람에게 더 필요한 기회라고 생각되면 기회를 포기할 수도 있다",

    "마감 기한을 지키기가 힘들다",
    "관심사가 너무 많아 다음에 어떤 일을 해야 할지 모를 때가 있다",
    "단체 활동에 참여하는 일을 즐긴다",
    "유니세프 광고를 보고 솔직히 눈물 찔끔했다",
  ];

  const params = [
    ["E", 2, 1, 0, -1, -2],
    ["T", -2, -1, 0, 1, 2],
    ["P", -2, -1, 0, 1, 2],
    ["P", 2, 1, 0, -1, -2],

    ["E", -2, -1, 0, 1, 2],
    ["N", -2, -1, 0, 1, 2],
    ["N", -2, -1, 0, 1, 2],
    ["T", -2, -1, 0, 1, 2],

    ["P", 2, 1, 0, -1, -2],
    ["N", 2, 1, 0, -1, -2],
    ["E", 2, 1, 0, -1, -2],
    ["T", -2, -1, 0, 1, 2],
  ]



  const choices = ["매우 그렇다", "그렇다", "보통", "아니다", "매우 아니다"];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const handleButtonClick = (index, choice) => {
    let newAnswers = [...answers];
    newAnswers[index] = choice;
    setAnswers(newAnswers);
  };

  useEffect(() => {
    if (
      testm1 !== "tm1" &&
      testm2 !== "tm2" &&
      testm3 !== "tm3" &&
      testm4 !== "tm4" &&
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
          `${userData.nickname}님의 원래 MBTI는 ${userm1}${userm2}${userm3}${userm4}이고, 검사 결과 나온 MBTI도 ${testm1}${testm2}${testm3}${testm4}입니다`
        );
      } else {
        const isConfirmed = window.confirm(
          `${userData.nickname}님의 원래 MBTI는 ${userm1}${userm2}${userm3}${userm4}이고, 검사 결과 나온 MBTI는 ${testm1}${testm2}${testm3}${testm4}입니다. 바꾸시겠습니까?`
        );
      

        if (isConfirmed) {
          console.log(testm1, testm2, testm3, testm4, userData.nickname);
          axios.put(`${process.env.REACT_APP_server_uri}/user/${userData.nickname}`, {
            m1: testm1,
            m2: testm2,
            m3: testm3,
            m4: testm4,
          });
        }
      }
    }
  }, [testm1, testm2, testm3, testm4]);

  const calcMbti = () => {
    let e = 0;
    let n = 0;
    let t = 0;
    let p = 0;

    for(let i = 0; i < 12; i++) {
      if(params[i][0] === "E") {
        e += params[i][choices.indexOf(answers[i]) + 1];
      }
      if(params[i][0] === "N") {
        n += params[i][choices.indexOf(answers[i]) + 1];
      }
      if(params[i][0] === "T") {
        t += params[i][choices.indexOf(answers[i]) + 1];
      }
      if(params[i][0] === "P") {
        p += params[i][choices.indexOf(answers[i]) + 1];
      }
    }

    if(e >= 0) {
      setTestm1("E");
    }
    else {
      setTestm1("I");
    }
    if(n >= 0) {
      setTestm2("N");
    }
    else {
      setTestm2("S");
    }
    if(t >= 0) {
      setTestm3("T");
    }
    else {
      setTestm3("F");
    }
    if(p >= 0) {
      setTestm4("P");
    }
    else {
      setTestm4("J");
    }

  }

  const handleSubmit = () => {
    if (answers.includes("")) {
      alert("응답하지 않은 항목이 있습니다.");
    } else {
      setVars(vars + 1);
      setHasSubmitted(true);
      calcMbti();

    }
  };



  const fetchUserMBTI = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_server_uri}/user/${userData.nickname}`
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
