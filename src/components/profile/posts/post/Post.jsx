import steve from '../../../../images/SteveJobs.jpg'
import './Post.css';

function Post(props) {
    return (
        <div className="post">
            <img src={steve} alt="miniphoto" class="ministeve"/>
            <span>Steve Jobs</span>
            <p>{props.message}</p>
            <span className='likes'>{props.likes } Likes</span>
        </div>
    );
}
  
export default Post;
  