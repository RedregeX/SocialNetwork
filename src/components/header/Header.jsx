import './Header.css';
import logo from '../../images/icons8-wechat.svg';
import {NavLink} from 'react-router-dom'

function Header() {
  return (
    <div className = "header">
      <NavLink to="/profile"><img src={logo} alt="logo" /></NavLink>
    </div>
  );
}

export default Header;
