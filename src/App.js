import logo from './logo.svg';
import './App.css';
import Header from './components/header/Header';
import Profile from './components/profile/Profile';
import Sidebar from './components/SideBar/Sidebar';
import Dialogs from './components/dialogs/Dialogs';
import {BrowserRouter, Route} from 'react-router-dom';

function App(props) {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Header />
        <div className="sideprofile">
          <Sidebar friends = {props.state.sidebar.friends}/>
          <Route path = "/profile" render = {() => <Profile ePosts = {props.state.profile.ePosts} addPost = {props.addPost} newPostText = {props.state.profile.newPostText} onPostChange = {props.onPostChange}/>}/>
        </div>
        <Route path = "/dialogs" render = {() => <Dialogs DialogMessages = {props.state.dialogs.DialogMessages} DialogNames = {props.state.dialogs.DialogNames} setMessage = {props.setMessage} onMessageChange = {props.onMessageChange}/>}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
