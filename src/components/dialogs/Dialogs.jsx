import "./Dialogs.css"
import {NavLink} from 'react-router-dom'
import {Route} from 'react-router-dom';
import DII from "./dialogIsItem/DII";
import Messages from "./messages/Messages";

let DialogNames = [{name:"Elon Musk", id:1}, {name:"Rick Astley", id:2}, {name:"Silvester Stallone", id:3}];
let DialogMessages = [{message:"When is apple going to shutdown", id:1}, {message:"This is bla bla bla", id:2}, {message:"You are dead", id:3}]
function Dialogs() {
    return (
        <div className="dialogs">
            <div className="usmes">
                <div className="Usernames">
                    {DialogNames.map(e => <DII  name={e.name} id={e.id}/>)}
                </div> 
                <div className="messages">
                    {DialogMessages.map(e => <Messages  message={e.message} id={e.id}/>)}
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
  