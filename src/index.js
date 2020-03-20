import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";


let web_worker;

/**If web workers are supported, create a new one that utilises background_process.js
 * and store it inside of web_worker. Setup an event listener that is triggered when
 * postMessage() is called from within background_process.js. This event listener will call updateTimer(),
 * passing in the data received from postMessage() which should only contain a type and a value.*/

if (typeof (Worker) !== "undefined") {
  if (typeof (web_worker) == "undefined") {
    web_worker = new Worker("background_process.js");
  }
}
else {
  window.alert("Browser not supported..");
}


if ("serviceWorker" in navigator) {
  // if (
  //   process.env.NODE_ENV === 'production' &&
  //   ('https:' === location.protocol || location.host.match(/(localhost|127.0.0.1)/)) &&
  //   navigator.serviceWorker
  // ) {
  navigator.serviceWorker.register("./sw.js").then(
    function (registration) {
      // Registration was successful
      console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      );
      ReactDOM.render(
        <App swRegistration={registration} webWorker={web_worker} />,
        document.getElementById("root")
      );
    },
    function (err) {
      // registration failed :(
      console.log("ServiceWorker registration failed: ", err);
    }
  );
  // }
}


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
