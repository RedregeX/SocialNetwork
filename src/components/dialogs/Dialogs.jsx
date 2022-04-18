import "./Dialogs.css"

function Dialogs() {
    return (
        <div className="dialogs">

            <div className="message">
                <p>Elon Musk</p>
                <p>When is apple going to shutdown</p>
            </div> 
            <div className="message">
                <p>Rick Astley</p>
                <p>This is bla bla bla</p>
            </div>
            <div className="message">
                <p>Silvester Stallone</p>
                <p>You are dead</p>
            </div>
            <input type="text"/>
            <button className="send">Send</button>
        </div>
    );
}
  
export default Dialogs;
  