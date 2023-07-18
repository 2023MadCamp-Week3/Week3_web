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
    <div className="container">
      <h1>회원 가입</h1>
      <form onSubmit={goBacktoLogin}>
        <div className="input-group">
          <label htmlFor="name">이름:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="nickname">별명:</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={handleNicknameChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
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
        <button type="submit">회원 가입 완료</button>
      </form>
    </div>
  );
};

export default Signup;
