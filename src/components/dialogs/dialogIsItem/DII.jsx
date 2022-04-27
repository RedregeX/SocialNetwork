import {NavLink} from 'react-router-dom'
import React from 'react'

function DII(props) {
    return (
        <div className="username">
          <NavLink to={`/dialogs/${props.id}`}>{props.name}</NavLink>
        </div>
    );
  }
  
  export default DII;