import { useContext, useState, useEffect, React } from "react";
import { UserDataContext } from "./UserDataContext";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import Modal from "react-modal";
import PostList from "./PostList";

Modal.setAppElement("#root");

function BoardModal(props) {
  const [newPostModalOpen, setNewPostModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const handleNewPostChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleNewPostSubmit = (e) => {
    e.preventDefault();
    props.createPost(newPost);
    setNewPost({ title: "", content: "" });
    setNewPostModalOpen(false);
  };

  const closeModal = () => {
    setNewPostModalOpen(false);
  };

  return (
    <div >
      <div className="sidebar">
        <h2>{props.selectedMBTI} 게시판</h2>
        <button onClick={() => setNewPostModalOpen(true)}>글 작성</button>
        <button onClick={props.closeModal}>닫기</button>
      </div>
      <div className="content">
        <PostList posts={props.posts} openPostModal={props.openPostModal} />
      </div>

      <Modal
        isOpen={newPostModalOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >

        <div className="new-post-modal" style={{width: "100%" }}>

          <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
            <h2>새 글 작성</h2>
            <button style={{width: "100px", padding: "10px"}} onClick={() => setNewPostModalOpen(false)}>닫기</button>
          </div>
          
          <form onSubmit={handleNewPostSubmit} style={{width: "100%" }}>
            <label>
              제목:
              <input
                style={{width: "100%", border: "1px solid black"}}
                type="text"
                name="title"
                value={newPost.title}
                onChange={handleNewPostChange}
                required
              />
            </label>
            <label>
              내용:
              <textarea
                style={{width: "100%"}}
                name="content"
                value={newPost.content}
                onChange={handleNewPostChange}
                required
              />
            </label>
            <button type="submit" style={{width: "100px", padding: "10px"}}>게시하기</button>
            
          </form>
          
        </div>
      </Modal>
        
        
    </div>
  );
}

export default BoardModal;
