const ADD_POST = "ADD-POST";
const ON_POST_CHANGE = "ON-POST-CHANGE";

let profileReduser = (action, state) =>{
    if (action.type === ADD_POST){
        let newPost = {
            message: state.newPostText,
            id: 4,
            likes: 100000,
        }
        state.newPostText = "";
        state.ePosts.unshift(newPost);
    }
    else if (action.type === ON_POST_CHANGE){
        state.newPostText = action.text;
    }
    return state;
}
export let addPostAC = () =>{
    return {type : ADD_POST, id : 1};
}
export let onPostChangeAC = (postText) =>{
    return {type : ON_POST_CHANGE, text : postText};
}

export default profileReduser; 