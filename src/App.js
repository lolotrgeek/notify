import React, { useState, useEffect } from "react";
import "./App.css";
import useCounter from "./useCounter";

function App(props) {
  const [ignore, setIgnore] = useState(true);
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState({});
  // const { count, setCount, start, stop } = useCounter(1000, false);
  const [enabled, setEnabled] = useState(false)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const storage = window.localStorage;

  const changeState = () => {
    /*Stops or starts the web worker timer counting depending on the state of this timer object*/
    let newState = !enabled
    console.log('newState', newState, enabled)
    setEnabled(newState)
    props.webWorker.postMessage(["state_change", newState]);
    setAllStorage();
  }

  /**Tell the web worker to reset it's values for the timer, and then clear the timer within the html.
   * If the timer is still running, pause it after resetting and then update the local storage.*/
  function reset() {
    //Reset the timer.
    props.webWorker.postMessage(["reset"]);
    setHours("00")
    setMinutes("00")
    setSeconds("00")
    if (enabled) changeState()
    setAllStorage();
  };


  /**The function that takes the new values from the counted timer on the web worker and
   * updates the html. It also controls when a sound should be played to signal a reminder and
   * autosaves the timer in localstorage every 10 seconds.*/
  function updateTimer(data) {
    /*data is passed when the web worker posts a message and contains a type and a value.
    data.type is either 'hh', 'mm' or 'ss' and the value is the corresponding updated value.*/
    switch (data.type) {
      default:
        break;
      case 'ss':
        setSeconds(makeTimeString(data.value)) //Set the html for seconds to the new data.value.
        /*If 10 seconds has passed, update the local storage*/
        if (data.value % 10 === 0) setAllStorage()
        break;
      case 'mm':
        setMinutes(makeTimeString(data.value))
        break;
      case 'hh':
        setHours(makeTimeString(data.value))
        break;
    }
  }

  const handleUpdate = () => {
    props.webWorker.onmessage = function (event) {
      updateTimer(event.data);
      showNotification();
    };
  }

  /**Sets all of the stored values from the timer to the current values in the html.*/
  function setAllStorage() {
    storage.setItem("hh", hours);
    storage.setItem("mm", minutes);
    storage.setItem("ss", seconds);
  }

  /**Is called when app.js is first loaded.*/
  function init() {
    //If no local storage exists for the timer.
    if (storage.getItem("ss") === null || storage.getItem("ss") === undefined) {
      /**Store the timer values to localStorage once initially so retrieval
      * doesn't ever return null or undefined in the case of a timer not
      * being recently saved to local storage.*/
      setAllStorage();
    }
    else {
      /*Make the current timer values in the html equal to the locally stored values.*/
      setHours(storage.getItem("hh"))
      setMinutes(storage.getItem("mm"))
      setSeconds(storage.getItem("ss"))

      /*Tell the web worker to update it's values by the locally stored values parsed as integers.*/
      props.webWorker.postMessage(["update_from_storage", parseInt(hours),
        parseInt(minutes), parseInt(seconds)]);
    }
    /**If the user closes the page in any shape or form, save the current timer values to local storage.*/
    window.addEventListener("beforeunload", function (e) {
      setAllStorage();
      return null;
    });
  }

  function makeTimeString(num) {
    num = num.toString();
    if (num < 10) {
      num = '0' + num;
    }
    return num;
  }

  function showNotification(body) {
    // Available options
    // See https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
    const options = {
      tag: "timer-1",
      body: `Count:  ${hours && minutes && seconds ? `${hours} : ${minutes} : ${seconds}` : ''}`,
      lang: "en",
      silent: true,
      // renotify: true,
      requireInteraction: true
    };
    window.Notification.requestPermission(function (result) {
      if (result === "granted") {
        navigator.serviceWorker.ready.then(function (registration) {
          props.swRegistration.showNotification(title, options);
        });
      }
    });
  }
  useEffect(() => init(), [])

  useEffect(() => {
    handleUpdate()
  }, [hours, minutes, seconds])

  useEffect(() => {
    console.log(options);
  }, [options]);

  return (
    <div className="App">
      <h2>{hours && minutes && seconds ? `${hours} : ${minutes} : ${seconds}` : ''}</h2>
      <button onClick={changeState.bind()}>Start</button>
      <button onClick={() => { reset.bind()}}>Stop</button>
    </div>
  );
}

export default App;
