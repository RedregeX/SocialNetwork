import './Sidebar.css'
import {NavLink} from 'react-router-dom'
import React from 'react'

function Sidebar() {
    return (
      <div className="sidebar">
        <NavLink to="/friends">Friends</NavLink>
        <NavLink to="/messages">Messages</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/dialogs">Dialogs</NavLink>
      </div>
    );
  }
  
  export default Sidebar;
  