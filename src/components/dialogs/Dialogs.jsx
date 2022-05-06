import "./Dialogs.css"
import {NavLink} from 'react-router-dom'
import {Route} from 'react-router-dom';
import DII from "./dialogIsItem/DII";
import Messages from "./messages/Messages";

function Dialogs(props) {
    return (
        <div className="dialogs">
            <div className="usmes">
                <div className="Usernames">
                    {props.DialogNames.map(e => <DII  name={e.name} id={e.id}/>)}
                </div> 
                <div className="messages">
                    {props.DialogMessages.map(e => <Messages  message={e.message} id={e.id}/>)}
                </div>
            </div>
            <div className="binput">
                <input type="text" placeholder="Enter your message" className="enter"/>
                <button className="send">Send</button>
            </div>
        </div>
    );
}
  
export default Dialogs;
  