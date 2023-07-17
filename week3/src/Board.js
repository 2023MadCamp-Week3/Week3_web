import { useContext, useState, useEffect, React } from "react";
import "./Board.css";
import { UserDataContext } from "./UserDataContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
const IPV4 = "143.248.195.86";

Modal.setAppElement("#root");

const Board = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedMBTI, setSelectedMBTI] = useState("");

  const goToMain = () => {
    navigate("/Mainpage");
  };

  /////

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

  /////

  const openModal = async (mbti) => {
    setSelectedMBTI(mbti);
    try {
      const response = await axios.get(`http://${IPV4}:4000/boards/${mbti}`);
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

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
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
        <button onClick={closeModal}>close</button>
      </Modal>
    </div>
  );
};

export default Board;
