import './Header.css';
import logo from '../../images/icons8-wechat.svg';

function Header() {
  return (
    <div class = "header">
      <img src={logo} alt="logo" />
    </div>
  );
}

export default Header;
