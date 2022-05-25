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
          <Sidebar friends = {props.State.sidebar.friends}/>
          <Route path = "/profile" render = {() => <Profile ePosts = {props.State.profile.ePosts} addPost = {props.addPost}/>}/>
        </div>
        <Route path = "/dialogs" render = {() => <Dialogs DialogMessages = {props.State.dialogs.DialogMessages} DialogNames = {props.State.dialogs.DialogNames} setMessage = {props.setMessage}/>}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
