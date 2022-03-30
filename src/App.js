import logo from './logo.svg';
import './App.css';
import Header from './components/header/Header';
import Profile from './components/profile/Profile';
import Sidebar from './components/SideBar/Sidebar';

function App() {
  return (
    <div class="wrapper">
      <Header />
      <div className="sideprofile">
        <Sidebar />
        <Profile />
      </div>
    </div>
  );
}

export default App;
