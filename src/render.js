import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {addPost} from './data/State';
import {setMessage} from './data/State';

export let rerenderTree = (State) => {
    ReactDOM.render(
      <React.StrictMode>
        <App State = {State} addPost = {addPost} setMessage = {setMessage}/>
      </React.StrictMode>,
      document.getElementById('root')
    );  
  }
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();