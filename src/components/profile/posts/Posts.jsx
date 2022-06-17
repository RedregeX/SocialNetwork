import Post from './post/Post';
import React from 'react'
import {addPostAC, onPostChangeAC} from '../../../data/State'

let postText = React.createRef();

function Posts(props) {
    let addPost = () => {
        props.dispatch(addPostAC());
        postText.current.value = "";
    }
    let onPostChange = () => {
        props.dispatch(onPostChangeAC(postText.current.value));
    }
    return (
        <div className="posts">
            <p className="myposts">My posts</p>
            <input type="text" placeholder='Enter the post' className="postText" ref={postText} value={props.newPostText} onChange={onPostChange}/>
            <button onClick={addPost}>Add a post</button>
            {props.ePosts.map(e => <Post  message={e.message} key={e.id} likes={e.likes}/>)}
        </div>
    );
}

export default Posts;