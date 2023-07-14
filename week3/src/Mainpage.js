import React from "react";
import "./Mainpage.css";
import { useNavigate } from "react-router-dom";

const Mainpage = () => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
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
