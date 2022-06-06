import bill from "../images/bill.jpg";
import max from "../images/maxresdefault.jpg";
import don from "../images/donald.jpg";

let State = {
    profile: {
        ePosts: [
            {message:"Hello, world", id:1, likes:1341534634}, 
            {message:"Lorem Ipsum is simply dummy text of the printing and typesetting industry.", id:2, likes:679235}, 
            {message:"Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.", id:3, likes:6546457567},
            {message:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.", id:4, likes:23423456}
        ],
        newPostText: ""
    },
    dialogs: {
        DialogNames: [
            {name:"Elon Musk", id:1}, 
            {name:"Rick Astley", id:2}, 
            {name:"Silvester Stallone", id:3}
        ],
        DialogMessages: [
            {message:"When is apple going to shutdown", id:1}, 
            {message:"This is bla bla bla", id:2}, 
            {message:"You are dead", id:3}
        ],
        newSendMessage: ""
    },
    sidebar: {
        friends : [
            {id:1, name: "Bill", img:bill},
            {id:2, name: "Linus", img:max},
            {id:3, name: "Donald", img:don}
        ],
    }
};
export let onPostChange = (postText) =>{
    State.profile.newPostText = postText;
    rerenderTree(State);
}
export let addPost = (postText) => {
    let newPost = {
        message: postText,
        id: 4,
        likes: 100000,
    }
    State.profile.newPostText = "";
    State.profile.ePosts.unshift(newPost);
    rerenderTree(State);
}
export let onMessageChange = (sendMessage) => {
    State.dialogs.newSendMessage = sendMessage;
    rerenderTree(State);
}
export let setMessage = (message) =>{
    let newMessage = {
        message: message,
        id: 4,
    }
    State.dialogs.newSendMessage = "";
    State.dialogs.DialogMessages.unshift(newMessage);
    rerenderTree(State);
}
 export let subscribe = (abserver) =>{
    rerenderTree = abserver;
}
let rerenderTree = () =>{
    console.log("fake function");
}
export default State;