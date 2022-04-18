import logo from './logo.svg';
import './App.css';
import Header from './components/header/Header';
import Profile from './components/profile/Profile';
import Sidebar from './components/SideBar/Sidebar';
import Dialogs from './components/dialogs/Dialogs';
import {BrowserRouter, Route} from 'react-router-dom';

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Header />
        <div className="sideprofile">
          <Sidebar />
          <Route path = "/profile" component = {Profile}/>
        </div>
        <Route path = "/dialogs" component = {Dialogs}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
