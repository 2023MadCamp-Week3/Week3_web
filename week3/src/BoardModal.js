import { useContext, useState, useEffect, React } from "react";
import { UserDataContext } from "./UserDataContext";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import PostList from "./PostList";

function BoardModal(props){
    

    return (
        <div className="board-container">
            <div className="sidebar">
                <h2>{props.selectedMBTI} 게시판</h2>
                <button onClick={props.closeModal}>close</button>
            </div>
            <div className="content">
                <PostList posts={props.posts}
                    openPostModal={props.openPostModal}/>
            </div>
        </div>
    );
};

export default BoardModal;