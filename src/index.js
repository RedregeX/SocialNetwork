import store from './data/State';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import {addPost} from './data/_state';
// import {setMessage} from './data/_state';
// import { onPostChange } from './data/_state';
// import { onMessageChange } from './data/_state';
// import { subscribe } from './data/_state';


export let rerenderTree = (_state) => {
    ReactDOM.render(
      <React.StrictMode>
        <App state = {store._state} addPost = {store.addPost.bind(store)} setMessage = {store.setMessage.bind(store)} onPostChange = {store.onPostChange.bind(store)} onMessageChange = {store.onMessageChange.bind(store)}/>
      </React.StrictMode>,
      document.getElementById('root')
    );  
  }
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
rerenderTree(store.getState());
store.subscribe(rerenderTree);
reportWebVitals();

