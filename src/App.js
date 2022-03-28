import logo from './logo.svg';
import './App.css';
import Header from './header/Header';
import Profile from './profile/Profile';
import Sidebar from './SideBar/Sidebar';

function App() {
  return (
    <div class="wrapper">
      <Header />
      <Profile />
      <Sidebar />
    </div>
  );
}

export default App;
