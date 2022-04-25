import {NavLink} from 'react-router-dom'
import React from 'react'

function DII(props) {
    return (
      <>
          <div className="message">
            <NavLink to="/dialogs/1">{props.name}</NavLink>
          </div>
      </>
    );
  }
  
  export default DII;