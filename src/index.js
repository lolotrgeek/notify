import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

if ("serviceWorker" in navigator) {
  // if (
  //   process.env.NODE_ENV === 'production' &&
  //   ('https:' === location.protocol || location.host.match(/(localhost|127.0.0.1)/)) &&
  //   navigator.serviceWorker
  // ) {
  navigator.serviceWorker.register("./sw.js").then(
    function(registration) {
      // Registration was successful
      console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      );
      ReactDOM.render(
        <App swRegistration={registration} />,
        document.getElementById("root")
      );
    },
    function(err) {
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
