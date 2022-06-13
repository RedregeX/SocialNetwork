import "./Dialogs.css"
import {NavLink} from 'react-router-dom'
import {Route} from 'react-router-dom';
import DII from "./dialogIsItem/DII";
import Messages from "./messages/Messages";
import React from 'react'

let newMessage = React.createRef();

function Dialogs(props) {
    let setMessage = () => {
        props.dispatch({type : "SET-MESSAGE"});
    }
    let onMessageChange = () => {
        props.dispatch({type : "ON-MESSAGE-CHANGE", text : newMessage.current.value});
    }
    return (
        <div className="dialogs">
            <div className="usmes">
                <div className="Usernames">
                    {props.DialogNames.map(e => <DII  name={e.name} key={e.id}/>)}
                </div> 
                <div className="messages">
                    {props.DialogMessages.map(e => <Messages  message={e.message} key={e.id}/>)}
                </div>
            </div>
            <div className="binput">
                <input type="text" placeholder="Enter your message" className="enter" ref={newMessage} onChange={onMessageChange} value={props.newSendMessage}/>
                <button className="send" onClick={setMessage}>Send</button>
            </div>
        </div>
    );
}
  
export default Dialogs;
  