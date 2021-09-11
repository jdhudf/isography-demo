import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux'
import store from './redux/store';
import background from './images/isometric.png';
import icon from './images/icon_2.svg';

import logo from './images/splash_logo.svg';

const Mobile = () => {

  return (
    <div className="not" style={{
      backgroundImage: `url(${background})`
    }}>
      <img src={icon} alt=""/>
      <div className="message">
        <h1>Isography</h1>
        <p>You can't use isography <br/>on mobile and tablet</p>
        <p>I'm working on this now. <br/>Please wait.</p>
      </div>
    </div>
  )
}

function PcOrMobile() {

  var ua = navigator.userAgent;

  if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)){
      return <Mobile />;
  } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0 || (/iPad|Macintosh/i.test(navigator.userAgent)
&& 'ontouchend' in document)){
      return <Mobile />;
  }else{
      return <App />;
  }
}

window.addEventListener('DOMContentLoaded', function () {
  const div = document.createElement("div")
  const img = document.createElement('img');

  img.src = logo;
  img.alt = '';

  div.id = "splash"
  div.style.width = "100vw"
  div.style.height = "100vh"
  div.style.background = "#fff"
  div.style.position = "absolute"
  div.style.top = "0"
  div.style.left = "0"
  div.style.right = "0"
  div.style.bottom = "0"
  div.style.zIndex = "999999"

  img.style.width = "100%"
  img.style.maxWidth="350px"
  img.style.position = "absolute"
  img.style.top = "50%"
  img.style.left = "50%"
  img.style.transform = "translate(-50%,-50%)"

  div.appendChild(img);
  document.body.appendChild(div);
});

window.onload = function () {
    const div = document.getElementById('splash');
    window.setTimeout(function(){
      div.style.transition = "all ease .5s"
      div.style.opacity = "0"
    }, 1000);
    window.setTimeout(function(){
      div.style.display = "none"
      div.remove()
    }, 1500);
};


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PcOrMobile />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
