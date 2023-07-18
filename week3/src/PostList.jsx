import React, { useState } from "react";
import Post from "./Post";

const styles = {
  pageBox: {
    display: "flex",
    justifyContent: "center",
  },
};
const postsPerPage = 8;

function PostList(props) {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = props.posts.slice(startIndex, endIndex);

  const totalPages = Math.ceil(props.posts.length / postsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <ul>
        {currentPosts.map((post) => (
          <Post
            title={post.title}
            //content={post.content}
            time={post.time}
            onClick={() => props.openPostModal(post.id)}
          />
        ))}
      </ul>
      <div style={styles.pageBox}>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={currentPage === page}
            >
              {page}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default PostList;
