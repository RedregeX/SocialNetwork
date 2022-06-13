import bill from "../images/bill.jpg";
import max from "../images/maxresdefault.jpg";
import don from "../images/donald.jpg";

let store = {
    _state: {
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
                {message:"When is apple going to shutdown", id:1, key:1}, 
                {message:"This is bla bla bla", id:2, key:2}, 
                {message:"You are dead", id:3, key:3}
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
    },
    // onPostChange(postText){
    //     this._state.profile.newPostText = postText;
    //     this.rerenderTree(this._state);
    // },
    // addPost(postText){
    //     let newPost = {
    //         message: postText,
    //         id: 4,
    //         likes: 100000,
    //     }
    //     this._state.profile.newPostText = "";
    //     this._state.profile.ePosts.unshift(newPost);
    //     this.rerenderTree(this._state);
    // },
    // onMessageChange(sendMessage){
    //     this._state.dialogs.newSendMessage = sendMessage;
    //     this.rerenderTree(this._state);
    // },
    // setMessage(message){
    //     let newMessage = {
    //         message: message,
    //         id: 4,
    //     }
    //     this._state.dialogs.newSendMessage = "";
    //     this._state.dialogs.DialogMessages.unshift(newMessage);
    //     this.rerenderTree(this._state);
    // },
    subscribe(abserver){
        this.rerenderTree = abserver;
    },
    rerenderTree(){
        console.log("fake function");
    },
    getState(){
        return this._state;
    },
    dispatch(action){
        if (action.type == "ADD-POST"){
            let newPost = {
                message: this._state.profile.newPostText,
                id: 4,
                likes: 100000,
            }
            this._state.profile.newPostText = "";
            this._state.profile.ePosts.unshift(newPost);
            this.rerenderTree(this._state);
        }
        else if (action.type == "ON-POST-CHANGE"){
            this._state.profile.newPostText = action.text;
            this.rerenderTree(this._state);
        }
        else if (action.type == "ON-MESSAGE-CHAGE"){
            this._state.dialogs.newSendMessage = action.text;
            this.rerenderTree(this._state);
        }
        else if (action.type == "SET-MESSAGE"){
            let newMessage = {
                message: this._state.dialogs.newSendMessage,
                id: 5,
            }
            this._state.dialogs.newSendMessage = "";
            this._state.dialogs.DialogMessages.unshift(newMessage);
            this.rerenderTree(this._state);
        }
    }
}

export default store;