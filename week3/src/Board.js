import { useContext, useState, useEffect, React } from "react";
import "./Mainpage.css";
import { UserDataContext } from "./UserDataContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import BoardModal from "./BoardModal";

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
    <div className="board-container">
      <div className="emptyline" style={{ backgroundColor: "green" }} />

      <div className="colorbox mbti white" onClick={goToMain}>
        {"<<"} 메인 페이지
      </div>
      <div className="mbti black"></div>
      <div className="colorbox mbti yellow" onClick={() => openModal("E")}>
        E
      </div>
      <div className="mbti black"></div>
      <div className="colorbox mbti blue">게시판</div>
      <div className="colorbox mbti red" onClick={() => openModal("N")}>
        N
      </div>
      <div className="mbti black"></div>
      <div className="colorbox mbti green" onClick={() => openModal("T")}>
        T
      </div>
      <div className="colorbox mbti lavender" onClick={() => openModal("P")}>
        P
      </div>
      <div className="mbti black"></div>
      <div className="colorbox mbti white" onClick={() => openModal("I")}>
        I
      </div>
      <div className="colorbox mbti blue" onClick={() => openModal("S")}>
        S
      </div>
      <div className="mbti black"></div>
      <div className="colorbox mbti yellow" onClick={() => openModal("F")}>
        F
      </div>
      <div className="colorbox mbti red" onClick={() => openModal("J")}>
        J
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <BoardModal
          selectedMBTI={selectedMBTI}
          posts={posts}
          openPostModal={openPostModal}
          closeModal={closeModal}
        />
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
            <p>글쓴이 : {selectedPost.user_id}</p>
            <p>조회수 : {selectedPost.views}</p>
            <p>{new Date(selectedPost.post_time).toLocaleString()}</p>
          </>
        )}
        <button onClick={closePostModal}>닫기</button>
      </Modal>
    </div>
  );
};

export default Board;
