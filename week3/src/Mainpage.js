import React from "react";
import "./Mainpage.css";
import { useNavigate, useLocation } from "react-router-dom";

const Mainpage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state.user;
  console.log(userData);
  console.log("aaa");

  const handleClick = (path) => {
    navigate(path, { state: { user: userData } });
  };

  return (
    <div className="container">
      <h1>메인 페이지</h1>
      <button type="submit" onClick={() => handleClick("/questions")}>
        질문 리스트
      </button>
      <button type="submit" onClick={() => handleClick("/test")}>
        MBTI 검사
      </button>
      <button type="submit" onClick={() => handleClick("/board")}>
        게시판
      </button>
      <button type="submit" onClick={() => handleClick("/profile")}>
        내 프로필
      </button>
    </div>
  );
};

export default Mainpage;
