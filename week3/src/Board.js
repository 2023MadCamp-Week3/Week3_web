import { useContext, useState, useEffect, React } from "react";
import "./Mainpage.css";
import { UserDataContext } from "./UserDataContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import BoardModal from "./BoardModal";
<<<<<<< HEAD

const IPV4 = "172.10.5.129";
=======
>>>>>>> a9c009b310c5e6a34362a13ad32d6542cafe0f1b

Modal.setAppElement("#root");

const Board = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [postModalIsOpen, setPostModalIsOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedMBTI, setSelectedMBTI] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const goToMain = () => {
    navigate("/Mainpage");
  };

  const { userData, setUserData } = useContext(UserDataContext);

  useEffect(() => {
    if (selectedPostId) {
      axios
        .get(`${process.env.REACT_APP_server_uri}/comments/${selectedPostId}`)
        .then((res) => {
          setComments(res.data);
        });
    }
  }, [selectedPostId]);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);

  const handleCommentSubmit = () => {
    axios
      .post(`${process.env.REACT_APP_server_uri}/comments`, {
        boardId: selectedPostId,
        userId: userData.nickname,
        content: newComment,
      })
      .then((res) => {
        setComments([
          ...comments,
          {
            board_id: selectedPostId,
            user_id: userData.nickname,
            post_time: new Date(),
            content: newComment,
          },
        ]);
        setNewComment("");
      });
  };

  const openModal = async (mbti) => {
    setSelectedMBTI(mbti);
    try {
<<<<<<< HEAD
      const response = await axios.get(`${process.env.REACT_APP_server_uri}/boards/${mbti}`);
=======
      const response = await axios.get(
        `${process.env.REACT_APP_server_uri}/boards/${mbti}`
      );
>>>>>>> a9c009b310c5e6a34362a13ad32d6542cafe0f1b
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

  const createPost = (newPost) => {
    console.log(userData.nickname);
    console.log(selectedMBTI);
    console.log(newPost);
    axios
      .post(`${process.env.REACT_APP_server_uri}/boards`, {
        userId: userData.nickname,
        mbti: selectedMBTI,
        ...newPost,
      })
      .then((res) => {
        setPosts([
          ...posts,
          {
            id: res.data.postId,
            user_id: userData.nickname,
            post_time: new Date(),
            ...newPost,
          },
        ]);
      });
  };

  const selectedPost = posts.find((post) => post.id === selectedPostId);

  return (
    <div className="board-container">
<<<<<<< HEAD

      <div className="emptyline" style={{backgroundColor: "green"}}/>

      <div className="colorbox mbti white"
        onClick={goToMain}
      >
        {"<<"} 메인 페이지
      </div>
      <div className="mbti black"></div>
      <div className="colorbox mbti yellow" onClick={() => openModal("E")}>E</div>
      <div className="mbti black"></div>
      <div className="colorbox mbti blue">게시판</div>
      <div className="colorbox mbti red" onClick={() => openModal("N")}>N</div>
      <div className="mbti black"></div>
      <div className="colorbox mbti green" onClick={() => openModal("T")}>T</div>
      <div className="colorbox mbti lavender" onClick={() => openModal("P")}>P</div>
      <div className="mbti black"></div>
      <div className="colorbox mbti white" onClick={() => openModal("I")}>I</div>
      <div className="colorbox mbti blue" onClick={() => openModal("S")}>S</div>
      <div className="mbti black"></div>
      <div className="colorbox mbti yellow" onClick={() => openModal("F")}>F</div>
      <div className="colorbox mbti red" onClick={() => openModal("J")}>J</div>
=======
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
>>>>>>> a9c009b310c5e6a34362a13ad32d6542cafe0f1b

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
<<<<<<< HEAD
        {/* <h2>{selectedMBTI} 게시판</h2>
        {posts.map((post) => (
          <div key={post.id}>
            <button onClick={() => openPostModal(post.id)}>{post.title}</button>
          </div>
        ))}
        <button onClick={closeModal}>close</button> */}
=======
>>>>>>> a9c009b310c5e6a34362a13ad32d6542cafe0f1b
        <BoardModal
          selectedMBTI={selectedMBTI}
          posts={posts}
          openPostModal={openPostModal}
          closeModal={closeModal}
<<<<<<< HEAD
=======
          createPost={createPost}
>>>>>>> a9c009b310c5e6a34362a13ad32d6542cafe0f1b
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
            <p>Written by: {selectedPost.user_id}</p>
            <p>Views: {selectedPost.views}</p>
            <p>
              Posted at: {new Date(selectedPost.post_time).toLocaleString()}
            </p>

            {comments.map((comment) => (
              <div className="comment-block" key={comment.id}>
                <p>{comment.content}</p>
                <p>Commented by: {comment.user_id}</p>
                <p>Posted at: {new Date(comment.post_time).toLocaleString()}</p>
              </div>
            ))}

            <input
              className="comment-input"
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit}>댓글 작성</button>
          </>
        )}
        <button onClick={closePostModal}>닫기</button>
      </Modal>
    </div>
  );
};

export default Board;
