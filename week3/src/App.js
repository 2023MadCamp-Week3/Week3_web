import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import axios from "axios";
import { toast } from "react-toastify";
import { UserDataContext, UserDataProvider } from "./UserDataContext";

const IPV4 = "172.10.5.129";

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
      const response = await axios.post(`${process.env.REACT_APP_server_uri}/login`, {
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
      <div className="login-container">
        <ToastContainer />
        <div className="main-img" style={{width:"30vw"}}>
          {/* <img className="darkimg"
            src="https://image.ytn.co.kr/osen/2015/03/201503302138778017_5519456b69f38.jpg"
            style={{width: "100%" }}
            >
          </img> */}
          <h1 className="img-text">너 T야?</h1>
        </div>
        
        <div className="textbox black" style={{width:"70vw", height: "100vh",padding:"0"}}>

          <div className="sline">
            <div className="textbox blue" style={{width: "25vh"}}/>
            <div className="textbox black"/>
            <div className="textbox yellow" style={{width: "25vh"}}/>
            <div className="textbox red" style={{width: "25vh"}}/>
          </div>
          <form onSubmit={handleSubmit}>
            
            <div className="sline">
              <div className="textbox white" style={{width: "25vh"}}/>
              <label className="textbox red" htmlFor="email" style={{display:"block"}}>이메일{">>>"}</label>
              
              <input
                style={{width: "50vh"}}
                className="white"
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="sline">
              <div className="textbox black"/>
              <label className="textbox blue" htmlFor="password">비밀번호{">>>"}</label>
              <input
                style={{width: "50vh"}}
                className="white"
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>

            <div className="sline">
              <div className="textbox white"/>
              <button className="textbox yellow" type="submit"
                >
                로그인
              </button>
              <div className="textbox black"/>
              <div 
                  className="textbox white"
                  type="submit"
                  onClick={() => handleClick("/signup")}
                >
                  회원 가입
              </div>
            </div>
            
          </form>
        </div>
      </div>
    </UserDataProvider>
  );
};

export default App;
