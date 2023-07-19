import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mbti, setMbti] = useState({
    m1: "",
    m2: "",
    m3: "",
    m4: "",
  });

  const handleMbtiChange = (key, value) => {
    setMbti((prev) => ({ ...prev, [key]: value }));
  };

  const mbtiChoices = [
    { key: "m1", options: ["E", "I"] },
    { key: "m2", options: ["N", "S"] },
    { key: "m3", options: ["T", "F"] },
    { key: "m4", options: ["P", "J"] },
  ];

  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const goBacktoLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = { name, nickname, email, password, ...mbti };
      await axios.post(`${process.env.REACT_APP_server_uri}/signup`, userData);
      navigate("/");
      toast("회원 가입이 완료되었습니s다!", {
        autoClose: 500,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{height: "100vh", backgroundColor:"black"}}>
      <div className="stextbox yellow" style={{height: "5vw"}}>회원 가입</div>


      <form onSubmit={goBacktoLogin} style={{display: "flex", flexDirection: "row",}}>
        <div style={{width: "10vw"}}></div>
        <div className="column" style={{width: "40%"}}>
          <div className="input-group">
            <div for="name" className="inputsection white">
              <div className="stextbox blue">이름:</div>
              <input
                className="inputbox"
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
              />
            </div>
          </div>
          <div className="input-group">
            <div for="nickname" className="inputsection white">
            <div className="stextbox yellow">별명:</div>
              <input
                className="inputbox"
                type="text"
                id="nickname"
                value={nickname}
                onChange={handleNicknameChange}
              />
            </div>
          </div>
          <div className="input-group">
            <div for="email" className="inputsection white">
            <div className="stextbox white">이메일:</div>
              <input
                className="inputbox"
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
          </div>

          <div className="input-group">
            <div for="password" className="inputsection white">
            <div className="stextbox red">비밀번호:</div>
              <input
                className="inputbox"
                type="password"
                id="password"
                value={email}
                onChange={handlePasswordChange}
              />
            </div>
          </div>
        </div>

        <div className="stextbox"></div>

        <div className="column" style={{width: "40%"}}>
          <div className="stextbox yellow">
            MBTI를 선택해주세요.
          </div>
          {mbtiChoices.map((mbtiChoice) => (
            <div className="mbti-choice" key={mbtiChoice.key}>
              {mbtiChoice.options.map((option) => (
                <button
                  className={`mbti-option ${
                    mbti[mbtiChoice.key] === option ? "selected" : ""
                  }`}
                  key={option}
                  type="button"
                  onClick={() => handleMbtiChange(mbtiChoice.key, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          ))}

          <button className="stextbox blue" type="submit" style={{color: "black"}}>회원 가입 완료</button>
          
        </div>
        
        
      </form>
    </div>
  );
};

export default Signup;
