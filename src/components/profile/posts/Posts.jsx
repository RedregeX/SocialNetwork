import Post from './post/Post';
let ePosts = [{message:"Hello, world", id:1, likes:1341534634}, {message:"Lorem Ipsum is simply dummy text of the printing and typesetting industry.", id:2, likes:679235}, {message:"Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.", id:3, likes:6546457567}, {message:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.", id:4, likes:23423456}];

function Posts() {
    return (
        <div className="posts">
            <div className="posts">
                <p className="myposts">My posts</p>
                <input type="text" placeholder='Enter the post'/>
                <button>Add a post</button>
            </div>
            {ePosts.map(e => <Post  message={e.message} id={e.id} likes={e.likes}/>)}
        </div>
    );
}

export default Posts;
  