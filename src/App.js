import React, { useState, useEffect } from "react";
import "./App.css";
import useCounter from "./useCounter";

function App(props) {
  const [ignore, setIgnore] = useState(true);
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState({});
  const { count, setCount, start, stop } = useCounter(1000, false);

  function handlePermissionGranted() {
    console.log("Permission Granted");
    setIgnore(false);
  }
  function handlePermissionDenied() {
    console.log("Permission Denied");
    setIgnore(false);
  }
  function handleNotSupported() {
    console.log("Web Notification not Supported");
    setIgnore(true);
  }

  function handleNotificationOnClick(e, tag) {
    console.log(e, "Notification clicked tag:" + tag);
  }

  function handleNotificationOnError(e, tag) {
    console.log(e, "Notification error tag:" + tag);
  }

  function handleNotificationOnClose(e, tag) {
    console.log(e, "Notification closed tag:" + tag);
  }

  function handleNotificationOnShow(e, tag) {
    console.log(e, "Notification shown tag:" + tag);
  }

  function handleButtonClick() {
    setCount(0);
    start();
  }

  function showNotification() {
    // Available options
    // See https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
    const options = {
      tag: "timer-1",
      body: "Count: " + count,
      lang: "en",
      silent: true,
      // renotify: true,
      requireInteraction: true
    };
    window.Notification.requestPermission(function(result) {
      if (result === "granted") {
        navigator.serviceWorker.ready.then(function(registration) {
          props.swRegistration.showNotification(title, options);
        });
      }
    });
  }

  useEffect(() => {
    if (count >= 0) {
      showNotification();
    }
    return () => count;
  }, [count]);

  useEffect(() => {
    console.log(options);
  }, [options]);

  return (
    <div className="App">
      <h2>{count}</h2>
      <button onClick={handleButtonClick.bind()}>Start</button>
      <button
        onClick={() => {
          stop();
          setCount(0);
        }}
      >
        Stop
      </button>
    </div>
  );
}

export default App;
