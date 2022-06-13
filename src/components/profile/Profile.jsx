import './Profile.css';
import Posts from './posts/Posts';
import ProfileInfo from './profileinfo/ProfileInfo';

function Profile(props) {
    return (
        <div className = "profile">
            <ProfileInfo />
            <Posts ePosts = {props.ePosts} newPostText ={props.newPostText} dispatch = {props.dispatch}/>
        </div>
    );
  }
  
  export default Profile;
  