import "./Dialogs.css"
import {NavLink} from 'react-router-dom'
import {Route} from 'react-router-dom';
import DII from "./dialogIsItem/DII";

function Dialogs() {
    return (
        <div className="dialogs">
            <div className="message">
                <DII name={"Elon Musk"}/>
                <p>When is apple going to shutdown</p>
            </div> 
            <div className="message">
                <DII name={"Rick Astley"}/>
                <p>This is bla bla bla</p>
            </div>
            <div className="message">
                <DII name={"Silvester Stallone"}/>
                <p>You are dead</p>
            </div>
            <input type="text"/>
            <button className="send">Send</button>
        </div>
    );
}
  
export default Dialogs;
  