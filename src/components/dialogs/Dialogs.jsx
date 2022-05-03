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
                    {/* <DII name={DialogNames[0].name} id={DialogNames[0].id}/>
                    <DII name={DialogNames[1].name} id={DialogNames[1].id}/>
                    <DII name={DialogNames[2].name} id={DialogNames[2].id}/> */}
                    {DialogNames.map(e => <DII  name={e.name} id={e.id}/>)}
                </div> 
                <div className="messages">
                    {/* <Messages message={DialogMessages[0].message} id={DialogMessages[0].id} />
                    <Messages message={DialogMessages[1].message} id={DialogMessages[1].id} />
                    <Messages message={DialogMessages[2].message} id={DialogMessages[2].id} /> */}
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
  