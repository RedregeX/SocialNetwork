import './Profile.css';
import Posts from './posts/Posts';
import ProfileInfo from './profileinfo/ProfileInfo';

function Profile() {
    return (
        <div className = "profile">
            <ProfileInfo />
            <Posts />
        </div>
    );
  }
  
  export default Profile;
  