import React, { useContext } from "react";
import "./Mainpage.css";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "./UserDataContext";

const Mainpage = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserDataContext);
  const handleClick = (path) => {
    console.log(userData);
    navigate(path, { state: { user: userData } });
  };

  return (
    <div className="main-container">
      <div className="nav-container">
        <div className="entries" onClick={() => handleClick("/questions")} >Question List</div>
        <div className="entries" onClick={() => handleClick("/board")}>MBTI Lounge</div>
        <div className="entries" onClick={() => handleClick("/test")}>MBTI Test</div>
        <div className="entries" onClick={() => handleClick("/profile")}>My Profile</div>
      </div>

      <div className="line" style={{ height: "60vh" }}>
        <div className="column" >
          <div className="colorbox red" style={{ width: "25vw" }}>WHAT IS YOUR MBTI?</div>
          <div className="emptyline" />
          <div className="colorbox green" style={{ width: "25vw" }}>Welcome!</div>
        </div>
        <div className="row push">
          <div className="colorbox yellow" style={{ width: "10vw" }}></div>
          <div className="colorbox white" style={{ width: "55vw", fontSize: "80px" }}>MBTI<br/>TMI</div>
        </div>
      </div>

      <div className="emptyline" />

      <div className="line">
        <div className="colorbox blue" style={{ width: "30vw", fontSize: "5em" }}>MBTI<br/>TEST {" >>>"}</div>
        <div className="row">
          <div className="colorbox green" style={{ width: "15vw" }}>I<br/>lounge {" >"}</div>
          <div className="colorbox white" style={{ width: "15vw" }}>E<br/>lounge {" >"}</div>
          <div className="emptybox" />
          <div className="colorbox yellow" style={{ width: "15vw" }}>N<br/>lounge {" >"}</div>
          
        </div>
      </div>

      <div className="emptyline" />

      <div className="line" style={{ justifyContent: "space-between" }}>
        <div className="colorbox red" style={{ width: "15vw" }}>S<br/>lounge {" >"}</div>
        <div className="colorbox white" style={{ width: "35vw" }}>Other<br/>lounges {" >"}</div>
        <div className="colorbox blue" style={{ width: "50vw", fontSize: "50px" }}>TODAY'S QUESTION:<br/>WHAT'S YOUR FAVORITE FOOD?</div>
      </div>

      <footer>
        <div className="emptyline" />
        <div className="line" style={{ height: "20vh", color: "white", textAlign: "center", alignSelf: "center" }}>MadCamp, All rights reserved.</div>
      </footer>
    </div>

  );

  {/* return (
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
  ); */}
};

export default Mainpage;
