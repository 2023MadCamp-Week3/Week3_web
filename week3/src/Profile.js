import { useContext, useState, useCallback, useEffect, React } from "react";
import { useNavigate } from "react-router-dom";
import "./Mainpage.css";
import { UserDataContext } from "./UserDataContext";
import axios from "axios";
import Modal from "react-modal";

const Profile = () => {
  const [userm1, setUserm1] = useState("");
  const [userm2, setUserm2] = useState("");
  const [userm3, setUserm3] = useState("");
  const [userm4, setUserm4] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const navigate = useNavigate();
  const { userData } = useContext(UserDataContext);
  const goToMain = () => {
    navigate("/Mainpage");
  };

  const handlePostClick = async (postId, postType) => {
    try {
      const postRes = await axios.get(
        `${process.env.REACT_APP_server_uri}/post/${postType}/${postId}`
      );
      const commentsRes = await axios.get(
        `${process.env.REACT_APP_server_uri}/comments/${postType}/${postId}`
      );
      setModalContent({
        post: postRes.data,
        comments: commentsRes.data,
      });
      setModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

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

  // user's posts
  const [userPosts, setUserPosts] = useState([]);
  const fetchUserPosts = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_server_uri}/boards/${userData.nickname}`
      );
      setUserPosts(response.data);
      console.log(response.data);
      console.log(userData.nickname);
      console.log("111");
    } catch (err) {
      console.error(err);
    }
  }, [userData]);

  // user's question comments
  const [userQuestionComments, setUserQuestionComments] = useState([]);
  const fetchUserQuestionComments = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_server_uri}/comments_q/${userData.nickname}`
      );
      setUserQuestionComments(response.data);
      console.log(response.data);
      console.log(userData.nickname);
      console.log("222");
    } catch (err) {
      console.error(err);
    }
  }, [userData]);

  // user's board comments
  const [userBoardComments, setUserBoardComments] = useState([]);
  const fetchUserBoardComments = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_server_uri}/comments_b/${userData.nickname}`
      );
      setUserBoardComments(response.data);
      console.log(response.data);
      console.log(userData.nickname);
      console.log("333");
    } catch (err) {
      console.error(err);
    }
  }, [userData]);

  useEffect(() => {
    fetchUserPosts();
    fetchUserQuestionComments();
    fetchUserBoardComments();
  }, [fetchUserPosts, fetchUserQuestionComments, fetchUserBoardComments]);

  return (
    <div className="profile-container" style={{ height: "100vh" }}>
      <div className="column">
        <div
          className="colorbox mbti white"
          style={{ height: "10vw" }}
          onClick={goToMain}
        >
          {"<<"} 메인 페이지
        </div>
        <div className="colorbox mbti blue" style={{ height: "10vw" }}>
          내 프로필
        </div>
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
      <div className="colorbox mbti white" style={{ width: "40vw" }}>
        <h2>내가 쓴 글</h2>
        <ul>
          {userPosts.map((post) => (
            <li key={post.id} onClick={() => handlePostClick(post.id, "board")}>
              {post.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="colorbox mbti blue" style={{ width: "30vw" }}>
        <h2>내가 쓴 댓글(질문)</h2>
        <ul>
          {userQuestionComments.map((comment) => (
            <li
              key={comment.id}
              onClick={() => handlePostClick(comment.question_id, "question")}
            >
              {comment.content}
            </li>
          ))}
        </ul>
      </div>
      <div className="colorbox mbti black" style={{ width: "30vw" }}>
        <h2>내가 쓴 댓글(게시판)</h2>
        <ul>
          {userBoardComments.map((comment) => (
            <li
              key={comment.id}
              onClick={() => handlePostClick(comment.board_id, "board")}
            >
              {comment.content}
            </li>
          ))}
        </ul>
      </div>
      {modalContent && (
        <Modal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)}>
          <h2>{modalContent.post.title}</h2>
          <p>{modalContent.post.content}</p>
          <ul>
            {modalContent.comments.map((comment) => (
              <li key={comment.id}>{comment.content}</li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  );
};

export default Profile;
