import steve from '../../../../images/SteveJobs.jpg'

function Post(props) {
    return (
        <div className="post">
            <img src={steve} alt="miniphoto" class="ministeve"/>
            <span>Steve Jobs</span>
            <p>{props.message}</p>
        </div>
    );
}
  
export default Post;
  