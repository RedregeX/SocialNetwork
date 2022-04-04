import Post from './post/Post';

function Posts() {
    return (
        <div className="posts">
            <div className="posts">
                <p class="myposts">My posts</p>
                <input type="text" placeholder='Enter the post'/>
                <button>Add a post</button>
            </div>
            <Post message = "Hello, world"/>
            <Post message = "Lorem Ipsum is simply dummy text of the printing and typesetting industry."/>
            <Post message = "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old."/>
            <Post message = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."/>
        </div>
    );
}
  
export default Posts;
  