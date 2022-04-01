import './Profile.css'
import steve from'../../images/SteveJobs.jpg'

function Profile() {
    return (
        <div class = "profile">
            <div className="aboutme">
                <img src={steve} alt="photo" class="steve"/>
                <p class="name">Steve Jobs</p>
            </div>
            <div className="posts">
                <p class="myposts">My posts</p>
                <input type="text" placeholder='Enter the post'/>
                <button>Add a post</button>
                <div className="post">
                    <img src={steve} alt="miniphoto" class="ministeve"/>
                    <span>Steve Jobs</span>
                    <p>Here will be text</p>
                </div>
            </div>
        </div>
    );
  }
  
  export default Profile;
  