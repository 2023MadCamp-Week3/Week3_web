import React, { useContext } from "react";
import "./Mainpage.css";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "./UserDataContext";

const Mainpage = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserDataContext);
  console.log("Console Test 1");
  const handleClick = (path) => {
    console.log(userData);
    console.log("Console Test 2");
    navigate(path, { state: { user: userData } });
  };

  return (
    <div className="container">
      <h1>메인 페이지</h1>
      <button
        className="bts"
        type="submit"
        onClick={() => handleClick("/questions")}
      >
        질문 리스트
      </button>
      <button
        className="bts"
        type="submit"
        onClick={() => handleClick("/test")}
      >
        MBTI 검사
      </button>
      <button
        className="bts"
        type="submit"
        onClick={() => handleClick("/board")}
      >
        게시판
      </button>
      <button
        className="bts"
        type="submit"
        onClick={() => handleClick("/profile")}
      >
        내 프로필
      </button>
    </div>
  );
};

export default Mainpage;
