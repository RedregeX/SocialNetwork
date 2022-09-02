const ON_MESSAGE_CHANGE = "ON-MESSAGE-CHANGE";
const SET_MESSAGE = "SET-MESSAGE"

let dialogsReduser = (action, state) =>{
    if (action.type === ON_MESSAGE_CHANGE){
        state.newSendMessage = action.text;
    }
    else if (action.type === SET_MESSAGE){
        let newMessage = {
            message: state.newSendMessage,
            id: 5,
        }
        state.newSendMessage = "";
        state.DialogMessages.unshift(newMessage);
    }
    return state;
}
export let onMessageChangeAC = (newMessage) =>{
    return {type : ON_MESSAGE_CHANGE, text : newMessage};
}
export let setMessageAC = () =>{
    return {type : SET_MESSAGE, id : 1};
}

export default dialogsReduser;