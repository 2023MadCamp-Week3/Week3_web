import { useContext, useState, useCallback, useEffect, React } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { UserDataContext } from "./UserDataContext";
import axios from "axios";
const IPV4 = "143.248.195.86";

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
        `http://${IPV4}:4000/user/${userData.nickname}`
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
  return (
    <div className="container">
      <button
        style={{ position: "absolute", top: 50, right: 50, borderRadius: 15 }}
        onClick={goToMain}
      >
        메인 페이지로 이동
      </button>
      <h1>내 프로필</h1>
      <img
        src={`/Images/${userMBTI}.png`}
        alt={`${userMBTI} icon`}
        width={100}
        height={100}
      />
      <p>내 MBTI : {userMBTI}</p>
      <p>내가 쓴 글</p>
      <p>내가 댓글 단 글</p>
    </div>
  );
};

export default Profile;
