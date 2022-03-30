import './Profile.css'
import steve from'../../images/SteveJobs.jpg'

function Profile() {
    return (
        <div class = "profile">
            <div className="aboutme">
                <img src={steve} alt="photo" class="steve"/>
                <p>Steve</p>
                <p>Jobs</p>
            </div>
            <div className="posts">
                <input type="text" placeholder='Enter the post'/>
                <button>Add a post</button>
            </div>
        </div>
    );
  }
  
  export default Profile;
  