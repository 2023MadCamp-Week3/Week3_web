import { useContext, useState, useEffect, React } from "react";
import { UserDataContext } from "./UserDataContext";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import PostList from "./PostList";

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

  return (
    <div className="board-container">
      <div className="sidebar">
        <h2>{props.selectedMBTI} 게시판</h2>
        <button onClick={() => setNewPostModalOpen(true)}>글 작성</button>
        <button onClick={props.closeModal}>닫기</button>
      </div>
      <div className="content">
        <PostList posts={props.posts} openPostModal={props.openPostModal} />
      </div>

      {newPostModalOpen && (
        <div className="new-post-modal">
          <h2>새 글 작성</h2>
          <form onSubmit={handleNewPostSubmit}>
            <label>
              제목:
              <input
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
                name="content"
                value={newPost.content}
                onChange={handleNewPostChange}
                required
              />
            </label>
            <button type="submit">게시하기</button>
          </form>
          <button onClick={() => setNewPostModalOpen(false)}>닫기</button>
        </div>
      )}
    </div>
  );
}

export default BoardModal;
