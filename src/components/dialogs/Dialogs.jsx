import "./Dialogs.css"
import {NavLink} from 'react-router-dom'
import {Route} from 'react-router-dom';
import DII from "./dialogIsItem/DII";
import Messages from "./messages/Messages";


function Dialogs() {
    return (
        <div className="dialogs">
            <div className="usmes">
                <div className="Usernames">
                    <DII name={"Elon Musk"} id={"1"}/>
                    <DII name={"Rick Astley"} id={"2"}/>
                    <DII name={"Silvester Stallone"} id={"3"}/>
                </div> 
                <div className="messages">
                    <Messages message={"When is apple going to shutdown"} />
                    <Messages message={"This is bla bla bla"} />
                    <Messages message={"You are dead"} />
                </div>
            </div>
            <div className="binput">
                <input type="text" placeholder="Enter your message"/>
                <button className="send">Send</button>
            </div>
        </div>
    );
}
  
export default Dialogs;
  