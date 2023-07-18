import { useContext, useState, useCallback, useEffect, React } from "react";
import { useNavigate } from "react-router-dom";
import "./Mainpage.css";
import { UserDataContext } from "./UserDataContext";
import axios from "axios";

const IPV4 = "172.10.5.129";

const Profile = () => {
  const [userm1, setUserm1] = useState("");
  const [userm2, setUserm2] = useState("");
  const [userm3, setUserm3] = useState("");
  const [userm4, setUserm4] = useState("");
  const navigate = useNavigate();
  const goToMain = () => {
    navigate("/Mainpage");
  };
  const { userData, setUserData } = useContext(UserDataContext);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  const fetchUserMBTI = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_server_uri}/user/${userData.nickname}`
      );
      setUserm1(response.data.m1);
      setUserm2(response.data.m2);
      setUserm3(response.data.m3);
      setUserm4(response.data.m4);
    } catch (err) {
      console.error(err);
    }
  }, [userData]);

  useEffect(() => {
    fetchUserMBTI();
  }, [fetchUserMBTI]);

  const userMBTI = userm1 + userm2 + userm3 + userm4;

  console.log(userMBTI);

  return (
    <div className="profile-container" style={{height: "100vh"}}>
      <div className="column">
        <div className = "colorbox mbti white"
          style={{height: "10vw"}}
          onClick={goToMain}
        >
          {"<<"} 메인 페이지
        </div>
        <div className = "colorbox mbti blue" style={{height: "10vw"}}>내 프로필</div>
      </div>

      <div className="mbti not"></div>
      <div className="mbti not"></div>

      <div className="colorbox mbti yellow">
        <img
          src={`/Images/${userMBTI}.png`}
          alt={`${userMBTI} icon`}
          height={"100%"}
          width={"100%"}
        />
      </div>
      
      <div className="colorbox mbti red">내 MBTI : {userMBTI}</div>
      <div className="mbti not"></div>
      <div className = "colorbox mbti white" style={{width: "40vw"}}>내가 쓴 글</div>
      <div className = "colorbox mbti black" style={{width: "40vw"}}>내가 쓴 댓글</div>
    </div>
  );
};

export default Profile;
