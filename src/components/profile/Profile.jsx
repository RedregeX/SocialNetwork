import './Profile.css'
import steve from'../../images/SteveJobs.jpg'
import Posts from './posts/Posts';

function Profile() {
    return (
        <div class = "profile">
            <div className="aboutme">
                <img src={steve} alt="photo" class="steve"/>
                <div className="info">
                    <p class="name">Steve Jobs</p>
                    <div className="worknplace">
                        <p class="from">Lives in California</p>
                        <p class="job">Works at Apple</p>
                    </div>
                </div>
            </div>
            <Posts />
        </div>
    );
  }
  
  export default Profile;
  