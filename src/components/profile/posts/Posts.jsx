import Post from './post/Post';

function Posts(props) {
    return (
        <div className="posts">
            <div className="posts">
                <p className="myposts">My posts</p>
                <input type="text" placeholder='Enter the post'/>
                <button>Add a post</button>
            </div>
            {props.ePosts.map(e => <Post  message={e.message} id={e.id} likes={e.likes}/>)}
        </div>
    );
}

export default Posts;
  