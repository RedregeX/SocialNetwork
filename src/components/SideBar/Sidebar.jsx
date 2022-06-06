import './Sidebar.css';
import {NavLink} from 'react-router-dom';
import React from 'react';

function Sidebar(props) {
    return (
      <div className="sidebar">
        <NavLink to="/friends">Friends</NavLink>
        <NavLink to="/messages">Messages</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/dialogs">Dialogs</NavLink>
        <p className='friendsPar'>Friends</p>
        <div className="friends">
          {props.friends.map(e => {
            return (
              <div className="container" key={e.id}>
                <img src={e.img}></img>
                <br />
                <p>{e.name}</p>
              </div>
            );
          })}
        </div>
      </div>
  );
}
  
export default Sidebar;
