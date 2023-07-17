import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import axios from "axios";
import { toast } from "react-toastify";
import { UserDataContext, UserDataProvider } from "./UserDataContext";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userData, setUserData } = useContext(UserDataContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      console.log("--UserData--");
      console.log(userData);

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
      const response = await axios.post(`${process.env.server_uri}/login`, {
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
    <UserDataProvider>
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
          <button className="buttt" type="submit">
            로그인
          </button>
        </form>
        <button
          className="register-btn"
          type="submit"
          onClick={() => handleClick("/signup")}
        >
          회원 가입
        </button>
      </div>
    </UserDataProvider>
  );
};

export default App;
