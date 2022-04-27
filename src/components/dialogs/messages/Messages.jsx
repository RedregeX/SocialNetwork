import {NavLink} from 'react-router-dom'
import React from 'react'

function Messages(props) {
    return (
        <div className="message">
            <p>{props.message}</p>
        </div>
    );
  }
  
  export default Messages;