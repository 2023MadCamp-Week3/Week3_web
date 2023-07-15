import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import axios from "axios";
import { toast } from "react-toastify";

const IPV4 = "143.248.195.86";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      navigate("/Mainpage", { state: { user: userData } });
    }
  }, [userData, navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://${IPV4}:4000/login`, {
        email,
        password,
      });

      if (response.data.status === "ok") {
        setUserData(response.data);
        toast.success(`${response.data.nickname}님, 반갑습니다!`, {
          autoClose: 500,
        });

        setTimeout(() => {
          navigate("/Mainpage", { state: { user: userData } });
        }, 1000);
      } else {
        toast.error(response.data.message, {
          autoClose: 500,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("아이디와 비밀번호를 확인해주세요.");
    }
  };

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div className="container">
      <ToastContainer />
      <h1>너 T야?</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">로그인</button>
      </form>
      <button
        className="register-btn"
        type="submit"
        onClick={() => handleClick("/signup")}
      >
        회원 가입
      </button>
    </div>
  );
};

export default App;
