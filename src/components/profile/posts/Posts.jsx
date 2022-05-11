import Post from './post/Post';
import React from 'react'

let postText = React.createRef();

function Posts(props) {
    let addPost = () => {
        props.addPost(postText.current.value);
    }
    return (
        <div className="posts">
            <p className="myposts">My posts</p>
            <input type="text" placeholder='Enter the post' className="postText" ref={postText}/>
            <button onClick={addPost}>Add a post</button>
            {props.ePosts.map(e => <Post  message={e.message} id={e.id} likes={e.likes}/>)}
        </div>
    );
}

export default Posts;
  