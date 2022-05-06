import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

let ePosts = [{message:"Hello, world", id:1, likes:1341534634}, {message:"Lorem Ipsum is simply dummy text of the printing and typesetting industry.", id:2, likes:679235}, {message:"Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.", id:3, likes:6546457567}, {message:"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.", id:4, likes:23423456}];
let DialogNames = [{name:"Elon Musk", id:1}, {name:"Rick Astley", id:2}, {name:"Silvester Stallone", id:3}];
let DialogMessages = [{message:"When is apple going to shutdown", id:1}, {message:"This is bla bla bla", id:2}, {message:"You are dead", id:3}]

ReactDOM.render(
  <React.StrictMode>
    <App ePosts = {ePosts} DialogMessages = {DialogMessages} DialogNames = {DialogNames}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
