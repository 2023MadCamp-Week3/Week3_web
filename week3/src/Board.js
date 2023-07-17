import { useContext, useState, useEffect, React } from "react";
import "./Board.css";
import { UserDataContext } from "./UserDataContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Board = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [postModalIsOpen, setPostModalIsOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedMBTI, setSelectedMBTI] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);

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

  const openModal = async (mbti) => {
    setSelectedMBTI(mbti);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_server_uri}/boards/${mbti}`
      );
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openPostModal = (postId) => {
    setSelectedPostId(postId);
    setPostModalIsOpen(true);
  };

  const closePostModal = () => {
    setPostModalIsOpen(false);
  };

  const selectedPost = posts.find((post) => post.id === selectedPostId);

  return (
    <div className="container">
      <button
        style={{ position: "absolute", top: 50, right: 50, borderRadius: 15 }}
        onClick={goToMain}
      >
        메인 페이지로 이동
      </button>
      <h1>게시판</h1>
      <button onClick={() => openModal("E")}>E</button>
      <button onClick={() => openModal("I")}>I</button>
      <button onClick={() => openModal("N")}>N</button>
      <button onClick={() => openModal("S")}>S</button>
      <button onClick={() => openModal("T")}>T</button>
      <button onClick={() => openModal("F")}>F</button>
      <button onClick={() => openModal("P")}>P</button>
      <button onClick={() => openModal("J")}>J</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <h2>{selectedMBTI} 게시판</h2>
        {posts.map((post) => (
          <div key={post.id}>
            <button onClick={() => openPostModal(post.id)}>{post.title}</button>
          </div>
        ))}
        <button onClick={closeModal}>close</button>
      </Modal>

      <Modal
        isOpen={postModalIsOpen}
        onRequestClose={closePostModal}
        contentLabel="Post Modal"
      >
        {selectedPost && (
          <>
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.content}</p>
            <p>Written by: {selectedPost.user_id}</p>
          </>
        )}
        <button onClick={closePostModal}>닫기</button>
      </Modal>
    </div>
  );
};

export default Board;
