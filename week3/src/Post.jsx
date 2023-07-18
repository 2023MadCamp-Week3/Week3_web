import React from "react";
const styles = {
    wrapper: {
        padding: 8,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "black",
        border: "1px solid grey",
        borderRadius: 0,
    },
    imageContainer: {},
    image: {
        width:70,
        height:70,
        borderRadius: 35,
    },
    contentContainer: {
        marginLeft: 8,
        display: "flex",
        flexDirection: "Column",
        justifyContent: "center",
    },
    rowContainer: {
        flexDirection: "Row",
        justifyContent: "space-between",
        display: "flex",
    },
    titleText: {
        margin: 5,
        color: "white",
        fontSize:30,
        fontWeight: "bold",
    },
    postText: {
        margin: 5,
        color: "white",
        fontSize: 16,
    }
};

function Post(props){
    //이거 시발 왜안됨?
    //var colorcode ="#" + Math.round(Math.random() * 0xfffff).toString(16);
    

    return (
        <div style={styles.wrapper} onClick={props.onClick}>
            {/* <div style={styles.imageContainer}>
                <img
                    src="https://filmforum.org/do-not-enter-or-modify-or-erase/client-uploads/films/PIERROT-THUMB.jpg"
                    style={styles.image}
                />
            </div> */}

            <div style={styles.contentContainer}>

                <span style={styles.titleText}>{props.title}</span>

                <span style={styles.rowContainer}>
                    <div style ={styles.postText}>{props.content}</div>
                    <div style ={styles.postText}>{props.time}</div>
                </span>
                
            </div>

        </div>


        
    )
}

export default Post;